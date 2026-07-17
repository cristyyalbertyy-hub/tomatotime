import { useEffect, useRef, useState } from 'react'
import type { Phase } from '../constants'
import type { TomatoPosition, TimerStatus } from '../types'
import { MEDICAL_SITE_URL, SESSIONS_PER_CYCLE } from '../constants'
import {
  getCycleDurationMin,
  getWorkDurationSec,
} from '../utils/settings'
import { formatCycleHoursLocalized, journeyPluralSuffix } from '../i18n/messages'
import { useLocale } from '../hooks/useLocale'
import { Tomato } from './Tomato'
import { SessionTracks } from './SessionTracks'
import { TimerRing } from './TimerRing'
import { Confetti } from './Confetti'
import { StudyTip } from './StudyTip'
import { Studio9Link } from './Studio9Link'
import { FocusMenu } from './FocusMenu'

interface MainScreenProps {
  tomatoPos: TomatoPosition
  tomatoVisible: boolean
  minute: number
  second: number
  elapsedSec: number
  phaseProgress: number
  journeys: number
  todayTomatoes: number
  cycleSessionDone: number
  sessionIndex: number
  phase: Phase
  status: TimerStatus
  celebrating: boolean
  inCycle: boolean
  soundOn: boolean
  onOpenHarvest: () => void
  onOpenSettings: () => void
  onToggleSound: () => void
  onRequestReset: () => void
}

export function MainScreen({
  tomatoPos,
  tomatoVisible,
  elapsedSec,
  phaseProgress,
  journeys,
  todayTomatoes,
  cycleSessionDone,
  sessionIndex,
  phase,
  status,
  celebrating,
  inCycle,
  soundOn,
  onOpenHarvest,
  onOpenSettings,
  onToggleSound,
  onRequestReset,
}: MainScreenProps) {
  const { locale, t } = useLocale()
  const cycleHours = formatCycleHoursLocalized(locale, getCycleDurationMin())
  const focusMode = inCycle && !celebrating
  const isPaused = status === 'paused'

  const [focusEntering, setFocusEntering] = useState(false)
  const [pulseDot, setPulseDot] = useState<number | null>(null)
  const wasInCycle = useRef(false)
  const prevPhase = useRef(phase)

  useEffect(() => {
    if (focusMode && !wasInCycle.current) {
      setFocusEntering(true)
      const timer = window.setTimeout(() => setFocusEntering(false), 450)
      wasInCycle.current = true
      return () => window.clearTimeout(timer)
    }
    if (!focusMode) wasInCycle.current = false
  }, [focusMode])

  useEffect(() => {
    if (prevPhase.current === 'work' && phase === 'break') {
      setPulseDot(sessionIndex)
      const timer = window.setTimeout(() => setPulseDot(null), 900)
      prevPhase.current = phase
      return () => window.clearTimeout(timer)
    }
    prevPhase.current = phase
  }, [phase, sessionIndex])

  const completedSessions = celebrating
    ? SESSIONS_PER_CYCLE
    : phase === 'work'
      ? sessionIndex
      : cycleSessionDone
  const activeSession = phase === 'work' ? sessionIndex : -1
  const isRunning = status === 'running'

  const tomatoMood = celebrating
    ? 'celebrate'
    : isPaused
      ? 'paused'
      : phase === 'break'
        ? 'break'
        : phase === 'work' && elapsedSec >= getWorkDurationSec() * 0.8
          ? 'tired'
          : status === 'running'
            ? 'focused'
            : 'happy'

  const phaseLabel = celebrating
    ? t('phase.journeyComplete')
    : phase === 'work'
      ? t('phase.focusSession', {
          current: sessionIndex + 1,
          total: SESSIONS_PER_CYCLE,
        })
      : phase === 'break'
        ? t('phase.breakSession', {
            current: sessionIndex + 1,
            total: SESSIONS_PER_CYCLE,
          })
        : t('phase.readyJourney', { hours: cycleHours })

  const inlinePhaseLabel =
    isPaused && focusMode ? `${phaseLabel} · ${t('phase.paused')}` : phaseLabel

  const showIdleExtras = !inCycle && !celebrating

  return (
    <div
      className={[
        'main-screen',
        focusMode ? 'main-screen--focus' : '',
        focusEntering ? 'main-screen--focus-enter' : '',
        isPaused && focusMode ? 'main-screen--paused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {celebrating && (
        <div className="journey-overlay" role="dialog" aria-live="assertive">
          <Confetti />
          <div className="journey-overlay-content">
            <Tomato mood="celebrate" size={100} />
            <h2 className="journey-overlay-title">{t('journey.overlayTitle')}</h2>
            <p className="journey-overlay-sub">
              {t('journey.overlaySub', {
                hours: cycleHours,
                count: journeys,
                plural: journeyPluralSuffix(locale, journeys),
              })}
            </p>
            <a
              className="journey-overlay-cta"
              href={MEDICAL_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('journey.overlayCta')}
            </a>
          </div>
        </div>
      )}

      <header className={`top-bar ${focusMode ? 'top-bar--focus' : ''}`}>
        <div className="brand">
          {showIdleExtras && (
            <h1 className="brand-title brand-title--idle">
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
          {focusMode && (
            <p className="phase-label phase-label--inline">{inlinePhaseLabel}</p>
          )}
        </div>

        <div className="top-bar-actions">
          <button
            type="button"
            className={`journey-counter ${focusMode ? 'journey-counter--compact' : ''}`}
            onClick={onOpenHarvest}
            aria-label={t('journey.aria', { count: journeys })}
          >
            {!focusMode && (
              <>
                <span className="journey-label">{t('journey.label')}</span>
                <span className="journey-sublabel">
                  {todayTomatoes > 0
                    ? t('journey.todayTomatoes', { count: todayTomatoes })
                    : t('journey.cycles', { hours: cycleHours })}
                </span>
              </>
            )}
            <span className="journey-count">{journeys}</span>
            <div className="cycle-progress" aria-hidden="true">
              {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
                <span
                  key={i}
                  className={[
                    'cycle-dot',
                    i < completedSessions ? 'cycle-dot--done' : '',
                    inCycle && i === activeSession ? 'cycle-dot--active' : '',
                    i === pulseDot ? 'cycle-dot--pulse' : '',
                    celebrating ? 'cycle-dot--done' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          </button>

          {focusMode && (
            <FocusMenu
              soundOn={soundOn}
              todayTomatoes={todayTomatoes}
              onToggleSound={onToggleSound}
              onOpenSettings={onOpenSettings}
              onOpenHarvest={onOpenHarvest}
              onRequestReset={onRequestReset}
            />
          )}
        </div>
      </header>

      {showIdleExtras && (
        <p className="phase-label phase-label--idle">{phaseLabel}</p>
      )}

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
            elapsedSec={elapsedSec}
            phaseProgress={phaseProgress}
            isRunning={isRunning}
            isPaused={isPaused}
          />
        </div>
      )}

      {showIdleExtras && <StudyTip />}

      {showIdleExtras && (
        <div className="main-screen-footer main-screen-footer--idle">
          <Studio9Link />
          <p className="keyboard-hint">
            <kbd>Space</kbd> {t('controls.keyboardHint')}
          </p>
        </div>
      )}
    </div>
  )
}
