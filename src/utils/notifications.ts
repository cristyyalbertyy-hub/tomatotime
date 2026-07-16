import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { SESSIONS_PER_CYCLE } from '../constants'
import type { PhaseTransition } from './timerStorage'
import type { PersistedTimerState } from './timerStorage'
import { getBreakDurationMin } from './settings'
import {
  allNotificationIds,
  notificationId,
  phaseDurationMs,
} from './timerStorage'

const CHANNEL_ID = 'pomodoro'

function isNative(): boolean {
  return Capacitor.isNativePlatform()
}

function phaseMessage(
  phase: 'work' | 'break',
  sessionIndex: number,
): { title: string; body: string } {
  if (phase === 'work') {
    const session = sessionIndex + 1
    const breakMin = getBreakDurationMin()
    return {
      title: 'Break time!',
      body: `Session ${session} done. Stretch, hydrate, and breathe for ${breakMin} minute${breakMin !== 1 ? 's' : ''}.`,
    }
  }

  if (sessionIndex >= SESSIONS_PER_CYCLE - 1) {
    return {
      title: 'Journey complete!',
      body: 'You finished your full Tomato Time journey cycle. Great work!',
    }
  }

  const next = sessionIndex + 2
  return {
    title: 'Back to work!',
    body: `Break over. Ready for session ${next} of ${SESSIONS_PER_CYCLE}?`,
  }
}

export async function initNotifications(): Promise<void> {
  if (!isNative()) return

  const perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') return

  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: 'Pomodoro',
    description: 'Work, break, and journey reminders',
    importance: 5,
    vibration: true,
    sound: 'default',
  })
}

export async function requestWebNotificationPermission(): Promise<boolean> {
  if (isNative() || typeof Notification === 'undefined') return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export async function notifyPhaseTransition(
  endedPhase: 'work' | 'break',
  sessionIndex: number,
  transition: PhaseTransition,
): Promise<void> {
  if (!transition) return

  const { title, body } = phaseMessage(endedPhase, sessionIndex)

  if (isNative()) return

  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return
  }

  try {
    const icon = `${import.meta.env.BASE_URL}icon-192.png`
    new Notification(title, {
      body,
      icon,
      tag: `tomato-phase-${Date.now()}`,
    })
  } catch {
    /* ignore — e.g. mobile Safari without permission */
  }
}

export async function cancelTimerNotifications(): Promise<void> {
  if (!isNative()) return
  await LocalNotifications.cancel({
    notifications: allNotificationIds().map((id) => ({ id })),
  })
}

export async function schedulePhaseEndNotification(
  state: PersistedTimerState,
): Promise<void> {
  if (!isNative()) return
  if (state.status !== 'running' || state.phase === 'idle' || state.phaseEndsAt === null) {
    return
  }

  await cancelTimerNotifications()

  const { title, body } = phaseMessage(state.phase, state.sessionIndex)
  const id = notificationId(state.sessionIndex, state.phase)

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title,
        body,
        schedule: { at: new Date(state.phaseEndsAt) },
        channelId: CHANNEL_ID,
        smallIcon: 'ic_stat_tomato',
        iconColor: '#f5a623',
        sound: 'default',
      },
    ],
  })
}

export async function scheduleCelebrateNotification(until: number): Promise<void> {
  if (!isNative()) return
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 3000,
        title: 'Tomato Time',
        body: 'Your journey celebration is ready. Open the app to see your harvest grow!',
        schedule: { at: new Date(until) },
        channelId: CHANNEL_ID,
        smallIcon: 'ic_stat_tomato',
        iconColor: '#f5a623',
        sound: 'default',
      },
    ],
  })
}

export function remainingMsFromState(state: PersistedTimerState): number {
  if (state.pausedRemainingMs !== null) return state.pausedRemainingMs
  if (state.phaseEndsAt !== null) return Math.max(0, state.phaseEndsAt - Date.now())
  return phaseDurationMs(state.phase)
}
