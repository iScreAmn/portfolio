/**
 * Клиентский трекер аналитики.
 *
 * Шлёт события на собственный Express по NEXT_PUBLIC_API_URL. События копятся
 * в очереди и уходят батчами, чтобы не долбить сеть на каждый клик.
 *
 * Публичный API:
 *   initAnalytics()                                  — один раз при старте приложения
 *   trackPageview(path, title)                       — просмотр страницы
 *   trackEvent(category, action, label, params)      — произвольное событие
 *   flushAnalytics()                                 — принудительно отправить очередь
 *   setAnalyticsEnabled(bool)                        — переключатель для баннера согласия
 */

import { getApiBase } from '../utils/apiBase'

const ENDPOINT = `${getApiBase()}/api/analytics`

const MAX_BATCH = 50 // столько же событий за раз принимает сервер
const FLUSH_SIZE = 10 // отправляем, как только накопилось столько
const FLUSH_MS = 8000 // ...или прошло столько времени
const SESSION_TTL_MS = 30 * 60 * 1000 // 30 минут без активности = новая сессия

const SESSION_KEY = 'pa:session'
const VISITOR_KEY = 'pa:visitor'
const OPTOUT_KEY = 'pa:optout'

let queue = []
let timer = null
let started = false
let pageEnteredAt = 0

/* ------------------------------------------------------------------ utils */

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'

const uuid = () =>
  crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const safeStorage = (store) => {
  try {
    const s = window[store]
    const probe = '__pa__'
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null // Safari private mode и подобное
  }
}

/** Аналитика выключена: opt-out, Do Not Track, админка или локальная разработка. */
function isDisabled() {
  if (!isBrowser()) return true
  if (safeStorage('localStorage')?.getItem(OPTOUT_KEY) === '1') return true
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return true
  // собственные визиты в админку не должны попадать в статистику сайта
  if (window.location.pathname.startsWith('/admin')) return true
  if (
    process.env.NODE_ENV !== 'production' &&
    !process.env.NEXT_PUBLIC_ANALYTICS_IN_DEV
  )
    return true
  return false
}

export function setAnalyticsEnabled(enabled) {
  const ls = safeStorage('localStorage')
  if (!ls) return
  if (enabled) ls.removeItem(OPTOUT_KEY)
  else {
    ls.setItem(OPTOUT_KEY, '1')
    queue = []
  }
}

/* --------------------------------------------------------------- identity */

function getSessionId() {
  const ss = safeStorage('sessionStorage')
  const now = Date.now()
  if (!ss) return `mem-${now.toString(36)}`

  try {
    const raw = ss.getItem(SESSION_KEY)
    const saved = raw ? JSON.parse(raw) : null
    if (saved?.id && now - saved.seen < SESSION_TTL_MS) {
      ss.setItem(SESSION_KEY, JSON.stringify({ id: saved.id, seen: now }))
      return saved.id
    }
  } catch {
    /* пересоздадим ниже */
  }

  const id = uuid()
  ss.setItem(SESSION_KEY, JSON.stringify({ id, seen: now }))
  return id
}

/** Анонимный, но стабильный между визитами идентификатор — чтобы считать возвраты. */
function getVisitorId() {
  const ls = safeStorage('localStorage')
  if (!ls) return null
  let id = ls.getItem(VISITOR_KEY)
  if (!id) {
    id = uuid()
    ls.setItem(VISITOR_KEY, id)
  }
  return id
}

/* ----------------------------------------------------------------- device */

function detectDevice() {
  const ua = navigator.userAgent || ''
  const uaData = navigator.userAgentData

  let deviceType = 'desktop'
  if (/\b(iPad|Tablet)\b|Android(?!.*Mobile)/i.test(ua)) deviceType = 'tablet'
  else if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) deviceType = 'mobile'
  else if (/SmartTV|AppleTV|GoogleTV|HbbTV/i.test(ua)) deviceType = 'tv'
  if (uaData?.mobile && deviceType === 'desktop') deviceType = 'mobile'

  let os = 'unknown'
  if (uaData?.platform) os = uaData.platform
  else if (/Windows NT/i.test(ua)) os = 'Windows'
  else if (/Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/(iPhone|iPad|iPod)/i.test(ua)) os = 'iOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  let browser = 'unknown'
  const brands = uaData?.brands?.filter((b) => !/Not.?A.?Brand/i.test(b.brand))
  if (brands?.length) browser = brands[brands.length - 1].brand
  else if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera'
  else if (/YaBrowser/i.test(ua)) browser = 'Yandex'
  else if (/Firefox\//i.test(ua)) browser = 'Firefox'
  else if (/Chrome\//i.test(ua)) browser = 'Chrome'
  else if (/Safari\//i.test(ua)) browser = 'Safari'

  return {
    deviceType,
    os,
    browser,
    screenWidth: String(window.screen?.width ?? ''),
    screenHeight: String(window.screen?.height ?? ''),
  }
}

/* ----------------------------------------------------------------- source */

const SEARCH_RE = /(google|yandex|bing|duckduckgo|yahoo|baidu|ecosia|brave|search)\./i
const SOCIAL_RE =
  /(t\.me|telegram|vk\.com|facebook|instagram|linkedin|twitter|x\.com|reddit|youtube|tiktok|threads|dev\.to|habr)/i

function detectSource() {
  const params = new URLSearchParams(window.location.search)
  const utm = {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  }

  const ref = document.referrer || ''
  let sourceType = 'direct'

  if (utm.utmSource || utm.utmCampaign) sourceType = 'campaign'
  else if (!ref) sourceType = 'direct'
  else {
    try {
      const refHost = new URL(ref).hostname
      if (refHost === window.location.hostname) sourceType = 'internal'
      else if (SEARCH_RE.test(refHost)) sourceType = 'search'
      else if (SOCIAL_RE.test(refHost)) sourceType = 'social'
      else sourceType = 'referral'
    } catch {
      sourceType = 'unknown'
    }
  }

  return { ...utm, sourceType, referrer: ref || undefined }
}

/* ------------------------------------------------------------ core sender */

function baseEvent() {
  const { pathname, search, hash, href, hostname, origin } = window.location
  return {
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    timestamp: new Date().toISOString(),
    url: href,
    hostname,
    origin,
    path: pathname + search + hash,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...detectDevice(),
    ...detectSource(),
  }
}

function enqueue(event) {
  if (isDisabled()) return
  queue.push({ ...baseEvent(), ...event })

  if (queue.length >= FLUSH_SIZE) {
    flushAnalytics()
    return
  }
  if (!timer) {
    timer = setTimeout(() => {
      timer = null
      flushAnalytics()
    }, FLUSH_MS)
  }
}

/**
 * Отправка очереди.
 * keepalive: true — запрос переживает закрытие вкладки, поэтому последние
 * события визита не теряются.
 */
export function flushAnalytics() {
  if (!queue.length) return Promise.resolve()

  const batch = queue.slice(0, MAX_BATCH)
  queue = queue.slice(MAX_BATCH)

  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  return fetch(ENDPOINT, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
  }).catch(() => {
    // Сеть отвалилась — аналитика не должна ломать сайт. Молча забываем батч.
  })
}

/* -------------------------------------------------------------- public API */

export function trackEvent(category, action, label, params) {
  enqueue({
    category,
    action,
    label,
    params: params && typeof params === 'object' ? params : undefined,
  })
}

export function trackPageview(path, title) {
  // время на предыдущей странице — считаем перед сменой маршрута
  if (pageEnteredAt) {
    const seconds = Math.round((Date.now() - pageEnteredAt) / 1000)
    if (seconds > 0 && seconds < 3600) {
      enqueue({ category: 'page', action: 'time_on_page', params: { seconds } })
    }
  }
  pageEnteredAt = Date.now()

  enqueue({
    category: 'page',
    action: 'pageview',
    label: title ?? document.title,
    params: path ? { path } : undefined,
  })
}

export function initAnalytics() {
  if (started || isDisabled()) return
  started = true
  pageEnteredAt = Date.now()

  const onHide = () => {
    if (document.visibilityState === 'hidden') flushAnalytics()
  }
  document.addEventListener('visibilitychange', onHide)
  window.addEventListener('pagehide', flushAnalytics)

  // Глобальный перехват кликов по внешним ссылкам — без правок в компонентах
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target?.closest?.('a[href]')
      if (!link) return
      try {
        const target = new URL(link.href, window.location.href)
        if (target.hostname !== window.location.hostname) {
          trackEvent('link', 'outbound', target.hostname, { href: target.href })
        } else if (/\.(pdf|zip|docx?|png|jpe?g|svg)$/i.test(target.pathname)) {
          trackEvent('file', 'download', target.pathname)
        }
      } catch {
        /* ссылка вида mailto:/tel: — пропускаем */
      }
    },
    { capture: true }
  )
}
