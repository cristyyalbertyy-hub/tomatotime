import { useMemo } from 'react'

const COLORS = ['#3aadab', '#f5a623', '#e8890c', '#ffd56a', '#1f4e6b', '#4ecdc4']

function pickColor(i: number) {
  return COLORS[i % COLORS.length]
}

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i % 12) * 0.08}s`,
        duration: `${1.8 + (i % 5) * 0.35}s`,
        size: 6 + (i % 4) * 2,
        color: pickColor(i),
        rotate: `${(i * 47) % 360}deg`,
      })),
    [],
  )

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            width: piece.size,
            height: piece.size * 0.55,
            background: piece.color,
            transform: `rotate(${piece.rotate})`,
          }}
        />
      ))}
    </div>
  )
}
