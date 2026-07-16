import { useCallback, useEffect, useState } from 'react'
import {
  getBreakDurationMin,
  getWorkDurationMin,
  setBreakDurationMin,
  setWorkDurationMin,
  SETTINGS_EVENT,
} from '../utils/settings'

export function useSettings() {
  const [workMin, setWorkMin] = useState(getWorkDurationMin)
  const [breakMin, setBreakMin] = useState(getBreakDurationMin)

  useEffect(() => {
    const refresh = () => {
      setWorkMin(getWorkDurationMin())
      setBreakMin(getBreakDurationMin())
    }
    window.addEventListener(SETTINGS_EVENT, refresh)
    return () => window.removeEventListener(SETTINGS_EVENT, refresh)
  }, [])

  const updateWorkMin = useCallback((minutes: number) => {
    setWorkDurationMin(minutes)
    setWorkMin(getWorkDurationMin())
  }, [])

  const updateBreakMin = useCallback((minutes: number) => {
    setBreakDurationMin(minutes)
    setBreakMin(getBreakDurationMin())
  }, [])

  return { workMin, breakMin, updateWorkMin, updateBreakMin }
}
