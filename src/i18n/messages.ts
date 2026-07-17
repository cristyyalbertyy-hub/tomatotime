export type Locale = 'en' | 'pt' | 'fr' | 'es' | 'it'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'pt', 'fr', 'es', 'it']

export const LOCALE_EVENT = 'tomato-locale-update'
const LOCALE_KEY = 'tomato-time-locale'

const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  pt: 'pt',
  fr: 'fr',
  es: 'es',
  it: 'it',
}

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function getHtmlLang(locale: Locale): string {
  return HTML_LANG[locale]
}

export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY)
    if (stored && isLocale(stored)) return stored
  } catch {
    /* ignore */
  }
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('pt')) return 'pt'
  if (lang.startsWith('fr')) return 'fr'
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('it')) return 'it'
  return 'en'
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
  document.documentElement.lang = getHtmlLang(locale)
  window.dispatchEvent(new Event(LOCALE_EVENT))
}

export function journeyPluralSuffix(locale: Locale, count: number): string {
  if (count === 1) return ''
  if (locale === 'it') return 'i'
  return 's'
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
  'menu.more': 'More options',
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
  'settings.langFr': 'Français',
  'settings.langEs': 'Español',
  'settings.langIt': 'Italiano',
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
  'menu.more': 'Mais opções',
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
  'settings.langFr': 'Français',
  'settings.langEs': 'Español',
  'settings.langIt': 'Italiano',
  'settings.journeyDesc':
    '{sessions} × {work} min foco + {break} min pausas — cerca de {hours} de estudo profundo.',
  'settings.totalJourney': 'Jornada total ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} horas',
  'hours.oneDecimal': '{n} horas',
  'hours.minutes': '{n} min',
}

const fr: Record<keyof typeof en, string> = {
  'phase.focusSession': 'Concentration · Session {current} sur {total}',
  'phase.breakSession': 'Pause · Session {current} sur {total}',
  'phase.readyJourney': 'Prêt pour un parcours de {hours}',
  'phase.journeyComplete': 'Parcours terminé !',
  'journey.label': 'Parcours',
  'journey.todayTomatoes': '{count} aujourd’hui',
  'journey.cycles': 'cycles de {hours}',
  'journey.aria': '{count} parcours terminés',
  'journey.overlayTitle': 'Parcours terminé !',
  'journey.overlaySub': 'Cycle de {hours} terminé · {count} parcours au total',
  'journey.overlayCta': 'Ouvrir Studio9 · Medical Science',
  'timer.ofMin': 'session de {min} min',
  'timer.remaining': 'restant',
  'timer.aria': '{phase}, {time} restant',
  'timer.phase.focus': 'Concentration',
  'timer.phase.break': 'Pause',
  'timer.phase.ready': 'Prêt',
  'session.break': 'Pause',
  'session.aria': 'Quatre pistes de session',
  'session.complete': 'Session {n} terminée',
  'controls.sound': 'Son',
  'controls.soundOn': 'Son activé',
  'controls.soundOff': 'Son désactivé',
  'controls.settings': 'Réglages',
  'controls.harvest': 'Récolte',
  'controls.go': 'Go',
  'controls.pause': 'Pause',
  'controls.reset': 'Réinitialiser',
  'controls.resetConfirm': 'Réinitialiser ce parcours ?',
  'controls.yesReset': 'Oui, réinitialiser',
  'controls.cancel': 'Annuler',
  'controls.keyboardHint': 'démarrer / pause',
  'menu.more': 'Plus d’options',
  'settings.title': 'Réglages',
  'settings.tagline': 'Ajustez votre parcours et l’apparence',
  'settings.close': 'Fermer',
  'settings.locked': 'Terminez ou réinitialisez le parcours en cours avant de modifier les durées.',
  'settings.focusSession': 'Session de concentration',
  'settings.break': 'Pause',
  'settings.theme': 'Thème',
  'settings.language': 'Langue',
  'settings.themeLight': 'Clair',
  'settings.themeDark': 'Sombre',
  'settings.themeSystem': 'Système',
  'settings.langEn': 'English',
  'settings.langPt': 'Português',
  'settings.langFr': 'Français',
  'settings.langEs': 'Español',
  'settings.langIt': 'Italiano',
  'settings.journeyDesc':
    '{sessions} × {work} min concentration + {break} min pauses — environ {hours} d’étude profonde.',
  'settings.totalJourney': 'Parcours total ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} heures',
  'hours.oneDecimal': '{n} heures',
  'hours.minutes': '{n} min',
}

const es: Record<keyof typeof en, string> = {
  'phase.focusSession': 'Enfoque · Sesión {current} de {total}',
  'phase.breakSession': 'Descanso · Sesión {current} de {total}',
  'phase.readyJourney': 'Listo para un recorrido de {hours}',
  'phase.journeyComplete': '¡Recorrido completado!',
  'journey.label': 'Recorridos',
  'journey.todayTomatoes': '{count} hoy',
  'journey.cycles': 'ciclos de {hours}',
  'journey.aria': '{count} recorridos completados',
  'journey.overlayTitle': '¡Recorrido completado!',
  'journey.overlaySub': 'Ciclo de {hours} hecho · {count} recorrido{plural} en total',
  'journey.overlayCta': 'Abrir Studio9 · Medical Science',
  'timer.ofMin': 'sesión de {min} min',
  'timer.remaining': 'restante',
  'timer.aria': '{phase}, {time} restante',
  'timer.phase.focus': 'Enfoque',
  'timer.phase.break': 'Descanso',
  'timer.phase.ready': 'Listo',
  'session.break': 'Descanso',
  'session.aria': 'Cuatro pistas de sesión',
  'session.complete': 'Sesión {n} completada',
  'controls.sound': 'Sonido',
  'controls.soundOn': 'Sonido activado',
  'controls.soundOff': 'Sonido desactivado',
  'controls.settings': 'Ajustes',
  'controls.harvest': 'Cosecha',
  'controls.go': 'Iniciar',
  'controls.pause': 'Pausar',
  'controls.reset': 'Reiniciar',
  'controls.resetConfirm': '¿Reiniciar este recorrido?',
  'controls.yesReset': 'Sí, reiniciar',
  'controls.cancel': 'Cancelar',
  'controls.keyboardHint': 'iniciar / pausar',
  'menu.more': 'Más opciones',
  'settings.title': 'Ajustes',
  'settings.tagline': 'Ajusta tu recorrido y la apariencia',
  'settings.close': 'Cerrar',
  'settings.locked': 'Termina o reinicia el recorrido actual antes de cambiar los tiempos.',
  'settings.focusSession': 'Sesión de enfoque',
  'settings.break': 'Descanso',
  'settings.theme': 'Tema',
  'settings.language': 'Idioma',
  'settings.themeLight': 'Claro',
  'settings.themeDark': 'Oscuro',
  'settings.themeSystem': 'Sistema',
  'settings.langEn': 'English',
  'settings.langPt': 'Português',
  'settings.langFr': 'Français',
  'settings.langEs': 'Español',
  'settings.langIt': 'Italiano',
  'settings.journeyDesc':
    '{sessions} × {work} min enfoque + {break} min descansos — unas {hours} de estudio profundo.',
  'settings.totalJourney': 'Recorrido total ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} horas',
  'hours.oneDecimal': '{n} horas',
  'hours.minutes': '{n} min',
}

const it: Record<keyof typeof en, string> = {
  'phase.focusSession': 'Focus · Sessione {current} di {total}',
  'phase.breakSession': 'Pausa · Sessione {current} di {total}',
  'phase.readyJourney': 'Pronto per un percorso di {hours}',
  'phase.journeyComplete': 'Percorso completato!',
  'journey.label': 'Percorsi',
  'journey.todayTomatoes': '{count} oggi',
  'journey.cycles': 'cicli di {hours}',
  'journey.aria': '{count} percorsi completati',
  'journey.overlayTitle': 'Percorso completato!',
  'journey.overlaySub': 'Ciclo di {hours} completato · {count} percorso{plural} in totale',
  'journey.overlayCta': 'Apri Studio9 · Medical Science',
  'timer.ofMin': 'sessione di {min} min',
  'timer.remaining': 'rimanente',
  'timer.aria': '{phase}, {time} rimanente',
  'timer.phase.focus': 'Focus',
  'timer.phase.break': 'Pausa',
  'timer.phase.ready': 'Pronto',
  'session.break': 'Pausa',
  'session.aria': 'Quattro binari di sessione',
  'session.complete': 'Sessione {n} completata',
  'controls.sound': 'Audio',
  'controls.soundOn': 'Audio attivo',
  'controls.soundOff': 'Audio disattivato',
  'controls.settings': 'Impostazioni',
  'controls.harvest': 'Raccolta',
  'controls.go': 'Inizia',
  'controls.pause': 'Pausa',
  'controls.reset': 'Reimposta',
  'controls.resetConfirm': 'Reimpostare questo percorso?',
  'controls.yesReset': 'Sì, reimposta',
  'controls.cancel': 'Annulla',
  'controls.keyboardHint': 'avvia / pausa',
  'menu.more': 'Altre opzioni',
  'settings.title': 'Impostazioni',
  'settings.tagline': 'Regola il percorso e l’aspetto',
  'settings.close': 'Chiudi',
  'settings.locked': 'Termina o reimposta il percorso attuale prima di modificare i tempi.',
  'settings.focusSession': 'Sessione di focus',
  'settings.break': 'Pausa',
  'settings.theme': 'Tema',
  'settings.language': 'Lingua',
  'settings.themeLight': 'Chiaro',
  'settings.themeDark': 'Scuro',
  'settings.themeSystem': 'Sistema',
  'settings.langEn': 'English',
  'settings.langPt': 'Português',
  'settings.langFr': 'Français',
  'settings.langEs': 'Español',
  'settings.langIt': 'Italiano',
  'settings.journeyDesc':
    '{sessions} × {work} min focus + {break} min pause — circa {hours} di studio profondo.',
  'settings.totalJourney': 'Percorso totale ≈ {hours}',
  'settings.min': '{n} min',
  'hours.plural': '{n} ore',
  'hours.oneDecimal': '{n} ore',
  'hours.minutes': '{n} min',
}

export type MessageKey = keyof typeof en

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, pt, fr, es, it }

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
  if (hours >= 1.95) return t(locale, 'hours.plural', { n: Math.round(hours) })
  if (hours >= 1) {
    return t(locale, 'hours.oneDecimal', {
      n: hours.toFixed(1).replace(/\.0$/, ''),
    })
  }
  return t(locale, 'hours.minutes', { n: cycleMin })
}
