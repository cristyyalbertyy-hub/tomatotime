import { useCallback, useEffect, useState } from 'react'
import {
  detectLocale,
  getLocale,
  LOCALE_EVENT,
  setLocale as persistLocale,
  t as translate,
  type Locale,
  type MessageKey,
} from '../i18n/messages'

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt' : 'en'
  }, [locale])

  useEffect(() => {
    const refresh = () => setLocaleState(getLocale())
    window.addEventListener(LOCALE_EVENT, refresh)
    return () => window.removeEventListener(LOCALE_EVENT, refresh)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next)
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  )

  return { locale, setLocale, t, detectLocale }
}
