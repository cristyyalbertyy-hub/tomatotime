export type ThemePreference = 'light' | 'dark' | 'system'

const THEME_KEY = 'tomato-time-theme'

export function getThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* ignore */
  }
  return 'system'
}

export function setThemePreference(theme: ThemePreference) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
  applyTheme(theme)
  window.dispatchEvent(new Event('tomato-theme-update'))
}

export function resolveTheme(preference = getThemePreference()): 'light' | 'dark' {
  if (preference === 'dark') return 'dark'
  if (preference === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(preference = getThemePreference()) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolveTheme(preference)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolveTheme(preference) === 'dark' ? '#141a1f' : '#3aadab')
  }
}

export function initTheme() {
  applyTheme()
  if (typeof window === 'undefined') return
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getThemePreference() === 'system') applyTheme('system')
    })
}
