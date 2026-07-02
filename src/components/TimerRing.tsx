import { useMemo } from 'react'
import { BREAK_DURATION_SEC, WORK_DURATION_SEC, type Phase } from '../constants'

type Props = {
  phase: Phase
  elapsedSec: number
  phaseProgress: number
  isRunning: boolean
}

function formatTime(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerRing({ phase, elapsedSec, phaseProgress, isRunning }: Props) {
  const size = 220
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, phaseProgress)))

  const phaseLabel = useMemo(() => {
    if (phase === 'work') return 'Focus'
    if (phase === 'break') return 'Break'
    return 'Ready'
  }, [phase])

  const phaseTotal =
    phase === 'work' ? WORK_DURATION_SEC : phase === 'break' ? BREAK_DURATION_SEC : 0

  return (
    <div
      className={`timer-ring ${phase} ${isRunning ? 'running' : ''}`}
      role="timer"
      aria-live="polite"
      aria-label={`${phaseLabel}, ${formatTime(elapsedSec)} elapsed`}
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
        <span className="timer-ring-phase">{phaseLabel}</span>
        <span className="timer-ring-time">{formatTime(elapsedSec)}</span>
        {phase !== 'idle' && (
          <span className="timer-ring-sub">
            of {Math.round(phaseTotal / 60)} min
          </span>
        )}
      </div>
    </div>
  )
}
