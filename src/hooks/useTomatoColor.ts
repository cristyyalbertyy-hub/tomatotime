import { useCallback, useEffect, useState } from 'react'
import {
  getTomatoColorPreset,
  setTomatoColorPreset,
  TOMATO_COLOR_EVENT,
  type TomatoColorPreset,
} from '../utils/tomatoColor'

export function useTomatoColor() {
  const [preset, setPresetState] = useState<TomatoColorPreset>(getTomatoColorPreset)

  useEffect(() => {
    const sync = () => setPresetState(getTomatoColorPreset())
    window.addEventListener(TOMATO_COLOR_EVENT, sync)
    return () => window.removeEventListener(TOMATO_COLOR_EVENT, sync)
  }, [])

  const setPreset = useCallback((next: TomatoColorPreset) => {
    setPresetState(next)
    setTomatoColorPreset(next)
  }, [])

  return { tomatoColor: preset, setTomatoColor: setPreset }
}
