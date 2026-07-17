import { useEffect, useId, useRef, useState } from 'react'
import { useLocale } from '../hooks/useLocale'
import { IconHarvest, IconMore, IconSettings, IconSound, IconSoundOff } from './Icons'

interface FocusMenuProps {
  soundOn: boolean
  todayTomatoes: number
  onToggleSound: () => void
  onOpenSettings: () => void
  onOpenHarvest: () => void
}

export function FocusMenu({
  soundOn,
  todayTomatoes,
  onToggleSound,
  onOpenSettings,
  onOpenHarvest,
}: FocusMenuProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeAnd = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <div className="focus-menu" ref={rootRef}>
      <button
        type="button"
        className={`focus-menu-trigger ${open ? 'focus-menu-trigger--open' : ''}`}
        aria-label={t('menu.more')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <IconMore size={18} />
      </button>

      {open && (
        <div className="focus-menu-panel" id={menuId} role="menu">
          <button
            type="button"
            className="focus-menu-item"
            role="menuitem"
            onClick={() => closeAnd(onToggleSound)}
          >
            {soundOn ? <IconSound size={18} /> : <IconSoundOff size={18} />}
            <span>{soundOn ? t('controls.soundOn') : t('controls.soundOff')}</span>
          </button>

          <button
            type="button"
            className="focus-menu-item"
            role="menuitem"
            onClick={() => closeAnd(onOpenSettings)}
          >
            <IconSettings size={18} />
            <span>{t('controls.settings')}</span>
          </button>

          <button
            type="button"
            className="focus-menu-item focus-menu-item--harvest"
            role="menuitem"
            onClick={() => closeAnd(onOpenHarvest)}
          >
            <IconHarvest size={18} />
            <span>{t('controls.harvest')}</span>
            {todayTomatoes > 0 && (
              <span className="focus-menu-badge">{todayTomatoes}</span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
