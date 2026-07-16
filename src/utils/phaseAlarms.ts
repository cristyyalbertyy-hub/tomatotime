import type { PersistedTimerState } from './timerStorage'

let phaseEndTimeoutId: number | null = null

export function clearPhaseEndAlarm(): void {
  if (phaseEndTimeoutId !== null) {
    clearTimeout(phaseEndTimeoutId)
    phaseEndTimeoutId = null
  }
}

/** Fire at the exact phase end time — works better than 1s polling when tab is hidden. */
export function schedulePhaseEndAlarm(
  state: PersistedTimerState,
  onPhaseEnd: () => void,
): void {
  clearPhaseEndAlarm()
  if (
    state.status !== 'running' ||
    state.phase === 'idle' ||
    state.phaseEndsAt === null
  ) {
    return
  }

  const delay = Math.max(0, state.phaseEndsAt - Date.now())
  if (delay === 0) {
    onPhaseEnd()
    return
  }

  phaseEndTimeoutId = window.setTimeout(() => {
    phaseEndTimeoutId = null
    onPhaseEnd()
  }, delay)
}
