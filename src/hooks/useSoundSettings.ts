import { useCallback, useState } from 'react'
import { isSoundEnabled, setSoundEnabled, unlockAudio } from '../utils/sound'

export function useSoundSettings() {
  const [soundOn, setSoundOn] = useState(isSoundEnabled)

  const toggleSound = useCallback(async () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) await unlockAudio()
  }, [soundOn])

  return { soundOn, toggleSound }
}
