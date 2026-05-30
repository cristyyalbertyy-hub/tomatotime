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

export async function unlockAudio() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') await ctx.resume()
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
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

/** Break starts — soft low note */
export async function playBreakStart() {
  if (!(await ready())) return
  const t = getCtx().currentTime
  playTone(392, t, 0.28, 0.22)
}

/** Break ends — back to work chirp */
export async function playBackToWork() {
  if (!(await ready())) return
  const t = getCtx().currentTime
  playTone(523, t, 0.12, 0.26)
  playTone(784, t + 0.14, 0.18, 0.28)
}

/** Full 2h journey complete */
export async function playJourneyComplete() {
  if (!(await ready())) return
  const t = getCtx().currentTime
  const notes = [523, 659, 784, 1046, 1318]
  notes.forEach((freq, i) => {
    playTone(freq, t + i * 0.18, 0.22, 0.3)
  })
}
