export const DEFAULT_WORK_DURATION_MIN = 25
export const DEFAULT_BREAK_DURATION_MIN = 5
export const WORK_DURATION_SEC = DEFAULT_WORK_DURATION_MIN * 60
export const BREAK_DURATION_SEC = DEFAULT_BREAK_DURATION_MIN * 60
export const SESSIONS_PER_CYCLE = 4
export const CELEBRATE_DURATION_MS = 8000

export function defaultCycleDurationSec() {
  return SESSIONS_PER_CYCLE * (WORK_DURATION_SEC + BREAK_DURATION_SEC)
}

export const CYCLE_DURATION_SEC = defaultCycleDurationSec()

export type Phase = 'work' | 'break' | 'idle'

export const MEDICAL_SITE_URL = 'https://medical-science-lilac.vercel.app/conta/'

export const STUDY_TIPS = [
  'One journey = 4 focus sessions + short breaks — tune lengths in Settings.',
  'Put your phone face-down until the tomato reaches the end of the track.',
  'After each session, jot three bullet points while the memory is fresh.',
  'Use breaks to stand, stretch, and look away from the screen — not social media.',
  'Small daily journeys beat one long cramming block before the exam.',
  'Open your Studio9 packages from Medical Science when a session ends.',
] as const

export const COLORS = {
  bg: '#f9f8f6',
  teal: '#3aadab',
  dark: '#1f4e6b',
  orange: '#d97a3e',
  orangeDeep: '#b95f29',
} as const
