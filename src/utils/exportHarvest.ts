import { getHarvestDays, getHarvestStats } from './harvest'

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function sortedDays() {
  const days = getHarvestDays()
  return Object.entries(days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, record]) => ({ date, ...record }))
}

export function exportHarvestJson() {
  const stats = getHarvestStats()
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'Tomato Time',
    summary: {
      todayTomatoes: stats.todayTomatoes,
      todayJourneys: stats.todayJourneys,
      weekTomatoes: stats.weekTomatoes,
      weekJourneys: stats.weekJourneys,
      monthTomatoes: stats.monthTomatoes,
      monthJourneys: stats.monthJourneys,
      totalTomatoes: stats.totalTomatoes,
      totalJourneys: stats.totalJourneys,
      streak: stats.streak,
    },
    days: sortedDays(),
  }
  const stamp = new Date().toISOString().slice(0, 10)
  downloadFile(
    `tomato-time-harvest-${stamp}.json`,
    JSON.stringify(payload, null, 2),
    'application/json',
  )
}

export function exportHarvestCsv() {
  const stats = getHarvestStats()
  const rows = [
    'section,metric,value',
    `summary,today_tomatoes,${stats.todayTomatoes}`,
    `summary,today_journeys,${stats.todayJourneys}`,
    `summary,week_tomatoes,${stats.weekTomatoes}`,
    `summary,week_journeys,${stats.weekJourneys}`,
    `summary,month_tomatoes,${stats.monthTomatoes}`,
    `summary,month_journeys,${stats.monthJourneys}`,
    `summary,total_tomatoes,${stats.totalTomatoes}`,
    `summary,total_journeys,${stats.totalJourneys}`,
    `summary,streak_days,${stats.streak}`,
    'date,tomatoes,journeys',
    ...sortedDays().map((d) => `${d.date},${d.tomatoes},${d.journeys}`),
  ]
  const stamp = new Date().toISOString().slice(0, 10)
  downloadFile(`tomato-time-harvest-${stamp}.csv`, rows.join('\n'), 'text/csv')
}
