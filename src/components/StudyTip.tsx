import { useEffect, useState } from 'react'
import { STUDY_TIPS } from '../constants'

export function StudyTip() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * STUDY_TIPS.length))

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STUDY_TIPS.length)
    }, 12000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p className="study-tip" key={index}>
      <span className="study-tip-label">Tip</span>
      {STUDY_TIPS[index]}
    </p>
  )
}
