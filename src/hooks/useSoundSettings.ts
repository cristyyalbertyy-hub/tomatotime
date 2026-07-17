import { useCallback, useEffect, useState } from 'react'
import {
  getSoundPreset,
  isSoundEnabled,
  playSoundPresetPreview,
  setSoundEnabled,
  setSoundPreset,
  SOUND_PRESET_EVENT,
  unlockAudio,
  type SoundPreset,
} from '../utils/sound'

export function useSoundSettings() {
  const [soundOn, setSoundOn] = useState(isSoundEnabled)
  const [soundPreset, setSoundPresetState] = useState<SoundPreset>(getSoundPreset)

  useEffect(() => {
    const sync = () => setSoundPresetState(getSoundPreset())
    window.addEventListener(SOUND_PRESET_EVENT, sync)
    return () => window.removeEventListener(SOUND_PRESET_EVENT, sync)
  }, [])

  const toggleSound = useCallback(async () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) await unlockAudio()
  }, [soundOn])

  const updateSoundPreset = useCallback(
    async (preset: SoundPreset) => {
      setSoundPresetState(preset)
      setSoundPreset(preset)
      if (soundOn) await playSoundPresetPreview(preset)
    },
    [soundOn],
  )

  return { soundOn, toggleSound, soundPreset, setSoundPreset: updateSoundPreset }
}
