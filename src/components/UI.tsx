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
  resetConfirm: boolean
  onGo: () => void
  onPause: () => void
  onReset: () => void
  onDismissReset: () => void
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
  resetConfirm,
  onGo,
  onPause,
  onReset,
  onDismissReset,
  onToggleSound,
  onOpenHarvest,
  onOpenSettings,
}: ControlsProps) {
  const { t } = useLocale()
  const [localResetConfirm, setLocalResetConfirm] = useState(false)

  const focusMode = inCycle && !celebrating
  const confirmReset = resetConfirm || localResetConfirm
  const isRunning = status === 'running'
  const isPausedInCycle = focusMode && status === 'paused'

  const heroLabel = isRunning
    ? t('controls.pause')
    : isPausedInCycle
      ? t('controls.continue')
      : t('controls.go')

  const handleConfirmReset = () => {
    onReset()
    setLocalResetConfirm(false)
    onDismissReset()
  }

  const handleCancelReset = () => {
    setLocalResetConfirm(false)
    onDismissReset()
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
              onClick={handleCancelReset}
            >
              {t('controls.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="controls-primary controls-primary--hero">
            <button
              type="button"
              className={`btn btn--hero ${isRunning ? 'btn--pause' : 'btn--go'}`}
              onClick={isRunning ? onPause : onGo}
              disabled={celebrating}
            >
              {heroLabel}
            </button>

            {celebrating && (
              <button
                type="button"
                className="btn btn--reset btn--reset-inline"
                onClick={() => setLocalResetConfirm(true)}
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
