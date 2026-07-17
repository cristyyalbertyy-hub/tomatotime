export type TomatoColorPreset = 'classic' | 'cherry' | 'golden'

const TOMATO_COLOR_KEY = 'tomato-time-tomato-color'
export const TOMATO_COLOR_EVENT = 'tomato-color-update'

const PALETTES: Record<
  TomatoColorPreset,
  { body: string; deep: string; light: string; blush: string }
> = {
  classic: {
    body: '#f5a623',
    deep: '#e8890c',
    light: '#ffd56a',
    blush: '#ffb74d',
  },
  cherry: {
    body: '#ef5350',
    deep: '#c62828',
    light: '#ff8a80',
    blush: '#e57373',
  },
  golden: {
    body: '#ffc947',
    deep: '#f5a623',
    light: '#ffe082',
    blush: '#ffcc80',
  },
}

export function getTomatoColorPreset(): TomatoColorPreset {
  try {
    const raw = localStorage.getItem(TOMATO_COLOR_KEY)
    if (raw === 'classic' || raw === 'cherry' || raw === 'golden') return raw
  } catch {
    /* ignore */
  }
  return 'classic'
}

export function setTomatoColorPreset(preset: TomatoColorPreset) {
  try {
    localStorage.setItem(TOMATO_COLOR_KEY, preset)
  } catch {
    /* ignore */
  }
  applyTomatoColor(preset)
  window.dispatchEvent(new Event(TOMATO_COLOR_EVENT))
}

export function applyTomatoColor(preset = getTomatoColorPreset()) {
  if (typeof document === 'undefined') return
  const palette = PALETTES[preset]
  const root = document.documentElement
  root.style.setProperty('--tomato-body', palette.body)
  root.style.setProperty('--tomato-deep', palette.deep)
  root.style.setProperty('--tomato-light', palette.light)
  root.style.setProperty('--tomato-blush', palette.blush)
}

export function initTomatoColor() {
  applyTomatoColor()
}

export function getTomatoSwatchColor(preset: TomatoColorPreset): string {
  return PALETTES[preset].body
}
