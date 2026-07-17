import { useMemo } from 'react'
import type { Phase } from '../constants'
import { getBreakDurationSec, getWorkDurationSec } from '../utils/settings'
import type { TimerDisplayMode } from '../utils/settings'
import { useLocale } from '../hooks/useLocale'

type Props = {
  phase: Phase
  elapsedSec: number
  phaseProgress: number
  isRunning: boolean
  isPaused?: boolean
  timerDisplay?: TimerDisplayMode
}

function formatTime(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerRing({
  phase,
  elapsedSec,
  phaseProgress,
  isRunning,
  isPaused = false,
  timerDisplay = 'countdown',
}: Props) {
  const { t } = useLocale()
  const size = 220
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, phaseProgress)))

  const phaseLabel = useMemo(() => {
    if (isPaused && phase !== 'idle') return t('phase.paused')
    if (phase === 'work') return t('timer.phase.focus')
    if (phase === 'break') return t('timer.phase.break')
    return t('timer.phase.ready')
  }, [phase, isPaused, t])

  const phaseTotalSec =
    phase === 'work'
      ? getWorkDurationSec()
      : phase === 'break'
        ? getBreakDurationSec()
        : getWorkDurationSec()

  const remainingSec =
    phase === 'idle' ? phaseTotalSec : Math.max(0, phaseTotalSec - elapsedSec)

  const elapsedDisplaySec =
    phase === 'idle' ? 0 : Math.min(elapsedSec, phaseTotalSec)

  const displaySec = timerDisplay === 'countup' ? elapsedDisplaySec : remainingSec

  const phaseTotalMin = Math.round(phaseTotalSec / 60)

  const ariaTimeKey =
    timerDisplay === 'countup' ? 'timer.ariaElapsed' : 'timer.ariaRemaining'

  return (
    <div
      className={[
        'timer-ring',
        phase,
        isRunning ? 'running' : '',
        isPaused ? 'timer-ring--paused' : '',
        timerDisplay === 'countup' ? 'timer-ring--countup' : 'timer-ring--countdown',
      ]
        .filter(Boolean)
        .join(' ')}
      role="timer"
      aria-live="polite"
      aria-label={t(ariaTimeKey, {
        phase: phaseLabel,
        time: formatTime(displaySec),
      })}
    >
      <svg
        className="timer-ring-svg"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          className="timer-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        {phase !== 'idle' && (
          <circle
            className="timer-ring-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      <div className="timer-ring-center">
        {isPaused && phase !== 'idle' && (
          <span className="timer-ring-paused-badge">{t('phase.paused')}</span>
        )}
        <span className="timer-ring-time">{formatTime(displaySec)}</span>
        {phase !== 'idle' && (
          <span className="timer-ring-sub">
            {timerDisplay === 'countup'
              ? t('timer.ofMinTotal', { min: phaseTotalMin })
              : t('timer.ofMin', { min: phaseTotalMin })}
          </span>
        )}
        {phase === 'idle' && (
          <span className="timer-ring-sub">{t('timer.ofMin', { min: phaseTotalMin })}</span>
        )}
      </div>
    </div>
  )
}
