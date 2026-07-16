import { useCallback, useEffect, useRef, useState } from 'react'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import {
  BREAK_DURATION_SEC,
  SESSIONS_PER_CYCLE,
  WORK_DURATION_SEC,
  type Phase,
} from '../constants'
import type { TimerStatus, TomatoPosition } from '../types'
import {
  playPhaseTransition,
  unlockAudio,
} from '../utils/sound'
import type { PhaseTransition } from '../utils/timerStorage'
import {
  loadJourneysFromHarvest,
  recordJourneyHarvest,
  recordTomatoHarvest,
} from '../utils/harvest'
import {
  clearPhaseEndAlarm,
  schedulePhaseEndAlarm,
} from '../utils/phaseAlarms'
import {
  cancelTimerNotifications,
  notifyPhaseTransition,
  scheduleCelebrateNotification,
  schedulePhaseEndNotification,
} from '../utils/notifications'
import {
  clearTimerState,
  getElapsedSec,
  getRemainingMs,
  IDLE_TIMER_STATE,
  loadTimerState,
  reconcileTimerState,
  saveTimerState,
  type PersistedTimerState,
} from '../utils/timerStorage'
import { getScreenshotScene } from '../utils/screenshotDemo'

interface UsePomodoroTimerReturn {
  status: TimerStatus
  phase: Phase
  sessionIndex: number
  minute: number
  second: number
  elapsedSec: number
  phaseProgress: number
  tomatoPos: TomatoPosition
  tomatoVisible: boolean
  celebrating: boolean
  journeys: number
  cycleSessionDone: number
  inCycle: boolean
  go: () => void
  pause: () => void
  reset: () => void
}

function computeWorkDisplay(elapsed: number) {
  return {
    minute: Math.min(25, Math.floor(elapsed / 60) + 1),
    second: Math.floor(elapsed % 60) + 1,
  }
}

function computeBreakDisplay(elapsed: number) {
  return {
    minute: Math.min(5, Math.floor(elapsed / 60) + 1),
    second: Math.floor(elapsed % 60) + 1,
  }
}

function computeTomatoPos(elapsed: number, phase: Phase): TomatoPosition {
  if (phase === 'idle') return { x: 0 }
  if (phase === 'break') {
    const progress = Math.min(elapsed / BREAK_DURATION_SEC, 1)
    return { x: progress * 100 }
  }
  const progress = Math.min(elapsed / WORK_DURATION_SEC, 1)
  return { x: progress * 100 }
}

function playPhaseTransitionSound(transition: PhaseTransition) {
  if (!transition) return
  void playPhaseTransition(transition)
}

function applyReconcileSideEffects(result: ReturnType<typeof reconcileTimerState>) {
  for (let i = 0; i < result.workCompleted; i++) {
    recordTomatoHarvest()
  }
  if (result.journeyCompleted) recordJourneyHarvest()
  playPhaseTransitionSound(result.phaseTransition)
}

export function usePomodoroTimer(): UsePomodoroTimerReturn {
  const isScreenshot = getScreenshotScene() !== null
  const [timerState, setTimerState] = useState<PersistedTimerState>(() =>
    isScreenshot ? { ...IDLE_TIMER_STATE } : loadTimerState(),
  )
  const [tick, setTick] = useState(0)
  const [journeys, setJourneys] = useState(loadJourneysFromHarvest)
  const timerStateRef = useRef(timerState)
  timerStateRef.current = timerState

  const celebrating = timerState.celebratingUntil !== null
  const status: TimerStatus = celebrating ? 'idle' : timerState.status
  const phase: Phase = celebrating ? 'idle' : timerState.phase
  const sessionIndex = timerState.sessionIndex
  const cycleSessionDone = celebrating
    ? SESSIONS_PER_CYCLE
    : timerState.cycleSessionDone

  const commitState = useCallback((next: PersistedTimerState) => {
    saveTimerState(next)
    timerStateRef.current = next
    setTimerState(next)
  }, [])

  const processPhaseEnd = useCallback(() => {
    const current = timerStateRef.current
    if (current.status !== 'running' || current.phaseEndsAt === null) return
    if (Date.now() < current.phaseEndsAt) return

    const endedPhase = current.phase
    if (endedPhase !== 'work' && endedPhase !== 'break') return

    const result = reconcileTimerState(current)
    applyReconcileSideEffects(result)
    if (result.journeyCompleted) setJourneys(loadJourneysFromHarvest())

    void notifyPhaseTransition(
      endedPhase,
      current.sessionIndex,
      result.phaseTransition,
    )

    commitState(result.state)
    if (result.state.status === 'running') {
      void schedulePhaseEndNotification(result.state)
    } else if (result.state.celebratingUntil) {
      void scheduleCelebrateNotification(result.state.celebratingUntil)
    } else {
      void cancelTimerNotifications()
    }
  }, [commitState])

  const armPhaseEndAlarm = useCallback(
    (state: PersistedTimerState) => {
      schedulePhaseEndAlarm(state, processPhaseEnd)
    },
    [processPhaseEnd],
  )

  const syncFromStorage = useCallback(() => {
    const loaded = loadTimerState()
    const result = reconcileTimerState(loaded)
    applyReconcileSideEffects(result)
    if (result.journeyCompleted) setJourneys(loadJourneysFromHarvest())
    saveTimerState(result.state)
    timerStateRef.current = result.state
    setTimerState(result.state)

    if (result.state.status === 'running') {
      void schedulePhaseEndNotification(result.state)
      armPhaseEndAlarm(result.state)
    } else if (result.state.celebratingUntil) {
      void scheduleCelebrateNotification(result.state.celebratingUntil)
      clearPhaseEndAlarm()
    } else {
      void cancelTimerNotifications()
      clearPhaseEndAlarm()
    }
  }, [armPhaseEndAlarm])

  useEffect(() => {
    if (isScreenshot) return
    syncFromStorage()
  }, [syncFromStorage, isScreenshot])

  useEffect(() => {
    if (isScreenshot || timerState.status !== 'running') return
    void unlockAudio()
    const id = window.setInterval(() => {
      void unlockAudio()
    }, 15000)
    return () => clearInterval(id)
  }, [timerState.status, isScreenshot])

  useEffect(() => {
    if (isScreenshot) return
    if (timerState.status !== 'running' || timerState.phaseEndsAt === null) {
      clearPhaseEndAlarm()
      return
    }

    armPhaseEndAlarm(timerState)
    return () => clearPhaseEndAlarm()
  }, [
    timerState.status,
    timerState.phaseEndsAt,
    timerState.phase,
    timerState.sessionIndex,
    armPhaseEndAlarm,
    isScreenshot,
  ])

  useEffect(() => {
    if (isScreenshot) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncFromStorage()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [syncFromStorage, isScreenshot])

  useEffect(() => {
    if (isScreenshot || !Capacitor.isNativePlatform()) return
    const sub = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) syncFromStorage()
    })
    return () => {
      void sub.then((h) => h.remove())
    }
  }, [syncFromStorage, isScreenshot])

  useEffect(() => {
    if (isScreenshot) return
    const needsTick =
      timerState.status === 'running' || timerState.celebratingUntil !== null
    if (!needsTick) return
    const id = window.setInterval(() => {
      const current = timerStateRef.current
      if (current.celebratingUntil !== null) {
        if (Date.now() >= current.celebratingUntil) {
          commitState({ ...IDLE_TIMER_STATE })
          void cancelTimerNotifications()
        }
        setTick((t) => t + 1)
        return
      }

      if (current.status === 'running' && current.phaseEndsAt !== null) {
        if (Date.now() >= current.phaseEndsAt) {
          processPhaseEnd()
        }
      }
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [
    timerState.status,
    timerState.celebratingUntil,
    timerState.phaseEndsAt,
    commitState,
    processPhaseEnd,
    isScreenshot,
  ])

  const elapsed = getElapsedSec(timerState)
  void tick

  const display =
    celebrating || (phase === 'idle' && status === 'idle')
      ? { minute: 1, second: 1 }
      : phase === 'break'
        ? computeBreakDisplay(elapsed)
        : computeWorkDisplay(elapsed)

  const go = useCallback(() => {
    if (celebrating) return

    const now = Date.now()
    let next = { ...timerStateRef.current }

    if (next.status === 'paused' && next.pausedRemainingMs !== null) {
      next = {
        ...next,
        status: 'running',
        phaseEndsAt: now + next.pausedRemainingMs,
        pausedRemainingMs: null,
      }
    } else if (next.phase === 'idle') {
      next = {
        status: 'running',
        phase: 'work',
        sessionIndex: 0,
        cycleSessionDone: 0,
        phaseEndsAt: now + WORK_DURATION_SEC * 1000,
        pausedRemainingMs: null,
        celebratingUntil: null,
      }
    } else {
      next = { ...next, status: 'running' }
    }

    commitState(next)
    void schedulePhaseEndNotification(next)
    armPhaseEndAlarm(next)
  }, [celebrating, commitState, armPhaseEndAlarm])

  const pause = useCallback(() => {
    if (timerStateRef.current.status !== 'running') return
    const remaining = getRemainingMs(timerStateRef.current)
    const next: PersistedTimerState = {
      ...timerStateRef.current,
      status: 'paused',
      phaseEndsAt: null,
      pausedRemainingMs: remaining,
    }
    commitState(next)
    void cancelTimerNotifications()
    clearPhaseEndAlarm()
  }, [commitState])

  const reset = useCallback(() => {
    clearTimerState()
    commitState({ ...IDLE_TIMER_STATE })
    void cancelTimerNotifications()
    clearPhaseEndAlarm()
  }, [commitState])

  const inCycle =
    !celebrating &&
    (phase !== 'idle' || status === 'running' || status === 'paused')

  const tomatoPos = celebrating
    ? { x: 100 }
    : computeTomatoPos(elapsed, phase)

  const tomatoVisible =
    celebrating || status === 'running' || status === 'paused'

  const phaseDurationSec =
    phase === 'break' ? BREAK_DURATION_SEC : WORK_DURATION_SEC
  const elapsedSec =
    phase === 'idle' && !inCycle ? 0 : Math.floor(elapsed)
  const phaseProgress =
    phase === 'idle' && !inCycle
      ? 0
      : Math.min(1, Math.max(0, elapsed / phaseDurationSec))

  return {
    status,
    phase,
    sessionIndex,
    minute: display.minute,
    second: display.second,
    elapsedSec,
    phaseProgress,
    tomatoPos,
    tomatoVisible,
    celebrating,
    journeys,
    cycleSessionDone,
    inCycle,
    go,
    pause,
    reset,
  }
}
