import { useCallback, useEffect, useState } from 'react'
import {
  getBreakDurationMin,
  getWorkDurationMin,
  getTimerDisplayMode,
  setBreakDurationMin,
  setWorkDurationMin,
  setTimerDisplayMode,
  SETTINGS_EVENT,
  type TimerDisplayMode,
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
  const [timerDisplay, setTimerDisplay] = useState<TimerDisplayMode>(getTimerDisplayMode)

  useEffect(() => {
    const refresh = () => {
      setWorkMin(getWorkDurationMin())
      setBreakMin(getBreakDurationMin())
      setTimerDisplay(getTimerDisplayMode())
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

  const updateTimerDisplay = useCallback((next: TimerDisplayMode) => {
    setTimerDisplayMode(next)
    setTimerDisplay(next)
  }, [])

  return {
    workMin,
    breakMin,
    theme,
    timerDisplay,
    updateWorkMin,
    updateBreakMin,
    updateTheme,
    updateTimerDisplay,
  }
}
