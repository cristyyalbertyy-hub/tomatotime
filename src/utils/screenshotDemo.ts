export type ScreenshotScene = 'idle' | 'work' | 'break' | 'celebrate' | 'harvest'

const SCENES: ScreenshotScene[] = ['idle', 'work', 'break', 'celebrate', 'harvest']

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
        tomatoPos: { x: 100 },
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
  return {
    todayTomatoes: 8,
    todayJourneys: 1,
    weekTomatoes: 24,
    weekJourneys: 3,
    totalTomatoes: 156,
    totalJourneys: 12,
    streak: 5,
    last7Days: labels.map((label, i) => ({
      date: `2026-05-${23 + i}`,
      label,
      tomatoes: [4, 6, 3, 5, 0, 2, 8][i],
    })),
  }
}
