import { useState } from 'react'
import type { TimerStatus } from '../types'
import { useLocale } from '../hooks/useLocale'
import { IconHarvest, IconSettings, IconSound, IconSoundOff } from './Icons'

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
  const { t } = useLocale()
  const [confirmReset, setConfirmReset] = useState(false)

  const focusMode = inCycle && !celebrating
  const showReset = (inCycle || celebrating) && !confirmReset

  const handleConfirmReset = () => {
    onReset()
    setConfirmReset(false)
  }

  return (
    <div className={`controls-bar ${focusMode ? 'controls-bar--focus' : ''}`}>
      {confirmReset ? (
        <div
          className="reset-confirm"
          role="alertdialog"
          aria-label={t('controls.reset')}
        >
          <p className="reset-confirm-text">{t('controls.resetConfirm')}</p>
          <div className="reset-confirm-actions">
            <button
              type="button"
              className="btn btn--reset-yes"
              onClick={handleConfirmReset}
            >
              {t('controls.yesReset')}
            </button>
            <button
              type="button"
              className="btn btn--reset-no"
              onClick={() => setConfirmReset(false)}
            >
              {t('controls.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="controls-primary">
            <button
              type="button"
              className="btn btn--go"
              onClick={onGo}
              disabled={status === 'running' || celebrating}
            >
              {t('controls.go')}
            </button>
            <button
              type="button"
              className="btn btn--pause"
              onClick={onPause}
              disabled={status !== 'running'}
            >
              {t('controls.pause')}
            </button>
            {showReset && (
              <button
                type="button"
                className="btn btn--reset"
                onClick={() => setConfirmReset(true)}
              >
                {t('controls.reset')}
              </button>
            )}
          </div>

          {!focusMode && (
            <div className="controls-utilities">
              <button
                type="button"
                className={`btn-icon btn-icon--sound ${soundOn ? 'btn-icon--on' : ''}`}
                onClick={onToggleSound}
                aria-pressed={soundOn}
                aria-label={soundOn ? t('controls.soundOn') : t('controls.soundOff')}
              >
                {soundOn ? <IconSound /> : <IconSoundOff />}
                <span className="btn-icon-label">{t('controls.sound')}</span>
              </button>

              <button
                type="button"
                className="btn-icon btn-icon--settings"
                onClick={onOpenSettings}
                aria-label={t('controls.settings')}
              >
                <IconSettings />
                <span className="btn-icon-label">{t('controls.settings')}</span>
              </button>

              <button
                type="button"
                className="btn-icon btn-icon--harvest"
                onClick={onOpenHarvest}
                aria-label={t('controls.harvest')}
              >
                <IconHarvest />
                <span className="btn-icon-label">{t('controls.harvest')}</span>
                {todayTomatoes > 0 && (
                  <span className="btn-icon-badge">{todayTomatoes}</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
