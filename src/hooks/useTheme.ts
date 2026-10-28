'use client'

import { useCallback, useEffect, useState } from 'react'
import { applyTheme, THEME_STORAGE_KEY, type ThemePreference } from '@/lib/theme'

interface UseThemeReturn {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

function readStored(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

// The viewer's light, dark or system choice, saved in this browser
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemePreference>('system')

  useEffect(() => {
    setThemeState(readStored())
  }, [])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    applyTheme(next)
    try {
      if (next === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
      else window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage can be blocked; the theme then lasts for this page only
    }
  }, [])

  return { theme, setTheme }
}
