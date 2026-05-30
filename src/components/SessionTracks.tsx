import type { Phase } from '../constants'
import type { TomatoPosition } from '../types'
import { SESSIONS_PER_CYCLE } from '../constants'
import { Tomato, type TomatoMood } from './Tomato'

const SESSION_LABELS = ['I', 'II', 'III', 'IV']

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
  if (phase === 'break' && i === sessionIndex) return 100
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
  return (
    <div className="session-tracks" aria-label="Four session tracks">
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
        const showTomato =
          tomatoVisible &&
          !celebrating &&
          ((phase === 'work' && i === sessionIndex) ||
            (phase === 'break' && i === sessionIndex))

        const showMarkers = rowState === 'active' || rowState === 'ready'

        return (
          <div
            key={i}
            className={[
              'session-track',
              `session-track--${rowState}`,
            ].join(' ')}
          >
            <span className="session-track-label">{SESSION_LABELS[i]}</span>

            <div className="session-track-body">
              {rowState === 'break' && (
                <span className="session-track-break-tag">Break</span>
              )}

              <div className="track-wrap">
                {showMarkers ? (
                  <span className="track-marker track-marker--start">1</span>
                ) : (
                  <span className="track-marker track-marker--ghost" />
                )}

                <div className="track-rail">
                  <div
                    className={[
                      'track-line',
                      rowState === 'break' ? 'track-line--break' : '',
                      rowState === 'done' ? 'track-line--done' : '',
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

                  {showTomato && (
                    <div
                      className={[
                        'tomato-on-track',
                        `tomato-on-track--${tomatoMood}`,
                        rowState === 'break'
                          ? 'tomato-on-track--on-break-row'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={
                        rowState === 'break'
                          ? undefined
                          : { left: `${tomatoPos.x}%` }
                      }
                    >
                      <Tomato mood={tomatoMood} size={44} />
                    </div>
                  )}

                  {rowState === 'done' && (
                    <div
                      className="session-track-mini-tomato"
                      aria-label={`Session ${i + 1} complete`}
                    >
                      <Tomato mood="happy" size={30} />
                    </div>
                  )}
                </div>

                {showMarkers ? (
                  <span className="track-marker track-marker--end">25</span>
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
