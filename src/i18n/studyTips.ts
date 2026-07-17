import type { Locale } from './messages'

export const STUDY_TIPS: Record<Locale, readonly string[]> = {
  en: [
    'One journey = 4 focus sessions + short breaks — tune lengths in Settings.',
    'Put your phone face-down until the tomato reaches the end of the track.',
    'After each session, jot three bullet points while the memory is fresh.',
    'Use breaks to stand, stretch, and look away from the screen — not social media.',
    'Small daily journeys beat one long cramming block before the exam.',
    'Open your Studio9 packages from Medical Science when a session ends.',
  ],
  pt: [
    'Uma jornada = 4 sessões de foco + pausas curtas — ajusta os tempos em Definições.',
    'Deixa o telemóvel virado para baixo até o tomate chegar ao fim da linha.',
    'Depois de cada sessão, anota três pontos-chave enquanto a memória está fresca.',
    'Usa as pausas para te levantares, alongares e descansares os olhos — não redes sociais.',
    'Jornadas diárias pequenas valem mais do que um bloco enorme antes do exame.',
    'Abre os pacotes Studio9 no Medical Science quando uma sessão terminar.',
  ],
  fr: [
    'Un parcours = 4 sessions de concentration + courtes pauses — ajustez les durées dans Réglages.',
    'Posez votre téléphone face contre table jusqu’à ce que la tomate atteigne la fin de la piste.',
    'Après chaque session, notez trois points clés tant que la mémoire est fraîche.',
    'Utilisez les pauses pour vous lever, vous étirer et reposer les yeux — pas les réseaux sociaux.',
    'De petits parcours quotidiens valent mieux qu’un long bloc la veille de l’examen.',
    'Ouvrez vos packages Studio9 depuis Medical Science à la fin d’une session.',
  ],
  es: [
    'Un recorrido = 4 sesiones de enfoque + descansos cortos — ajusta los tiempos en Ajustes.',
    'Deja el móvil boca abajo hasta que el tomate llegue al final de la pista.',
    'Después de cada sesión, anota tres puntos clave mientras la memoria está fresca.',
    'Usa los descansos para levantarte, estirarte y descansar la vista — no redes sociales.',
    'Recorridos diarios pequeños superan un bloque largo antes del examen.',
    'Abre tus paquetes Studio9 desde Medical Science cuando termine una sesión.',
  ],
  it: [
    'Un percorso = 4 sessioni di focus + brevi pause — regola i tempi in Impostazioni.',
    'Metti il telefono a faccia in giù finché il pomodoro non raggiunge la fine del binario.',
    'Dopo ogni sessione, annota tre punti chiave mentre la memoria è fresca.',
    'Usa le pause per alzarti, stirarti e riposare gli occhi — non i social.',
    'Piccoli percorsi quotidiani battono un lungo blocco la vigilia dell’esame.',
    'Apri i pacchetti Studio9 da Medical Science quando finisce una sessione.',
  ],
}

export function getStudyTips(locale: Locale): readonly string[] {
  return STUDY_TIPS[locale] ?? STUDY_TIPS.en
}
