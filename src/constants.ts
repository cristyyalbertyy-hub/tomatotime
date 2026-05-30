export const WORK_DURATION_SEC = 25 * 60
export const BREAK_DURATION_SEC = 5 * 60
export const SESSIONS_PER_CYCLE = 4
export const CELEBRATE_DURATION_MS = 8000
export const CYCLE_DURATION_SEC =
  SESSIONS_PER_CYCLE * (WORK_DURATION_SEC + BREAK_DURATION_SEC)

export type Phase = 'work' | 'break' | 'idle'

export const COLORS = {
  bg: '#d8f0f5',
  teal: '#3aadab',
  dark: '#3d4f5f',
  orange: '#f5a623',
  orangeDeep: '#e8890c',
} as const
