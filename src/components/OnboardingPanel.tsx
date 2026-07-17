import { Tomato } from './Tomato'
import {
  formatCycleHoursLocalized,
} from '../i18n/messages'
import { SESSIONS_PER_CYCLE } from '../constants'
import {
  getBreakDurationMin,
  getCycleDurationMin,
  getWorkDurationMin,
} from '../utils/settings'
import { useLocale } from '../hooks/useLocale'

interface OnboardingPanelProps {
  onStart: () => void
  onOpenSettings: () => void
}

export function OnboardingPanel({ onStart, onOpenSettings }: OnboardingPanelProps) {
  const { locale, t } = useLocale()
  const work = getWorkDurationMin()
  const brk = getBreakDurationMin()
  const cycleHours = formatCycleHoursLocalized(locale, getCycleDurationMin())

  return (
    <div className="onboarding-overlay" role="dialog" aria-labelledby="onboarding-title">
      <div className="onboarding-panel">
        <div className="onboarding-hero">
          <Tomato mood="happy" size={72} />
          <h2 id="onboarding-title" className="onboarding-title">
            {t('onboarding.title')}
          </h2>
          <p className="onboarding-lead">{t('onboarding.lead')}</p>
        </div>

        <ol className="onboarding-steps">
          <li>{t('onboarding.step1', { work })}</li>
          <li>{t('onboarding.step2', { break: brk })}</li>
          <li>{t('onboarding.step3', { hours: cycleHours })}</li>
          <li>{t('onboarding.step4')}</li>
        </ol>

        <p className="onboarding-note">
          {t('settings.journeyDesc', {
            sessions: SESSIONS_PER_CYCLE,
            work,
            break: brk,
            hours: cycleHours,
          })}
        </p>

        <div className="onboarding-actions">
          <button type="button" className="btn btn-primary onboarding-start" onClick={onStart}>
            {t('onboarding.start')}
          </button>
          <button
            type="button"
            className="btn btn-secondary onboarding-settings"
            onClick={onOpenSettings}
          >
            {t('onboarding.settings')}
          </button>
        </div>
      </div>
    </div>
  )
}
