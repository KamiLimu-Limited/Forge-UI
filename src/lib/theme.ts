// =============================================================================
// Theme preference. "system" follows the device; "light" and "dark" are set
// as data-theme on <html>, which global.css and the Tailwind dark: variant read.
// =============================================================================

export type ThemePreference = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'kamilimu_theme'

export function applyTheme(preference: ThemePreference): void {
  const root = document.documentElement
  if (preference === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', preference)
}

// Runs in <head> before the first paint so a saved theme never flashes
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`
