import { useState, useEffect } from 'react'

const STORAGE_KEY = 'offerEdge-theme'

function getSystemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'dark'
  }
}

/**
 * Theme hook for the proposal page.
 *
 * @param {string} defaultTheme - Admin-set default: 'dark' | 'light' | 'auto'
 * @returns {{ resolved: string, preference: string, cycleTheme: function }}
 *   resolved   — actual applied theme: 'dark' | 'light'
 *   preference — current effective preference: 'dark' | 'light' | 'auto'
 *   cycleTheme — cycles dark → light → auto → dark
 */
export function useTheme(defaultTheme = 'dark') {
  // User local override (null = defer to admin default)
  const [localOverride, setLocalOverride] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || null } catch { return null }
  })

  // Effective preference: user override takes priority over admin default
  const effective = localOverride ?? defaultTheme

  // Resolved to an actual 'dark' | 'light' value
  const [resolved, setResolved] = useState(() =>
    effective === 'auto' ? getSystemTheme() : effective
  )

  useEffect(() => {
    if (effective === 'auto') {
      try {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        setResolved(mq.matches ? 'dark' : 'light')
        const handler = (e) => setResolved(e.matches ? 'dark' : 'light')
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
      } catch {
        setResolved('dark')
      }
    } else {
      setResolved(effective)
    }
  }, [effective])

  const cycleTheme = () => {
    const next = { dark: 'light', light: 'auto', auto: 'dark' }
    const nextVal = next[effective] ?? 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, nextVal)
    } catch {}
    setLocalOverride(nextVal)
  }

  return { resolved, preference: effective, cycleTheme }
}
