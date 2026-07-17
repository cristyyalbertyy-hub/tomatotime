import { Tomato } from './Tomato'
import type { HarvestStats } from '../utils/harvest'
import { exportHarvestCsv, exportHarvestJson } from '../utils/exportHarvest'
import { formatWeekdayLabel } from '../i18n/messages'
import { useLocale } from '../hooks/useLocale'

interface HarvestPanelProps {
  stats: HarvestStats
  onClose: () => void
}

function TomatoCluster({ count, size = 22 }: { count: number; size?: number }) {
  if (count === 0) return null
  const shown = Math.min(count, 8)
  return (
    <span className="harvest-tomato-cluster">
      {Array.from({ length: shown }).map((_, i) => (
        <Tomato key={i} mood="happy" size={size} />
      ))}
      {count > 8 && <span className="harvest-tomato-more">+{count - 8}</span>}
    </span>
  )
}

export function HarvestPanel({ stats, onClose }: HarvestPanelProps) {
  const { locale, t } = useLocale()
  const maxWeekTomatoes = Math.max(1, ...stats.last7Days.map((d) => d.tomatoes))
  const isEmpty = stats.totalTomatoes === 0

  const weekDays = stats.last7Days.map((day, index) => ({
    ...day,
    label:
      index === stats.last7Days.length - 1
        ? t('harvest.today')
        : formatWeekdayLabel(locale, day.date),
  }))

  return (
    <div
      className="harvest-overlay"
      role="dialog"
      aria-labelledby="harvest-title"
      onClick={onClose}
    >
      <div className="harvest-panel" onClick={(e) => e.stopPropagation()}>
        <header className="harvest-header">
          <div>
            <h2 id="harvest-title" className="harvest-title">
              {t('harvest.title')}
            </h2>
            <p className="harvest-tagline">{t('harvest.tagline')}</p>
          </div>
          <button
            type="button"
            className="harvest-close"
            onClick={onClose}
            aria-label={t('harvest.close')}
          >
            ×
          </button>
        </header>

        <div className="harvest-hero">
          <div className="harvest-hero-main">
            <TomatoCluster count={stats.todayTomatoes} size={26} />
            <span className="harvest-hero-count">{stats.todayTomatoes}</span>
            <span className="harvest-hero-label">{t('harvest.today')}</span>
            {stats.todayJourneys > 0 && (
              <span className="harvest-hero-sub">
                {t(
                  stats.todayJourneys === 1
                    ? 'harvest.journeyTodayOne'
                    : 'harvest.journeyTodayMany',
                  { n: stats.todayJourneys },
                )}
              </span>
            )}
          </div>

          {stats.streak > 0 && (
            <div className="harvest-streak-badge" aria-label={`${stats.streak} ${t('harvest.dayStreak')}`}>
              <span className="harvest-streak-count">{stats.streak}</span>
              <span className="harvest-streak-label">{t('harvest.dayStreak')}</span>
            </div>
          )}
        </div>

        {isEmpty && (
          <p className="harvest-empty-state">{t('harvest.empty')}</p>
        )}

        <section className="harvest-section">
          <h3 className="harvest-section-label">{t('harvest.last7Days')}</h3>
          <div className="harvest-week-chart harvest-week-chart--hero">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={[
                  'harvest-day-col',
                  day.tomatoes > 0 ? 'harvest-day-col--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="harvest-day-bar-wrap">
                  <div
                    className="harvest-day-bar"
                    style={{
                      height: `${Math.max(day.tomatoes > 0 ? 12 : 0, (day.tomatoes / maxWeekTomatoes) * 100)}%`,
                    }}
                  />
                </div>
                {day.tomatoes > 0 && (
                  <span className="harvest-day-tomato" aria-hidden="true">
                    <Tomato mood="happy" size={14} />
                  </span>
                )}
                <span className="harvest-day-label">{day.label}</span>
              </div>
            ))}
          </div>
          <p className="harvest-summary-pill">
            {t('harvest.weekPill', {
              tomatoes: stats.weekTomatoes,
              journeys: stats.weekJourneys,
            })}
          </p>
        </section>

        <section className="harvest-section">
          <h3 className="harvest-section-label">{t('harvest.thisMonth')}</h3>
          <p className="harvest-summary-pill harvest-summary-pill--month">
            {t('harvest.monthPill', {
              tomatoes: stats.monthTomatoes,
              journeys: stats.monthJourneys,
            })}
          </p>
        </section>

        <section className="harvest-section harvest-section--footer">
          <div className="harvest-totals">
            <div className="harvest-total-chip">
              <Tomato mood="happy" size={16} />
              <span className="harvest-total-value">{stats.totalTomatoes}</span>
              <span className="harvest-total-label">{t('harvest.allTime')}</span>
            </div>
            <div className="harvest-total-chip">
              <span className="harvest-total-value">{stats.totalJourneys}</span>
              <span className="harvest-total-label">{t('harvest.unitJourneys')}</span>
            </div>
          </div>
          <div className="harvest-export-row">
            <button type="button" className="harvest-export-btn" onClick={exportHarvestCsv}>
              {t('harvest.exportCsv')}
            </button>
            <button type="button" className="harvest-export-btn" onClick={exportHarvestJson}>
              {t('harvest.exportJson')}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
