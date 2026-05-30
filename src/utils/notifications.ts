import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { SESSIONS_PER_CYCLE } from '../constants'
import type { PersistedTimerState } from './timerStorage'
import {
  allNotificationIds,
  notificationId,
  phaseDurationMs,
} from './timerStorage'

const CHANNEL_ID = 'pomodoro'

function isNative(): boolean {
  return Capacitor.isNativePlatform()
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
  })
}

export async function cancelTimerNotifications(): Promise<void> {
  if (!isNative()) return
  await LocalNotifications.cancel({
    notifications: allNotificationIds().map((id) => ({ id })),
  })
}

function phaseMessage(
  phase: 'work' | 'break',
  sessionIndex: number,
): { title: string; body: string } {
  if (phase === 'work') {
    const session = sessionIndex + 1
    return {
      title: 'Break time!',
      body: `Session ${session} done. Stretch, hydrate, and breathe for 5 minutes.`,
    }
  }

  if (sessionIndex >= SESSIONS_PER_CYCLE - 1) {
    return {
      title: 'Journey complete!',
      body: 'You finished your full 2-hour Tomato Time cycle. Great work!',
    }
  }

  const next = sessionIndex + 2
  return {
    title: 'Back to work!',
    body: `Break over. Ready for session ${next} of ${SESSIONS_PER_CYCLE}?`,
  }
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
      },
    ],
  })
}

export function remainingMsFromState(state: PersistedTimerState): number {
  if (state.pausedRemainingMs !== null) return state.pausedRemainingMs
  if (state.phaseEndsAt !== null) return Math.max(0, state.phaseEndsAt - Date.now())
  return phaseDurationMs(state.phase)
}
