import { Tomato } from './Tomato'
import type { HarvestStats } from '../utils/harvest'
import { exportHarvestCsv, exportHarvestJson } from '../utils/exportHarvest'

interface HarvestPanelProps {
  stats: HarvestStats
  onClose: () => void
}

function TomatoRow({ count, max = 12 }: { count: number; max?: number }) {
  if (count === 0) {
    return <span className="harvest-empty">—</span>
  }
  const shown = Math.min(count, max)
  return (
    <span className="harvest-tomato-row">
      {Array.from({ length: shown }).map((_, i) => (
        <Tomato key={i} mood="happy" size={18} />
      ))}
      {count > max && (
        <span className="harvest-tomato-more">+{count - max}</span>
      )}
    </span>
  )
}

export function HarvestPanel({ stats, onClose }: HarvestPanelProps) {
  const maxWeekTomatoes = Math.max(
    1,
    ...stats.last7Days.map((d) => d.tomatoes),
  )
  const maxMonthTomatoes = Math.max(1, ...stats.monthDays.map((d) => d.tomatoes))

  return (
    <div
      className="harvest-overlay"
      role="dialog"
      aria-labelledby="harvest-title"
      onClick={onClose}
    >
      <div
        className="harvest-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="harvest-header">
          <div>
            <h2 id="harvest-title" className="harvest-title">
              Harvest
            </h2>
            <p className="harvest-tagline">One tomato at a time</p>
          </div>
          <button
            type="button"
            className="harvest-close"
            onClick={onClose}
            aria-label="Close harvest"
          >
            ×
          </button>
        </header>

        <section className="harvest-section">
          <h3 className="harvest-section-label">Today</h3>
          <div className="harvest-stat-card harvest-stat-card--highlight">
            <TomatoRow count={stats.todayTomatoes} />
            <p className="harvest-stat-number">
              {stats.todayTomatoes} tomato{stats.todayTomatoes !== 1 ? 'es' : ''}
            </p>
            {stats.todayJourneys > 0 && (
              <p className="harvest-stat-sub">
                {stats.todayJourneys} journey
                {stats.todayJourneys !== 1 ? 's' : ''} today
              </p>
            )}
          </div>
        </section>

        <section className="harvest-section">
          <h3 className="harvest-section-label">This week</h3>
          <div className="harvest-stat-row">
            <div className="harvest-stat-card">
              <span className="harvest-stat-number">{stats.weekTomatoes}</span>
              <span className="harvest-stat-unit">tomatoes</span>
            </div>
            <div className="harvest-stat-card">
              <span className="harvest-stat-number">{stats.weekJourneys}</span>
              <span className="harvest-stat-unit">journeys</span>
            </div>
          </div>
        </section>

        <section className="harvest-section">
          <h3 className="harvest-section-label">This month</h3>
          <div className="harvest-stat-row">
            <div className="harvest-stat-card">
              <span className="harvest-stat-number">{stats.monthTomatoes}</span>
              <span className="harvest-stat-unit">tomatoes</span>
            </div>
            <div className="harvest-stat-card">
              <span className="harvest-stat-number">{stats.monthJourneys}</span>
              <span className="harvest-stat-unit">journeys</span>
            </div>
          </div>
          <div className="harvest-month-chart">
            {stats.monthDays.map((day) => (
              <div key={day.date} className="harvest-day-col harvest-day-col--month">
                <div className="harvest-day-bar-wrap">
                  <div
                    className="harvest-day-bar"
                    style={{ height: `${(day.tomatoes / maxMonthTomatoes) * 100}%` }}
                  />
                </div>
                <span className="harvest-day-count">
                  {day.tomatoes > 0 ? day.tomatoes : '·'}
                </span>
                <span className="harvest-day-label">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="harvest-section">
          <h3 className="harvest-section-label">Last 7 days</h3>
          <div className="harvest-week-chart">
            {stats.last7Days.map((day) => (
              <div key={day.date} className="harvest-day-col">
                <div className="harvest-day-bar-wrap">
                  <div
                    className="harvest-day-bar"
                    style={{
                      height: `${(day.tomatoes / maxWeekTomatoes) * 100}%`,
                    }}
                  />
                </div>
                <span className="harvest-day-count">
                  {day.tomatoes > 0 ? day.tomatoes : '·'}
                </span>
                <span className="harvest-day-label">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="harvest-section harvest-section--footer">
          <div className="harvest-export-row">
            <button type="button" className="harvest-export-btn" onClick={exportHarvestCsv}>
              Export CSV
            </button>
            <button type="button" className="harvest-export-btn" onClick={exportHarvestJson}>
              Export JSON
            </button>
          </div>
          <div className="harvest-stat-row">
            <div className="harvest-stat-card harvest-stat-card--compact">
              <span className="harvest-stat-number">{stats.streak}</span>
              <span className="harvest-stat-unit">day streak</span>
            </div>
            <div className="harvest-stat-card harvest-stat-card--compact">
              <span className="harvest-stat-number">{stats.totalTomatoes}</span>
              <span className="harvest-stat-unit">all-time 🍅</span>
            </div>
            <div className="harvest-stat-card harvest-stat-card--compact">
              <span className="harvest-stat-number">{stats.totalJourneys}</span>
              <span className="harvest-stat-unit">journeys</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
