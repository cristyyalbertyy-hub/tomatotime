import {
  formatCycleHours,
  getBreakDurationBounds,
  getJourneyDescription,
  getWorkDurationBounds,
} from '../utils/settings'
import type { ThemePreference } from '../utils/theme'

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

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
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
  const workBounds = getWorkDurationBounds()
  const breakBounds = getBreakDurationBounds()

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
              Settings
            </h2>
            <p className="settings-tagline">Tune your journey & appearance</p>
          </div>
          <button type="button" className="settings-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {locked && (
          <p className="settings-locked" role="status">
            Finish or reset the current journey before changing times.
          </p>
        )}

        <div className="settings-field">
          <label htmlFor="work-minutes" className="settings-label">
            Focus session
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
            <span className="settings-value">{workMin} min</span>
          </div>
        </div>

        <div className="settings-field">
          <label htmlFor="break-minutes" className="settings-label">
            Break
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
            <span className="settings-value">{breakMin} min</span>
          </div>
        </div>

        <div className="settings-field">
          <span className="settings-label">Theme</span>
          <div className="settings-theme-row" role="group" aria-label="Theme">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`settings-theme-btn ${theme === option.id ? 'settings-theme-btn--active' : ''}`}
                aria-pressed={theme === option.id}
                onClick={() => onChangeTheme(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-summary">
          <p>{getJourneyDescription()}</p>
          <p className="settings-summary-sub">Total journey ≈ {formatCycleHours()}</p>
        </div>
      </div>
    </div>
  )
}
