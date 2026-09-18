"use client";

import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  initAnalytics,
  trackEvent,
  trackPageview,
  flushAnalytics,
  setAnalyticsEnabled,
} from '../lib/analytics'

const AnalyticsContext = createContext({
  track: trackEvent,
  flush: flushAnalytics,
  setEnabled: setAnalyticsEnabled,
})

export function AnalyticsProvider({ children }) {
  const pathname = usePathname()
  const lastPath = useRef(null)

  useEffect(() => {
    initAnalytics()
  }, [])

  // search читаем из window, а не через useSearchParams: тот заставил бы
  // оборачивать провайдер в Suspense и выключил бы статику на всех страницах.
  useEffect(() => {
    const path = pathname + window.location.search
    if (lastPath.current === path) return
    lastPath.current = path
    trackPageview(path)
  }, [pathname])

  return (
    <AnalyticsContext.Provider
      value={{ track: trackEvent, flush: flushAnalytics, setEnabled: setAnalyticsEnabled }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}
export function useAnalytics() {
  return useContext(AnalyticsContext)
}
export function useTrackVisible(sectionName, threshold = 0.4) {
  const ref = useRef(null)
  const fired = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || fired.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          trackEvent('section', 'view', sectionName)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [sectionName, threshold])

  return ref
}
