/**
 * Company (vendor) logo for hero — per-theme URLs or a single shared URL.
 * Legacy: `company.logo` was a string; still supported.
 *
 * @param {string | { light?: string | null, dark?: string | null } | null} logo
 * @param {'light' | 'dark'} theme
 * @returns {string | null}
 */
export function resolveCompanyLogoUrl(logo, theme) {
  if (logo == null || logo === '') return null
  if (typeof logo === 'string') {
    const s = logo.trim()
    return s || null
  }
  const light = toStr(logo.light)
  const dark = toStr(logo.dark)
  if (theme === 'dark') return dark || light
  return light || dark
}

function toStr(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s || null
}

/**
 * @returns {{ light: string | null, dark: string | null }}
 */
export function normalizeCompanyLogoObject(logo) {
  if (logo == null) return { light: null, dark: null }
  if (typeof logo === 'string') {
    const s = toStr(logo)
    if (!s) return { light: null, dark: null }
    return { light: s, dark: s }
  }
  return {
    light: toStr(logo.light),
    dark: toStr(logo.dark),
  }
}
