const SOUND_KEY = 'tomato-time-sound'

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

/** Layered chord pulse — root weighted for warmth, upper partials for clarity */
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

/**
 * Work session ends — "Tomato Bloom": triple harmonic wake cue.
 * F-major bloom in three pulses — nudge → open → lift.
 */
export async function playBreakStart() {
  if (!(await ready())) return
  const t = getCtx().currentTime
  const gap = 0.46

  // Pulse 1 — low fifth + body: gentle nudge out of drowsiness
  playHarmonicPulse([174.61, 261.63, 349.23], t, 0.5, 0.34)

  // Pulse 2 — F major spread: sit up, eyes open
  playHarmonicPulse([349.23, 440, 523.25, 659.25], t + gap, 0.54, 0.36)

  // Pulse 3 — rising major sixth shimmer: fully awake
  playHarmonicPulse([523.25, 659.25, 783.99], t + gap * 2, 0.48, 0.3)
  playRisingTone(880, 1174.66, t + gap * 2 + 0.04, 0.62, 0.28, 'triangle')
}

/** Break ends — back to work: brisk double chirp in the same key */
export async function playBackToWork() {
  if (!(await ready())) return
  const t = getCtx().currentTime

  playHarmonicPulse([392, 523.25, 659.25], t, 0.28, 0.3)
  playHarmonicPulse([523.25, 659.25, 783.99], t + 0.22, 0.32, 0.34)
}

/** Full 2h journey complete — celebratory five-note bloom */
export async function playJourneyComplete() {
  if (!(await ready())) return
  const t = getCtx().currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((freq, i) => {
    playTone(freq, t + i * 0.18, 0.28, 0.32, i % 2 === 0 ? 'triangle' : 'sine')
  })
}
