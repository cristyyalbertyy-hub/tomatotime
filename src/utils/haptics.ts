import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const HAPTICS_KEY = 'tomato-time-haptics'

export function isHapticsEnabled(): boolean {
  try {
    return localStorage.getItem(HAPTICS_KEY) !== 'false'
  } catch {
    return true
  }
}

export function setHapticsEnabled(on: boolean) {
  try {
    localStorage.setItem(HAPTICS_KEY, String(on))
  } catch {
    /* ignore */
  }
}

/** Light tap when a work/break phase ends or a journey completes. */
export async function hapticSessionEnd() {
  if (!isHapticsEnabled()) return

  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light })
      return
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(35)
    }
  } catch {
    /* ignore — haptics are optional */
  }
}
