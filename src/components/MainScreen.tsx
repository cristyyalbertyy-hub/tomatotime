import type { Phase } from '../constants'
import type { TomatoPosition, TimerStatus } from '../types'
import { SESSIONS_PER_CYCLE } from '../constants'
import { Tomato } from './Tomato'
import { SessionTracks } from './SessionTracks'

interface MainScreenProps {
  tomatoPos: TomatoPosition
  tomatoVisible: boolean
  minute: number
  second: number
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
  minute,
  second,
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

  const tomatoMood = celebrating
    ? 'celebrate'
    : status === 'paused'
      ? 'paused'
      : phase === 'break'
        ? 'break'
        : phase === 'work' && minute >= 20
          ? 'tired'
          : status === 'running'
            ? 'focused'
            : 'happy'

  const phaseLabel = celebrating
    ? 'Journey complete!'
    : phase === 'work'
      ? `Work · Session ${sessionIndex + 1}/${SESSIONS_PER_CYCLE}`
      : phase === 'break'
        ? `Break · Session ${sessionIndex + 1}/${SESSIONS_PER_CYCLE}`
        : 'Ready for a 2h journey'

  return (
    <div className="main-screen">
      {celebrating && (
        <div className="journey-overlay" role="dialog" aria-live="assertive">
          <div className="journey-overlay-content">
            <Tomato mood="celebrate" size={100} />
            <h2 className="journey-overlay-title">Journey Complete!</h2>
            <p className="journey-overlay-sub">
              2 hour cycle done · {journeys} journey{journeys !== 1 ? 's' : ''}{' '}
              total
            </p>
          </div>
        </div>
      )}

      <header className={`top-bar ${inCycle ? 'top-bar--focus' : ''}`}>
        <div className="brand">
          <div className="brand-logo-wrap">
            <img
              src="/studio9-transparent.png"
              alt="Studio 9"
              className="brand-logo"
            />
          </div>
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
        <div
          className={`timer-display ${phase === 'break' ? 'timer-display--break' : ''}`}
          aria-live="polite"
        >
          <span key={`${phase}-${minute}`} className="timer-minute">
            {minute}
          </span>
          <span className="timer-unit">
            {phase === 'break' ? 'of 5' : 'of 25'}
          </span>
          <span key={`${phase}-${minute}-${second}`} className="timer-second">
            {second}
          </span>
          <span className="timer-unit timer-unit--sec">sec</span>
        </div>
      )}
    </div>
  )
}
