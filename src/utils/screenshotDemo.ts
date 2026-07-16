import {
  BREAK_DURATION_SEC,
  WORK_DURATION_SEC,
} from '../constants'

export type ScreenshotScene = 'idle' | 'work' | 'break' | 'celebrate' | 'harvest'

const SCENES: ScreenshotScene[] = ['idle', 'work', 'break', 'celebrate', 'harvest']

function elapsedFromDisplay(minute: number, second: number) {
  return (minute - 1) * 60 + (second - 1)
}

function demoTiming(
  phase: 'work' | 'break' | 'idle',
  minute: number,
  second: number,
) {
  if (phase === 'idle') {
    return { elapsedSec: 0, phaseProgress: 0 }
  }
  const limit = phase === 'work' ? WORK_DURATION_SEC : BREAK_DURATION_SEC
  const elapsed = elapsedFromDisplay(minute, second)
  return {
    elapsedSec: elapsed,
    phaseProgress: Math.min(1, elapsed / limit),
  }
}

export function getScreenshotScene(): ScreenshotScene | null {
  const param = new URLSearchParams(window.location.search).get('screenshot')
  if (!param || !SCENES.includes(param as ScreenshotScene)) return null
  return param as ScreenshotScene
}

export interface DemoTimerProps {
  status: 'idle' | 'running' | 'paused'
  phase: 'work' | 'break' | 'idle'
  sessionIndex: number
  minute: number
  second: number
  elapsedSec: number
  phaseProgress: number
  tomatoPos: { x: number }
  tomatoVisible: boolean
  celebrating: boolean
  journeys: number
  cycleSessionDone: number
  inCycle: boolean
}

export function getDemoTimerProps(scene: ScreenshotScene): DemoTimerProps {
  switch (scene) {
    case 'work':
      return {
        status: 'running',
        phase: 'work',
        sessionIndex: 0,
        minute: 12,
        second: 34,
        ...demoTiming('work', 12, 34),
        tomatoPos: { x: 48 },
        tomatoVisible: true,
        celebrating: false,
        journeys: 3,
        cycleSessionDone: 0,
        inCycle: true,
      }
    case 'break':
      return {
        status: 'running',
        phase: 'break',
        sessionIndex: 1,
        minute: 3,
        second: 15,
        ...demoTiming('break', 3, 15),
        tomatoPos: { x: 55 },
        tomatoVisible: true,
        celebrating: false,
        journeys: 3,
        cycleSessionDone: 1,
        inCycle: true,
      }
    case 'celebrate':
      return {
        status: 'idle',
        phase: 'idle',
        sessionIndex: 0,
        minute: 1,
        second: 1,
        elapsedSec: 0,
        phaseProgress: 1,
        tomatoPos: { x: 100 },
        tomatoVisible: true,
        celebrating: true,
        journeys: 4,
        cycleSessionDone: 4,
        inCycle: false,
      }
    case 'harvest':
      return {
        status: 'idle',
        phase: 'idle',
        sessionIndex: 0,
        minute: 1,
        second: 1,
        ...demoTiming('idle', 1, 1),
        tomatoPos: { x: 0 },
        tomatoVisible: false,
        celebrating: false,
        journeys: 12,
        cycleSessionDone: 0,
        inCycle: false,
      }
    case 'idle':
    default:
      return {
        status: 'idle',
        phase: 'idle',
        sessionIndex: 0,
        minute: 1,
        second: 1,
        ...demoTiming('idle', 1, 1),
        tomatoPos: { x: 0 },
        tomatoVisible: false,
        celebrating: false,
        journeys: 3,
        cycleSessionDone: 0,
        inCycle: false,
      }
  }
}

export function getDemoHarvestStats() {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']
  const monthDays = Array.from({ length: 16 }, (_, i) => ({
    date: `2026-07-${String(i + 1).padStart(2, '0')}`,
    label: String(i + 1),
    tomatoes: [0, 2, 4, 0, 6, 4, 8, 0, 3, 5, 0, 4, 6, 0, 2, 8][i] ?? 0,
  }))
  return {
    todayTomatoes: 8,
    todayJourneys: 1,
    weekTomatoes: 24,
    weekJourneys: 3,
    monthTomatoes: 52,
    monthJourneys: 4,
    totalTomatoes: 156,
    totalJourneys: 12,
    streak: 5,
    last7Days: labels.map((label, i) => ({
      date: `2026-05-${23 + i}`,
      label,
      tomatoes: [4, 6, 3, 5, 0, 2, 8][i],
    })),
    monthDays,
  }
}
