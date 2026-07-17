export type TomatoMood =
  | 'happy'
  | 'focused'
  | 'break'
  | 'tired'
  | 'paused'
  | 'celebrate'

interface TomatoProps {
  mood?: TomatoMood
  size?: number
}

const ORANGE_LIGHT = 'var(--tomato-light, #ffd56a)'
const TEAL = '#3aadab'
const TEAL_LIGHT = '#5ec4c2'
const INK = '#3d4f5f'

export function Tomato({ mood = 'happy', size = 48 }: TomatoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`tomato-svg tomato-svg--${mood}`}
    >
      {/* Stem */}
      <rect x="30" y="10" width="4" height="7" rx="2" fill={TEAL} />
      {/* Leaves — Studio 9 teal */}
      <path
        d="M32 12 C26 4 14 8 18 16 C22 14 28 14 32 12Z"
        fill={TEAL}
      />
      <path
        d="M32 12 C38 4 50 8 46 16 C42 14 36 14 32 12Z"
        fill={TEAL_LIGHT}
      />

      {/* Body — round & chubby */}
      <ellipse cx="32" cy="38" rx="24" ry="22" fill="var(--tomato-deep, #e8890c)" />
      <ellipse cx="32" cy="36" rx="22" ry="20" fill="var(--tomato-body, #f5a623)" />
      <ellipse
        cx="24"
        cy="30"
        rx="8"
        ry="6"
        fill="var(--tomato-light, #ffd56a)"
        opacity="0.45"
      />

      {/* Cheeks */}
      <ellipse cx="16" cy="40" rx="5" ry="3.5" fill="var(--tomato-blush, #ffb74d)" opacity="0.55" />
      <ellipse cx="48" cy="40" rx="5" ry="3.5" fill="var(--tomato-blush, #ffb74d)" opacity="0.55" />

      <Face mood={mood} />
    </svg>
  )
}

function Face({ mood }: { mood: TomatoMood }) {
  switch (mood) {
    case 'focused':
      return (
        <>
          <path
            d="M20 30 Q22 27 24 30"
            fill="none"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M40 30 Q42 27 44 30"
            fill="none"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="22" cy="33" rx="3.2" ry="3.8" fill={INK} />
          <ellipse cx="42" cy="33" rx="3.2" ry="3.8" fill={INK} />
          <circle cx="23" cy="31.5" r="1.1" fill="white" />
          <circle cx="43" cy="31.5" r="1.1" fill="white" />
          <path
            d="M26 44 L38 44"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )

    case 'break':
      return (
        <>
          <path
            d="M18 34 Q22 30 26 34"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M38 34 Q42 30 46 34"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M22 46 Q32 54 42 46"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </>
      )

    case 'tired':
      return (
        <>
          <path
            d="M17 31 L27 33"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M37 33 L47 31"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse cx="22" cy="36" rx="2.8" ry="2" fill={INK} opacity="0.7" />
          <ellipse cx="42" cy="36" rx="2.8" ry="2" fill={INK} opacity="0.7" />
          <path
            d="M24 47 Q32 44 40 47"
            fill="none"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <text
            x="46"
            y="22"
            fontSize="9"
            fontWeight="700"
            fill={TEAL}
            opacity="0.8"
          >
            z
          </text>
        </>
      )

    case 'paused':
      return (
        <>
          <path
            d="M17 34 L27 34"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M37 34 L47 34"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <ellipse cx="32" cy="46" rx="4" ry="3.5" fill="none" stroke={INK} strokeWidth="1.8" />
        </>
      )

    case 'celebrate':
      return (
        <>
          <polygon
            points="22,28 23.5,32 27.5,32 24.5,34.5 25.5,38.5 22,36 18.5,38.5 19.5,34.5 16.5,32 20.5,32"
            fill={ORANGE_LIGHT}
            stroke={INK}
            strokeWidth="0.8"
          />
          <polygon
            points="42,28 43.5,32 47.5,32 44.5,34.5 45.5,38.5 42,36 38.5,38.5 39.5,34.5 36.5,32 40.5,32"
            fill={ORANGE_LIGHT}
            stroke={INK}
            strokeWidth="0.8"
          />
          <path
            d="M20 48 Q32 58 44 48"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="20" r="2" fill={TEAL_LIGHT} opacity="0.9" />
          <circle cx="52" cy="18" r="1.5" fill={TEAL} opacity="0.9" />
          <circle cx="48" cy="24" r="1.2" fill={ORANGE_LIGHT} />
        </>
      )

    case 'happy':
    default:
      return (
        <>
          <ellipse cx="22" cy="34" rx="3.5" ry="4" fill={INK} />
          <ellipse cx="42" cy="34" rx="3.5" ry="4" fill={INK} />
          <circle cx="23.2" cy="32.5" r="1.2" fill="white" />
          <circle cx="43.2" cy="32.5" r="1.2" fill="white" />
          <path
            d="M22 46 Q32 54 42 46"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )
  }
}

export function resolveTomatoMood(
  phase: 'work' | 'break' | 'idle',
  status: 'idle' | 'running' | 'paused',
  minute: number,
): TomatoMood {
  if (status === 'paused') return 'paused'
  if (phase === 'break') return 'break'
  if (phase === 'work') {
    if (minute >= 20) return 'tired'
    if (status === 'running') return 'focused'
  }
  return 'happy'
}
