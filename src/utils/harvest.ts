const HARVEST_KEY = 'tomato-time-harvest'
const LEGACY_JOURNEYS_KEY = 'tomato-time-journeys'
export const HARVEST_EVENT = 'tomato-harvest-update'

interface DayRecord {
  tomatoes: number
  journeys: number
}

interface HarvestData {
  days: Record<string, DayRecord>
  totalTomatoes: number
  totalJourneys: number
}

export interface HarvestStats {
  todayTomatoes: number
  todayJourneys: number
  weekTomatoes: number
  weekJourneys: number
  monthTomatoes: number
  monthJourneys: number
  totalTomatoes: number
  totalJourneys: number
  streak: number
  last7Days: { date: string; label: string; tomatoes: number }[]
  monthDays: { date: string; label: string; tomatoes: number }[]
}

function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dateKeyFromOffset(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en', { weekday: 'short' })
}

function loadData(): HarvestData {
  try {
    const raw = localStorage.getItem(HARVEST_KEY)
    if (raw) return JSON.parse(raw) as HarvestData

    const legacyJourneys =
      parseInt(localStorage.getItem(LEGACY_JOURNEYS_KEY) ?? '0', 10) || 0
    return { days: {}, totalTomatoes: 0, totalJourneys: legacyJourneys }
  } catch {
    return { days: {}, totalTomatoes: 0, totalJourneys: 0 }
  }
}

function saveData(data: HarvestData) {
  try {
    localStorage.setItem(HARVEST_KEY, JSON.stringify(data))
    localStorage.setItem(LEGACY_JOURNEYS_KEY, String(data.totalJourneys))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(HARVEST_EVENT))
}

function ensureDay(data: HarvestData, key: string): DayRecord {
  if (!data.days[key]) data.days[key] = { tomatoes: 0, journeys: 0 }
  return data.days[key]
}

export function recordTomatoHarvest() {
  const data = loadData()
  const key = todayKey()
  const day = ensureDay(data, key)
  day.tomatoes += 1
  data.totalTomatoes += 1
  saveData(data)
}

export function recordJourneyHarvest() {
  const data = loadData()
  const key = todayKey()
  const day = ensureDay(data, key)
  day.journeys += 1
  data.totalJourneys += 1
  saveData(data)
}

function daysInCurrentMonth(): number {
  const d = new Date()
  return d.getDate()
}

export function getHarvestStats(): HarvestStats {
  const data = loadData()
  const today = todayKey()
  const todayRecord = data.days[today] ?? { tomatoes: 0, journeys: 0 }

  let weekTomatoes = 0
  let weekJourneys = 0
  const last7Days: HarvestStats['last7Days'] = []

  for (let i = -6; i <= 0; i++) {
    const key = dateKeyFromOffset(i)
    const record = data.days[key] ?? { tomatoes: 0, journeys: 0 }
    weekTomatoes += record.tomatoes
    weekJourneys += record.journeys
    last7Days.push({
      date: key,
      label: i === 0 ? 'Today' : dayLabel(key),
      tomatoes: record.tomatoes,
    })
  }

  let monthTomatoes = 0
  let monthJourneys = 0
  const monthDays: HarvestStats['monthDays'] = []
  const monthPrefix = today.slice(0, 7)

  for (let day = 1; day <= daysInCurrentMonth(); day++) {
    const key = `${monthPrefix}-${String(day).padStart(2, '0')}`
    const record = data.days[key] ?? { tomatoes: 0, journeys: 0 }
    monthTomatoes += record.tomatoes
    monthJourneys += record.journeys
    monthDays.push({
      date: key,
      label: String(day),
      tomatoes: record.tomatoes,
    })
  }

  let streak = 0
  for (let i = 0; i < 365; i++) {
    const key = dateKeyFromOffset(-i)
    const tomatoes = data.days[key]?.tomatoes ?? 0
    if (tomatoes > 0) streak += 1
    else break
  }

  return {
    todayTomatoes: todayRecord.tomatoes,
    todayJourneys: todayRecord.journeys,
    weekTomatoes,
    weekJourneys,
    monthTomatoes,
    monthJourneys,
    totalTomatoes: data.totalTomatoes,
    totalJourneys: data.totalJourneys,
    streak,
    last7Days,
    monthDays,
  }
}

export function getHarvestDays(): Record<string, DayRecord> {
  return { ...loadData().days }
}

export function loadJourneysFromHarvest(): number {
  return loadData().totalJourneys
}

export function saveJourneysToHarvest(n: number) {
  const data = loadData()
  data.totalJourneys = n
  saveData(data)
}
