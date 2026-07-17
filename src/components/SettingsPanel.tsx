import {
  formatCycleHoursLocalized,
  type Locale,
} from '../i18n/messages'
import {
  getBreakDurationBounds,
  getCycleDurationMin,
  getWorkDurationBounds,
} from '../utils/settings'
import { SESSIONS_PER_CYCLE } from '../constants'
import type { ThemePreference } from '../utils/theme'
import { useLocale } from '../hooks/useLocale'

interface SettingsPanelProps {
  workMin: number
  breakMin: number
  theme: ThemePreference
  locked: boolean
  onChangeWork: (minutes: number) => void
  onChangeBreak: (minutes: number) => void
  onChangeTheme: (theme: ThemePreference) => void
  onClose: () => void
}

const THEME_OPTIONS: { id: ThemePreference; labelKey: 'settings.themeLight' | 'settings.themeDark' | 'settings.themeSystem' }[] = [
  { id: 'light', labelKey: 'settings.themeLight' },
  { id: 'dark', labelKey: 'settings.themeDark' },
  { id: 'system', labelKey: 'settings.themeSystem' },
]

const LOCALE_OPTIONS: { id: Locale; labelKey: 'settings.langEn' | 'settings.langPt' }[] = [
  { id: 'en', labelKey: 'settings.langEn' },
  { id: 'pt', labelKey: 'settings.langPt' },
]

export function SettingsPanel({
  workMin,
  breakMin,
  theme,
  locked,
  onChangeWork,
  onChangeBreak,
  onChangeTheme,
  onClose,
}: SettingsPanelProps) {
  const { locale, setLocale, t } = useLocale()
  const workBounds = getWorkDurationBounds()
  const breakBounds = getBreakDurationBounds()
  const cycleHours = formatCycleHoursLocalized(locale, getCycleDurationMin())

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <header className="settings-header">
          <div>
            <h2 id="settings-title" className="settings-title">
              {t('settings.title')}
            </h2>
            <p className="settings-tagline">{t('settings.tagline')}</p>
          </div>
          <button type="button" className="settings-close" onClick={onClose} aria-label={t('settings.close')}>
            ×
          </button>
        </header>

        {locked && (
          <p className="settings-locked" role="status">
            {t('settings.locked')}
          </p>
        )}

        <div className="settings-field">
          <label htmlFor="work-minutes" className="settings-label">
            {t('settings.focusSession')}
          </label>
          <div className="settings-control-row">
            <input
              id="work-minutes"
              type="range"
              min={workBounds.min}
              max={workBounds.max}
              step={1}
              value={workMin}
              disabled={locked}
              onChange={(e) => onChangeWork(Number(e.target.value))}
            />
            <span className="settings-value">{t('settings.min', { n: workMin })}</span>
          </div>
        </div>

        <div className="settings-field">
          <label htmlFor="break-minutes" className="settings-label">
            {t('settings.break')}
          </label>
          <div className="settings-control-row">
            <input
              id="break-minutes"
              type="range"
              min={breakBounds.min}
              max={breakBounds.max}
              step={1}
              value={breakMin}
              disabled={locked}
              onChange={(e) => onChangeBreak(Number(e.target.value))}
            />
            <span className="settings-value">{t('settings.min', { n: breakMin })}</span>
          </div>
        </div>

        <div className="settings-field">
          <span className="settings-label">{t('settings.theme')}</span>
          <div className="settings-theme-row" role="group" aria-label={t('settings.theme')}>
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`settings-theme-btn ${theme === option.id ? 'settings-theme-btn--active' : ''}`}
                aria-pressed={theme === option.id}
                onClick={() => onChangeTheme(option.id)}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-field">
          <span className="settings-label">{t('settings.language')}</span>
          <div className="settings-theme-row" role="group" aria-label={t('settings.language')}>
            {LOCALE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`settings-theme-btn ${locale === option.id ? 'settings-theme-btn--active' : ''}`}
                aria-pressed={locale === option.id}
                onClick={() => setLocale(option.id)}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-summary">
          <p>
            {t('settings.journeyDesc', {
              sessions: SESSIONS_PER_CYCLE,
              work: workMin,
              break: breakMin,
              hours: cycleHours,
            })}
          </p>
          <p className="settings-summary-sub">
            {t('settings.totalJourney', { hours: cycleHours })}
          </p>
        </div>
      </div>
    </div>
  )
}
