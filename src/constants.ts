export const WORK_DURATION_SEC = 25 * 60
export const BREAK_DURATION_SEC = 5 * 60
export const SESSIONS_PER_CYCLE = 4
export const CELEBRATE_DURATION_MS = 8000
export const CYCLE_DURATION_SEC =
  SESSIONS_PER_CYCLE * (WORK_DURATION_SEC + BREAK_DURATION_SEC)

export type Phase = 'work' | 'break' | 'idle'

export const MEDICAL_SITE_URL = 'https://medical-science-lilac.vercel.app/conta/'

export const STUDY_TIPS = [
  'One journey = 4 × 25 min focus + short breaks — about 2 hours of deep study.',
  'Put your phone face-down until the tomato reaches the end of the track.',
  'After each session, jot three bullet points while the memory is fresh.',
  'Use breaks to stand, stretch, and look away from the screen — not social media.',
  'Small daily journeys beat one long cramming block before the exam.',
  'Open your Studio9 packages from Medical Science when a session ends.',
] as const

export const COLORS = {
  bg: '#d8f0f5',
  teal: '#3aadab',
  dark: '#3d4f5f',
  orange: '#f5a623',
  orangeDeep: '#e8890c',
} as const
