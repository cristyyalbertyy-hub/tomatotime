import {
  CELEBRATE_DURATION_MS,
  SESSIONS_PER_CYCLE,
} from '../constants'
import type { Phase } from '../constants'
import type { TimerStatus } from '../types'
import { getBreakDurationSec, getWorkDurationSec } from './settings'

export const TIMER_STORAGE_KEY = 'tomato-time-timer'

export interface PersistedTimerState {
  status: TimerStatus
  phase: Phase
  sessionIndex: number
  cycleSessionDone: number
  phaseEndsAt: number | null
  pausedRemainingMs: number | null
  celebratingUntil: number | null
}

export const IDLE_TIMER_STATE: PersistedTimerState = {
  status: 'idle',
  phase: 'idle',
  sessionIndex: 0,
  cycleSessionDone: 0,
  phaseEndsAt: null,
  pausedRemainingMs: null,
  celebratingUntil: null,
}

export function phaseDurationMs(phase: Phase): number {
  if (phase === 'work') return getWorkDurationSec() * 1000
  if (phase === 'break') return getBreakDurationSec() * 1000
  return 0
}

export function loadTimerState(): PersistedTimerState {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY)
    if (!raw) return { ...IDLE_TIMER_STATE }
    const parsed = JSON.parse(raw) as PersistedTimerState
    return { ...IDLE_TIMER_STATE, ...parsed }
  } catch {
    return { ...IDLE_TIMER_STATE }
  }
}

export function saveTimerState(state: PersistedTimerState): void {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state))
}

export function clearTimerState(): void {
  localStorage.removeItem(TIMER_STORAGE_KEY)
}

export function getRemainingMs(state: PersistedTimerState, now = Date.now()): number {
  if (state.celebratingUntil !== null) return 0
  if (state.status === 'paused' && state.pausedRemainingMs !== null) {
    return state.pausedRemainingMs
  }
  if (state.status === 'running' && state.phaseEndsAt !== null) {
    return Math.max(0, state.phaseEndsAt - now)
  }
  return 0
}

export function getElapsedSec(state: PersistedTimerState, now = Date.now()): number {
  if (state.phase === 'idle' || state.celebratingUntil !== null) return 0
  const limit =
    state.phase === 'work' ? getWorkDurationSec() : getBreakDurationSec()
  const remainingSec = getRemainingMs(state, now) / 1000
  return Math.min(limit, Math.max(0, limit - remainingSec))
}

export type PhaseTransition =
  | 'work-to-break'
  | 'break-to-work'
  | 'journey-complete'
  | null

export interface ReconcileResult {
  state: PersistedTimerState
  workCompleted: number
  journeyCompleted: boolean
  enteredCelebrate: boolean
  celebrateFinished: boolean
  phaseTransition: PhaseTransition
}

export function reconcileTimerState(
  input: PersistedTimerState,
  now = Date.now(),
): ReconcileResult {
  let state = { ...input }
  let workCompleted = 0
  let journeyCompleted = false
  let enteredCelebrate = false
  let celebrateFinished = false
  let phaseTransition: PhaseTransition = null

  if (state.celebratingUntil !== null) {
    if (now >= state.celebratingUntil) {
      celebrateFinished = true
      return {
        state: { ...IDLE_TIMER_STATE },
        workCompleted,
        journeyCompleted,
        enteredCelebrate,
        celebrateFinished,
        phaseTransition,
      }
    }
    return {
      state,
      workCompleted,
      journeyCompleted,
      enteredCelebrate,
      celebrateFinished,
      phaseTransition,
    }
  }

  if (state.status !== 'running' || state.phaseEndsAt === null) {
    return {
      state,
      workCompleted,
      journeyCompleted,
      enteredCelebrate,
      celebrateFinished,
      phaseTransition,
    }
  }

  while (state.status === 'running' && state.phaseEndsAt !== null && now >= state.phaseEndsAt) {
    if (state.phase === 'work') {
      workCompleted += 1
      phaseTransition = 'work-to-break'
      state = {
        ...state,
        cycleSessionDone: state.sessionIndex + 1,
        phase: 'break',
        phaseEndsAt: state.phaseEndsAt + getBreakDurationSec() * 1000,
      }
      continue
    }

    if (state.sessionIndex >= SESSIONS_PER_CYCLE - 1) {
      journeyCompleted = true
      enteredCelebrate = true
      phaseTransition = 'journey-complete'
      state = {
        ...IDLE_TIMER_STATE,
        celebratingUntil: now + CELEBRATE_DURATION_MS,
        cycleSessionDone: SESSIONS_PER_CYCLE,
      }
      break
    }

    phaseTransition = 'break-to-work'
    state = {
      ...state,
      sessionIndex: state.sessionIndex + 1,
      phase: 'work',
      phaseEndsAt: state.phaseEndsAt + getWorkDurationSec() * 1000,
    }
  }

  return {
    state,
    workCompleted,
    journeyCompleted,
    enteredCelebrate,
    celebrateFinished,
    phaseTransition,
  }
}

export function notificationId(sessionIndex: number, phase: 'work' | 'break'): number {
  return phase === 'work' ? 1000 + sessionIndex : 2000 + sessionIndex
}

export function allNotificationIds(): number[] {
  const ids: number[] = [3000]
  for (let i = 0; i < SESSIONS_PER_CYCLE; i++) {
    ids.push(notificationId(i, 'work'), notificationId(i, 'break'))
  }
  return ids
}
