import { useState } from 'react'
import type { TimerStatus } from '../types'

interface ControlsProps {
  status: TimerStatus
  soundOn: boolean
  inCycle: boolean
  celebrating: boolean
  todayTomatoes: number
  onGo: () => void
  onPause: () => void
  onReset: () => void
  onToggleSound: () => void
  onOpenHarvest: () => void
  onOpenSettings: () => void
}

export function Controls({
  status,
  soundOn,
  inCycle,
  celebrating,
  todayTomatoes,
  onGo,
  onPause,
  onReset,
  onToggleSound,
  onOpenHarvest,
  onOpenSettings,
}: ControlsProps) {
  const [confirmReset, setConfirmReset] = useState(false)

  const showReset = (inCycle || celebrating) && !confirmReset

  const handleConfirmReset = () => {
    onReset()
    setConfirmReset(false)
  }

  return (
    <div className="controls-bar">
      <div className="controls-top-row">
        <button
          type="button"
          className={`btn-sound ${soundOn ? 'btn-sound--on' : ''}`}
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Sound on' : 'Sound off'}
        >
          {soundOn ? '🔊' : '🔇'}
          <span className="btn-sound-label">Sound</span>
        </button>

        <button
          type="button"
          className="btn-settings"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          ⚙
          <span className="btn-settings-label">Settings</span>
        </button>

        <button
          type="button"
          className="btn-harvest"
          onClick={onOpenHarvest}
          aria-label="Open harvest stats"
        >
          <span className="btn-harvest-icon">🍅</span>
          <span className="btn-harvest-label">Harvest</span>
          {todayTomatoes > 0 && (
            <span className="btn-harvest-badge">{todayTomatoes}</span>
          )}
        </button>
      </div>

      {confirmReset ? (
        <div
          className="reset-confirm"
          role="alertdialog"
          aria-label="Reset journey"
        >
          <p className="reset-confirm-text">Reset this journey?</p>
          <div className="reset-confirm-actions">
            <button
              type="button"
              className="btn btn--reset-yes"
              onClick={handleConfirmReset}
            >
              Yes, reset
            </button>
            <button
              type="button"
              className="btn btn--reset-no"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="controls">
          <button
            type="button"
            className="btn btn--go"
            onClick={onGo}
            disabled={status === 'running' || celebrating}
          >
            Go
          </button>
          <button
            type="button"
            className="btn btn--pause"
            onClick={onPause}
            disabled={status !== 'running'}
          >
            Pause
          </button>
          {showReset && (
            <button
              type="button"
              className="btn btn--reset"
              onClick={() => setConfirmReset(true)}
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  )
}
