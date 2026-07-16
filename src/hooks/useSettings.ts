import { useCallback, useEffect, useState } from 'react'
import {
  getBreakDurationMin,
  getWorkDurationMin,
  setBreakDurationMin,
  setWorkDurationMin,
  SETTINGS_EVENT,
} from '../utils/settings'
import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from '../utils/theme'

export function useSettings() {
  const [workMin, setWorkMin] = useState(getWorkDurationMin)
  const [breakMin, setBreakMin] = useState(getBreakDurationMin)
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)

  useEffect(() => {
    const refresh = () => {
      setWorkMin(getWorkDurationMin())
      setBreakMin(getBreakDurationMin())
    }
    window.addEventListener(SETTINGS_EVENT, refresh)
    return () => window.removeEventListener(SETTINGS_EVENT, refresh)
  }, [])

  useEffect(() => {
    const refreshTheme = () => setTheme(getThemePreference())
    window.addEventListener('tomato-theme-update', refreshTheme)
    return () => window.removeEventListener('tomato-theme-update', refreshTheme)
  }, [])

  const updateWorkMin = useCallback((minutes: number) => {
    setWorkDurationMin(minutes)
    setWorkMin(getWorkDurationMin())
  }, [])

  const updateBreakMin = useCallback((minutes: number) => {
    setBreakDurationMin(minutes)
    setBreakMin(getBreakDurationMin())
  }, [])

  const updateTheme = useCallback((next: ThemePreference) => {
    setThemePreference(next)
    setTheme(next)
  }, [])

  return { workMin, breakMin, theme, updateWorkMin, updateBreakMin, updateTheme }
}
