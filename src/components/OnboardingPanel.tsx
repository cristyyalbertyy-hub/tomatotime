import { Tomato } from './Tomato'
import {
  formatCycleHours,
  getBreakDurationMin,
  getJourneyDescription,
  getWorkDurationMin,
} from '../utils/settings'

interface OnboardingPanelProps {
  onStart: () => void
  onOpenSettings: () => void
}

export function OnboardingPanel({ onStart, onOpenSettings }: OnboardingPanelProps) {
  const work = getWorkDurationMin()
  const brk = getBreakDurationMin()

  return (
    <div className="onboarding-overlay" role="dialog" aria-labelledby="onboarding-title">
      <div className="onboarding-panel">
        <div className="onboarding-hero">
          <Tomato mood="happy" size={72} />
          <h2 id="onboarding-title" className="onboarding-title">
            Welcome to Tomato Time
          </h2>
          <p className="onboarding-lead">
            A Pomodoro journey for deep study — built for Studio9 Medical Science.
          </p>
        </div>

        <ol className="onboarding-steps">
          <li>
            <strong>4 focus sessions</strong> — your tomato travels one track per session (
            {work} min each by default).
          </li>
          <li>
            <strong>Short breaks</strong> — {brk} min to stretch, hydrate, and reset between
            sessions.
          </li>
          <li>
            <strong>One journey</strong> — about {formatCycleHours()} of focused study, then
            celebrate and harvest your tomatoes.
          </li>
          <li>
            <strong>Sound & alerts</strong> — allow notifications so you hear when a session
            ends, even in another app.
          </li>
        </ol>

        <p className="onboarding-note">{getJourneyDescription()}</p>

        <div className="onboarding-actions">
          <button type="button" className="btn btn-primary onboarding-start" onClick={onStart}>
            Start my first journey
          </button>
          <button
            type="button"
            className="btn btn-secondary onboarding-settings"
            onClick={onOpenSettings}
          >
            Adjust times first
          </button>
        </div>
      </div>
    </div>
  )
}
