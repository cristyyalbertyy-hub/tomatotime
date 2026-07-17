export type Locale = 'en' | 'pt'

export const LOCALE_EVENT = 'tomato-locale-update'
const LOCALE_KEY = 'tomato-time-locale'

export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY)
    if (stored === 'pt' || stored === 'en') return stored
  } catch {
    /* ignore */
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function getLocale(): Locale {
  return detectLocale()
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = locale === 'pt' ? 'pt' : 'en'
  window.dispatchEvent(new Event(LOCALE_EVENT))
}

const en = {
  'phase.focusSession': 'Focus · Session {current} of {total}',
  'phase.breakSession': 'Break · Session {current} of {total}',
  'phase.readyJourney': 'Ready for a {hours} journey',
  'phase.journeyComplete': 'Journey complete!',
  'journey.label': 'Journeys',
  'journey.todayTomatoes': '{count} today',
  'journey.cycles': '{hours} cycles',
  'journey.aria': '{count} completed journeys',
  'journey.overlayTitle': 'Journey Complete!',
  'journey.overlaySub': '{hours} cycle done · {count} journey{plural} total',
  'journey.overlayCta': 'Open Studio9 · Medical Science',
  'timer.ofMin': '{min} min session',
  'timer.remaining': 'remaining',
  'timer.aria': '{phase}, {time} remaining',
  'timer.phase.focus': 'Focus',
  'timer.phase.break': 'Break',
  'timer.phase.ready': 'Ready',
  'session.break': 'Break',
  'session.aria': 'Four session tracks',
  'session.complete': 'Session {n} complete',
  'controls.sound': 'Sound',
  'controls.soundOn': 'Sound on',
  'controls.soundOff': 'Sound off',
  'controls.settings': 'Settings',
  'controls.harvest': 'Harvest',
  'controls.go': 'Go',
  'controls.pause': 'Pause',
  'controls.reset': 'Reset',
  'controls.resetConfirm': 'Reset this journey?',
  'controls.yesReset': 'Yes, reset',
  'controls.cancel': 'Cancel',
  'controls.keyboardHint': 'start / pause',
  'settings.title': 'Settings',
  'settings.tagline': 'Tune your journey & appearance',
  'settings.close': 'Close',
  'settings.locked': 'Finish or reset the current journey before changing times.',
  'settings.focusSession': 'Focus session',
  'settings.break': 'Break',
  'settings.theme': 'Theme',
  'settings.language': 'Language',
  'settings.themeLight': 'Light',
  'settings.themeDark': 'Dark',
  'settings.themeSystem': 'System',
  'settings.langEn': 'English',
  'settings.langPt': 'Português',
  'settings.journeyDesc':
    '{sessions} × {work} min focus + {break} min breaks — about {hours} of deep study.',
  'settings.totalJourney': 'Total journey ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} hours',
  'hours.oneDecimal': '{n} hours',
  'hours.minutes': '{n} min',
} as const

const pt: Record<keyof typeof en, string> = {
  'phase.focusSession': 'Foco · Sessão {current} de {total}',
  'phase.breakSession': 'Pausa · Sessão {current} de {total}',
  'phase.readyJourney': 'Pronto para uma jornada de {hours}',
  'phase.journeyComplete': 'Jornada concluída!',
  'journey.label': 'Jornadas',
  'journey.todayTomatoes': '{count} hoje',
  'journey.cycles': 'ciclos de {hours}',
  'journey.aria': '{count} jornadas concluídas',
  'journey.overlayTitle': 'Jornada concluída!',
  'journey.overlaySub': 'Ciclo de {hours} feito · {count} jornada{plural} no total',
  'journey.overlayCta': 'Abrir Studio9 · Medical Science',
  'timer.ofMin': 'sessão de {min} min',
  'timer.remaining': 'restante',
  'timer.aria': '{phase}, {time} restante',
  'timer.phase.focus': 'Foco',
  'timer.phase.break': 'Pausa',
  'timer.phase.ready': 'Pronto',
  'session.break': 'Pausa',
  'session.aria': 'Quatro trilhos de sessão',
  'session.complete': 'Sessão {n} concluída',
  'controls.sound': 'Som',
  'controls.soundOn': 'Som ligado',
  'controls.soundOff': 'Som desligado',
  'controls.settings': 'Definições',
  'controls.harvest': 'Colheita',
  'controls.go': 'Ir',
  'controls.pause': 'Pausar',
  'controls.reset': 'Repor',
  'controls.resetConfirm': 'Repor esta jornada?',
  'controls.yesReset': 'Sim, repor',
  'controls.cancel': 'Cancelar',
  'controls.keyboardHint': 'iniciar / pausar',
  'settings.title': 'Definições',
  'settings.tagline': 'Ajusta a jornada e o aspeto',
  'settings.close': 'Fechar',
  'settings.locked': 'Termina ou repõe a jornada atual antes de alterar os tempos.',
  'settings.focusSession': 'Sessão de foco',
  'settings.break': 'Pausa',
  'settings.theme': 'Tema',
  'settings.language': 'Idioma',
  'settings.themeLight': 'Claro',
  'settings.themeDark': 'Escuro',
  'settings.themeSystem': 'Sistema',
  'settings.langEn': 'English',
  'settings.langPt': 'Português',
  'settings.journeyDesc':
    '{sessions} × {work} min foco + {break} min pausas — cerca de {hours} de estudo profundo.',
  'settings.totalJourney': 'Jornada total ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} horas',
  'hours.oneDecimal': '{n} horas',
  'hours.minutes': '{n} min',
}

export type MessageKey = keyof typeof en

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, pt }

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let text = catalogs[locale][key] ?? catalogs.en[key]
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v))
    }
  }
  return text
}

export function formatCycleHoursLocalized(locale: Locale, cycleMin: number): string {
  const hours = cycleMin / 60
  if (locale === 'pt') {
    if (hours >= 1.95) return t(locale, 'hours.plural', { n: Math.round(hours) })
    if (hours >= 1) {
      return t(locale, 'hours.oneDecimal', {
        n: hours.toFixed(1).replace(/\.0$/, ''),
      })
    }
    return t(locale, 'hours.minutes', { n: cycleMin })
  }
  if (hours >= 1.95) return t(locale, 'hours.plural', { n: Math.round(hours) })
  if (hours >= 1) {
    return t(locale, 'hours.oneDecimal', { n: hours.toFixed(1).replace(/\.0$/, '') })
  }
  return t(locale, 'hours.minutes', { n: cycleMin })
}
