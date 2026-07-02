import type { Phase } from '../constants'
import type { TomatoPosition, TimerStatus } from '../types'
import { MEDICAL_SITE_URL, SESSIONS_PER_CYCLE } from '../constants'
import { Tomato } from './Tomato'
import { SessionTracks } from './SessionTracks'
import { TimerRing } from './TimerRing'
import { Confetti } from './Confetti'
import { StudyTip } from './StudyTip'
import { Studio9Link } from './Studio9Link'

interface MainScreenProps {
  tomatoPos: TomatoPosition
  tomatoVisible: boolean
  minute: number
  second: number
  remainingSec: number
  phaseProgress: number
  journeys: number
  todayTomatoes: number
  cycleSessionDone: number
  sessionIndex: number
  phase: Phase
  status: TimerStatus
  celebrating: boolean
  inCycle: boolean
}

export function MainScreen({
  tomatoPos,
  tomatoVisible,
  remainingSec,
  phaseProgress,
  journeys,
  todayTomatoes,
  cycleSessionDone,
  sessionIndex,
  phase,
  status,
  celebrating,
  inCycle,
}: MainScreenProps) {
  const completedSessions = celebrating
    ? SESSIONS_PER_CYCLE
    : phase === 'work'
      ? sessionIndex
      : cycleSessionDone
  const activeSession = phase === 'work' ? sessionIndex : -1
  const isRunning = status === 'running'

  const tomatoMood = celebrating
    ? 'celebrate'
    : status === 'paused'
      ? 'paused'
      : phase === 'break'
        ? 'break'
        : phase === 'work' && remainingSec <= 300
          ? 'tired'
          : status === 'running'
            ? 'focused'
            : 'happy'

  const phaseLabel = celebrating
    ? 'Journey complete!'
    : phase === 'work'
      ? `Focus · Session ${sessionIndex + 1} of ${SESSIONS_PER_CYCLE}`
      : phase === 'break'
        ? `Break · Session ${sessionIndex + 1} of ${SESSIONS_PER_CYCLE}`
        : 'Ready for a 2-hour journey'

  const showIdleExtras = !inCycle && !celebrating

  return (
    <div className="main-screen">
      {celebrating && (
        <div className="journey-overlay" role="dialog" aria-live="assertive">
          <Confetti />
          <div className="journey-overlay-content">
            <Tomato mood="celebrate" size={100} />
            <h2 className="journey-overlay-title">Journey Complete!</h2>
            <p className="journey-overlay-sub">
              2-hour cycle done · {journeys} journey{journeys !== 1 ? 's' : ''}{' '}
              total
            </p>
            <a
              className="journey-overlay-cta"
              href={MEDICAL_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Studio9 · Medical Science
            </a>
          </div>
        </div>
      )}

      <header className={`top-bar ${inCycle ? 'top-bar--focus' : ''}`}>
        <div className="brand">
          {!inCycle && !celebrating && (
            <h1 className="brand-title">
              <span className="brand-rest">T</span>
              <span className="brand-o">
                <Tomato mood="happy" size={18} />
              </span>
              <span className="brand-rest">MAT</span>
              <span className="brand-o">
                <Tomato mood="happy" size={18} />
              </span>
              <span className="brand-rest"> TIME</span>
            </h1>
          )}
        </div>

        <aside
          className="journey-counter"
          aria-label="Completed 2 hour tomato journeys"
        >
          <span className="journey-label">Journeys</span>
          <span className="journey-sublabel">
            {todayTomatoes > 0
              ? `${todayTomatoes} 🍅 today`
              : '2h cycles'}
          </span>
          <span className="journey-count">{journeys}</span>
          <div className="cycle-progress" aria-label="Current cycle progress">
            {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
              <span
                key={i}
                className={[
                  'cycle-dot',
                  i < completedSessions ? 'cycle-dot--done' : '',
                  inCycle && i === activeSession ? 'cycle-dot--active' : '',
                  celebrating ? 'cycle-dot--done' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
        </aside>
      </header>

      <p className="phase-label">{phaseLabel}</p>

      <div className="track-area">
        <SessionTracks
          sessionIndex={sessionIndex}
          phase={phase}
          tomatoPos={tomatoPos}
          tomatoVisible={tomatoVisible}
          tomatoMood={tomatoMood}
          celebrating={celebrating}
          inCycle={inCycle}
        />
      </div>

      {!celebrating && (
        <div className="timer-section">
          <TimerRing
            phase={phase}
            remainingSec={remainingSec}
            phaseProgress={phaseProgress}
            isRunning={isRunning}
          />
        </div>
      )}

      {showIdleExtras && <StudyTip />}

      <div className="main-screen-footer">
        <Studio9Link />
        {showIdleExtras && (
          <p className="keyboard-hint">
            <kbd>Space</kbd> start / pause
          </p>
        )}
      </div>
    </div>
  )
}
