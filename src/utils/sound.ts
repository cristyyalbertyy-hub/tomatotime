import type { PhaseTransition } from './timerStorage'

const SOUND_KEY = 'tomato-time-sound'
const SOUND_PRESET_KEY = 'tomato-time-sound-preset'

export type SoundPreset = 'bloom' | 'chirp' | 'bell'
export const SOUND_PRESET_EVENT = 'tomato-sound-preset-update'

let audioCtx: AudioContext | null = null

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'false'
  } catch {
    return true
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, String(on))
  } catch {
    /* ignore */
  }
}

export function getSoundPreset(): SoundPreset {
  try {
    const raw = localStorage.getItem(SOUND_PRESET_KEY)
    if (raw === 'bloom' || raw === 'chirp' || raw === 'bell') return raw
  } catch {
    /* ignore */
  }
  return 'bloom'
}

export function setSoundPreset(preset: SoundPreset) {
  try {
    localStorage.setItem(SOUND_PRESET_KEY, preset)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SOUND_PRESET_EVENT))
}

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export async function unlockAudio(): Promise<boolean> {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') await ctx.resume()
    return ctx.state === 'running'
  } catch {
    return false
  }
}

async function ready() {
  if (!isSoundEnabled()) return false
  await unlockAudio()
  return true
}

function playTone(
  freq: number,
  start: number,
  duration = 0.18,
  volume = 0.35,
  type: OscillatorType = 'sine',
) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.06)
}

function playRisingTone(
  freqFrom: number,
  freqTo: number,
  start: number,
  duration = 0.55,
  volume = 0.32,
  type: OscillatorType = 'sine',
) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freqFrom, start)
  osc.frequency.exponentialRampToValueAtTime(freqTo, start + duration * 0.42)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.06)
}

function playHarmonicPulse(
  freqs: number[],
  start: number,
  duration = 0.5,
  volume = 0.32,
) {
  freqs.forEach((freq, i) => {
    const weight = i === 0 ? 1 : 0.72 / Math.sqrt(i + 0.5)
    const wave: OscillatorType =
      i === 0 ? 'triangle' : i === freqs.length - 1 ? 'sine' : 'sine'
    playTone(freq, start, duration, volume * weight, wave)
  })
}

async function playBloomBreakStart() {
  const t = getCtx().currentTime
  const gap = 0.46
  playHarmonicPulse([174.61, 261.63, 349.23], t, 0.5, 0.34)
  playHarmonicPulse([349.23, 440, 523.25, 659.25], t + gap, 0.54, 0.36)
  playHarmonicPulse([523.25, 659.25, 783.99], t + gap * 2, 0.48, 0.3)
  playRisingTone(880, 1174.66, t + gap * 2 + 0.04, 0.62, 0.28, 'triangle')
}

async function playBloomBackToWork() {
  const t = getCtx().currentTime
  playHarmonicPulse([392, 523.25, 659.25], t, 0.28, 0.3)
  playHarmonicPulse([523.25, 659.25, 783.99], t + 0.22, 0.32, 0.34)
}

async function playBloomJourneyComplete() {
  const t = getCtx().currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((freq, i) => {
    playTone(freq, t + i * 0.18, 0.28, 0.32, i % 2 === 0 ? 'triangle' : 'sine')
  })
}

async function playChirpBreakStart() {
  const t = getCtx().currentTime
  playTone(880, t, 0.12, 0.28, 'triangle')
  playTone(1046.5, t + 0.14, 0.12, 0.3, 'triangle')
  playTone(1174.66, t + 0.28, 0.14, 0.32, 'sine')
}

async function playChirpBackToWork() {
  const t = getCtx().currentTime
  playTone(659.25, t, 0.1, 0.3, 'triangle')
  playTone(783.99, t + 0.12, 0.12, 0.32, 'triangle')
}

async function playChirpJourneyComplete() {
  const t = getCtx().currentTime
  ;[659.25, 783.99, 987.77, 1174.66].forEach((freq, i) => {
    playTone(freq, t + i * 0.1, 0.14, 0.3, 'triangle')
  })
}

async function playBellBreakStart() {
  const t = getCtx().currentTime
  playTone(392, t, 0.55, 0.26, 'sine')
  playTone(523.25, t + 0.35, 0.5, 0.22, 'sine')
}

async function playBellBackToWork() {
  const t = getCtx().currentTime
  playTone(440, t, 0.45, 0.24, 'sine')
  playTone(554.37, t + 0.22, 0.4, 0.22, 'sine')
}

async function playBellJourneyComplete() {
  const t = getCtx().currentTime
  playTone(523.25, t, 0.65, 0.24, 'sine')
  playTone(659.25, t + 0.28, 0.55, 0.22, 'sine')
  playTone(783.99, t + 0.52, 0.48, 0.2, 'sine')
}

export async function playBreakStart() {
  if (!(await ready())) return
  switch (getSoundPreset()) {
    case 'chirp':
      await playChirpBreakStart()
      break
    case 'bell':
      await playBellBreakStart()
      break
    default:
      await playBloomBreakStart()
  }
}

export async function playBackToWork() {
  if (!(await ready())) return
  switch (getSoundPreset()) {
    case 'chirp':
      await playChirpBackToWork()
      break
    case 'bell':
      await playBellBackToWork()
      break
    default:
      await playBloomBackToWork()
  }
}

export async function playJourneyComplete() {
  if (!(await ready())) return
  switch (getSoundPreset()) {
    case 'chirp':
      await playChirpJourneyComplete()
      break
    case 'bell':
      await playBellJourneyComplete()
      break
    default:
      await playBloomJourneyComplete()
  }
}

export async function playSoundPresetPreview(preset: SoundPreset) {
  if (!(await ready())) return
  switch (preset) {
    case 'chirp':
      await playChirpBreakStart()
      break
    case 'bell':
      await playBellBreakStart()
      break
    default:
      await playBloomBreakStart()
  }
}

export async function playPhaseTransition(transition: PhaseTransition) {
  if (!transition) return
  switch (transition) {
    case 'work-to-break':
      await playBreakStart()
      break
    case 'break-to-work':
      await playBackToWork()
      break
    case 'journey-complete':
      await playJourneyComplete()
      break
  }
}
