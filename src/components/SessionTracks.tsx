import type { Phase } from '../constants'
import type { TomatoPosition } from '../types'
import { SESSIONS_PER_CYCLE } from '../constants'
import { getBreakDurationMin, getWorkDurationMin } from '../utils/settings'
import { useLocale } from '../hooks/useLocale'
import { Tomato, type TomatoMood } from './Tomato'

const SESSION_LABELS = ['1', '2', '3', '4']

interface SessionTracksProps {
  sessionIndex: number
  phase: Phase
  tomatoPos: TomatoPosition
  tomatoVisible: boolean
  tomatoMood: TomatoMood
  celebrating: boolean
  inCycle: boolean
}

type RowState = 'pending' | 'ready' | 'active' | 'break' | 'done'

function getRowState(
  i: number,
  sessionIndex: number,
  phase: Phase,
  celebrating: boolean,
  inCycle: boolean,
): RowState {
  if (celebrating) return 'done'
  if (!inCycle) return i === 0 ? 'ready' : 'pending'
  if (i < sessionIndex) return 'done'
  if (phase === 'break' && i === sessionIndex) return 'break'
  if (phase === 'work' && i === sessionIndex) return 'active'
  if (phase === 'break' && i === sessionIndex + 1) return 'ready'
  return 'pending'
}

function getRowProgress(
  i: number,
  sessionIndex: number,
  phase: Phase,
  tomatoPos: TomatoPosition,
  celebrating: boolean,
): number {
  if (celebrating) return 100
  if (i < sessionIndex) return 100
  if (phase === 'break' && i === sessionIndex) return tomatoPos.x
  if (phase === 'work' && i === sessionIndex) return tomatoPos.x
  return 0
}

export function SessionTracks({
  sessionIndex,
  phase,
  tomatoPos,
  tomatoVisible,
  tomatoMood,
  celebrating,
  inCycle,
}: SessionTracksProps) {
  const { t } = useLocale()
  const workMin = getWorkDurationMin()
  const breakMin = getBreakDurationMin()

  return (
    <div className="session-tracks" aria-label={t('session.aria')}>
      {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => {
        const rowState = getRowState(
          i,
          sessionIndex,
          phase,
          celebrating,
          inCycle,
        )
        const progress = getRowProgress(
          i,
          sessionIndex,
          phase,
          tomatoPos,
          celebrating,
        )
        const atLineEnd = progress >= 99
        const showTomato =
          tomatoVisible &&
          !celebrating &&
          ((phase === 'work' && i === sessionIndex) ||
            (phase === 'break' && i === sessionIndex))

        const showWorkMarkers = rowState === 'active' || rowState === 'ready'
        const showBreakMarkers = rowState === 'break'

        return (
          <div
            key={i}
            className={[
              'session-track',
              `session-track--${rowState}`,
              atLineEnd && showTomato ? 'session-track--line-end' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="session-track-label">{SESSION_LABELS[i]}</span>

            <div className="session-track-body">
              {rowState === 'break' && (
                <span className="session-track-break-tag">{t('session.break')}</span>
              )}

              <div className="track-wrap">
                {showWorkMarkers ? (
                  <span className="track-marker track-marker--start">1</span>
                ) : showBreakMarkers ? (
                  <span className="track-marker track-marker--start track-marker--break">
                    1
                  </span>
                ) : (
                  <span className="track-marker track-marker--ghost" />
                )}

                <div className="track-rail">
                  <div
                    className={[
                      'track-tomato-lane',
                      rowState === 'active' || rowState === 'break'
                        ? 'track-tomato-lane--live'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden={!showTomato}
                  >
                    {showTomato && (
                      <div
                        className={[
                          'tomato-on-track',
                          `tomato-on-track--${tomatoMood}`,
                          tomatoPos.x <= 4 ? 'tomato-on-track--edge-start' : '',
                          tomatoPos.x >= 96 ? 'tomato-on-track--edge-end' : '',
                          atLineEnd ? 'tomato-on-track--landing' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ left: `${tomatoPos.x}%` }}
                      >
                        <Tomato mood={tomatoMood} size={44} />
                      </div>
                    )}
                  </div>

                  <div
                    className={[
                      'track-line',
                      rowState === 'break' ? 'track-line--break' : '',
                      rowState === 'done' ? 'track-line--done' : '',
                      atLineEnd && showTomato ? 'track-line--finishing' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div
                      className={[
                        'track-progress',
                        rowState === 'break' ? 'track-progress--break' : '',
                        rowState === 'done' ? 'track-progress--done' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {rowState === 'done' && (
                    <div
                      className="session-track-mini-tomato"
                      aria-label={t('session.complete', { n: i + 1 })}
                    >
                      <Tomato mood="happy" size={30} />
                    </div>
                  )}
                </div>

                {showWorkMarkers ? (
                  <span className="track-marker track-marker--end">{workMin}</span>
                ) : showBreakMarkers ? (
                  <span className="track-marker track-marker--end track-marker--break">
                    {breakMin}
                  </span>
                ) : (
                  <span className="track-marker track-marker--ghost" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
