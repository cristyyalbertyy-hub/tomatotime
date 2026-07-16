import {
  DEFAULT_BREAK_DURATION_MIN,
  DEFAULT_WORK_DURATION_MIN,
  SESSIONS_PER_CYCLE,
} from '../constants'

export const SETTINGS_EVENT = 'tomato-settings-update'

const WORK_KEY = 'tomato-time-work-min'
const BREAK_KEY = 'tomato-time-break-min'
const ONBOARDED_KEY = 'tomato-time-onboarded'

const MIN_WORK_MIN = 5
const MAX_WORK_MIN = 60
const MIN_BREAK_MIN = 1
const MAX_BREAK_MIN = 15

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(n)))
}

function readInt(key: string, fallback: number, min: number, max: number) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const n = parseInt(raw, 10)
    if (!Number.isFinite(n)) return fallback
    return clamp(n, min, max)
  } catch {
    return fallback
  }
}

function writeInt(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SETTINGS_EVENT))
}

export function getWorkDurationMin() {
  return readInt(WORK_KEY, DEFAULT_WORK_DURATION_MIN, MIN_WORK_MIN, MAX_WORK_MIN)
}

export function getBreakDurationMin() {
  return readInt(BREAK_KEY, DEFAULT_BREAK_DURATION_MIN, MIN_BREAK_MIN, MAX_BREAK_MIN)
}

export function getWorkDurationSec() {
  return getWorkDurationMin() * 60
}

export function getBreakDurationSec() {
  return getBreakDurationMin() * 60
}

export function setWorkDurationMin(minutes: number) {
  writeInt(WORK_KEY, clamp(minutes, MIN_WORK_MIN, MAX_WORK_MIN))
}

export function setBreakDurationMin(minutes: number) {
  writeInt(BREAK_KEY, clamp(minutes, MIN_BREAK_MIN, MAX_BREAK_MIN))
}

export function getWorkDurationBounds() {
  return { min: MIN_WORK_MIN, max: MAX_WORK_MIN }
}

export function getBreakDurationBounds() {
  return { min: MIN_BREAK_MIN, max: MAX_BREAK_MIN }
}

export function getCycleDurationMin() {
  return SESSIONS_PER_CYCLE * (getWorkDurationMin() + getBreakDurationMin())
}

export function formatCycleHours() {
  const hours = getCycleDurationMin() / 60
  if (hours >= 1.95) return `${Math.round(hours)} hours`
  if (hours >= 1) return `${hours.toFixed(1).replace(/\.0$/, '')} hours`
  return `${getCycleDurationMin()} min`
}

export function getJourneyDescription() {
  const work = getWorkDurationMin()
  const brk = getBreakDurationMin()
  return `${SESSIONS_PER_CYCLE} × ${work} min focus + ${brk} min breaks — about ${formatCycleHours()} of deep study.`
}

export function isOnboarded() {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === 'true'
  } catch {
    return false
  }
}

export function setOnboarded() {
  try {
    localStorage.setItem(ONBOARDED_KEY, 'true')
  } catch {
    /* ignore */
  }
}
