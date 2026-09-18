/**
 * Запросы для админки. Работают только у вошедшего пользователя,
 * у которого есть строка в public.profiles — иначе RLS вернёт пустоту.
 */
import { supabase } from './supabase'

function getSupabaseOrThrow() {
  if (!supabase) {
    throw new Error(
      'Supabase не настроен. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.'
    )
  }
  return supabase
}

export async function signIn(email, password) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = () => getSupabaseOrThrow().auth.signOut()

/** Сводка за период: тоталы, график по дням, топ страниц, источники, гео. */
export async function getSummary(from, to = new Date()) {
  const client = getSupabaseOrThrow()
  const fromTs = from ?? new Date(Date.now() - 30 * 24 * 3600 * 1000)
  const { data, error } = await client.rpc('analytics_summary', {
    from_ts: new Date(fromTs).toISOString(),
    to_ts: new Date(to).toISOString(),
  })
  if (error) throw error
  return data
}

export async function getDaily(limit = 60) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_daily')
    .select('*')
    .order('day', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

// Витрины отдают строки без гарантии порядка (внутренний order by в view
// PostgREST не сохраняет), поэтому сортировку задаём явно в каждом запросе.

export async function getTopPages(limit = 20) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_pages')
    .select('*')
    .order('pageviews', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getSources(limit = 20) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_sources')
    .select('*')
    .order('sessions', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getDevices(limit = 20) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_devices')
    .select('*')
    .order('sessions', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getGeo(limit = 50) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_geo')
    .select('*')
    .order('sessions', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

/** Список визитов за период. Одна строка = одна сессия. */
export async function getSessionsList(from, to = new Date(), limit = 100) {
  const client = getSupabaseOrThrow()
  const fromTs = from ?? new Date(Date.now() - 7 * 24 * 3600 * 1000)
  const { data, error } = await client
    .from('analytics_sessions')
    .select('*')
    .gte('started_at', new Date(fromTs).toISOString())
    .lte('started_at', new Date(to).toISOString())
    .order('started_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

/** Лента событий одной сессии — для раскрытия карточки визита. */
export async function getSessionEvents(sessionId, limit = 500) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_events')
    .select('occurred_at, category, action, label, path, params')
    .eq('session_id', sessionId)
    .order('occurred_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data
}

/** Профиль вошедшего админа. Пустой ответ = строки в profiles нет. */
export async function getMyProfile() {
  const client = getSupabaseOrThrow()
  const { data: auth } = await client.auth.getUser()
  const userId = auth?.user?.id
  if (!userId) return null

  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data
}

/** Смена собственного пароля — работает через Supabase Auth, без обращения к profiles. */
export async function changePassword(newPassword) {
  const client = getSupabaseOrThrow()
  const { error } = await client.auth.updateUser({ password: newPassword })
  if (error) throw error
}

/** Последние сырые события — для отладки трекера. */
export async function getRecentEvents(limit = 100) {
  const client = getSupabaseOrThrow()
  const { data, error } = await client
    .from('analytics_events')
    .select('occurred_at, session_id, category, action, label, path, country, device_type, browser')
    .order('occurred_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

/** Живая лента событий через Realtime (включи репликацию таблицы в дашборде). */
export function subscribeToEvents(onEvent) {
  if (!supabase) return () => {}

  const channel = supabase
    .channel('analytics-live')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'analytics_events' },
      (payload) => onEvent(payload.new)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
