import { useEffect, useState } from 'react'
import { getStudyTips } from '../i18n/studyTips'
import { useLocale } from '../hooks/useLocale'

export function StudyTip() {
  const { locale, t } = useLocale()
  const tips = getStudyTips(locale)
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tips.length))

  useEffect(() => {
    setIndex(Math.floor(Math.random() * tips.length))
  }, [locale, tips.length])

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % tips.length)
    }, 12000)
    return () => window.clearInterval(id)
  }, [tips.length])

  return (
    <p className="study-tip" key={`${locale}-${index}`}>
      <span className="study-tip-label">{t('studyTip.label')}</span>
      {tips[index]}
    </p>
  )
}
