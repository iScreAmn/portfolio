import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isConfigured = Boolean(url && anonKey)

if (!isConfigured) {
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY не заданы — аналитика и админка работать не будут.'
  )
}

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // портфолио на GitHub Pages — редиректы OAuth не используются
        detectSessionInUrl: false,
      },
    })
  : null

export const SUPABASE_URL = url
export const SUPABASE_ANON_KEY = anonKey
export const IS_SUPABASE_CONFIGURED = isConfigured
