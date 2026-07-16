import { useEffect, useState } from 'react'
import { usePomodoroTimer } from './hooks/usePomodoroTimer'
import { useSoundSettings } from './hooks/useSoundSettings'
import { useHarvest } from './hooks/useHarvest'
import { MainScreen } from './components/MainScreen'
import { Controls } from './components/UI'
import { HarvestPanel } from './components/HarvestPanel'
import { unlockAudio } from './utils/sound'
import {
  getDemoHarvestStats,
  getDemoTimerProps,
  getScreenshotScene,
} from './utils/screenshotDemo'
import './App.css'

export default function App() {
  const screenshotScene = getScreenshotScene()
  const timer = usePomodoroTimer()
  const sound = useSoundSettings()
  const harvest = useHarvest()
  const [showHarvest, setShowHarvest] = useState(screenshotScene === 'harvest')

  const demo = screenshotScene ? getDemoTimerProps(screenshotScene) : null
  const demoHarvest = screenshotScene ? getDemoHarvestStats() : null

  const handleGo = async () => {
    if (screenshotScene) return
    if (sound.soundOn) await unlockAudio()
    timer.go()
  }

  const timerProps = demo ?? timer
  const harvestStats = demoHarvest ?? harvest
  const todayTomatoes = demoHarvest?.todayTomatoes ?? harvest.todayTomatoes

  useEffect(() => {
    if (screenshotScene || !sound.soundOn) return

    const unlock = () => {
      void unlockAudio()
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [screenshotScene, sound.soundOn])

  useEffect(() => {
    if (screenshotScene) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (event.code !== 'Space') return
      event.preventDefault()

      if (timer.celebrating) return
      if (timer.status === 'running') {
        timer.pause()
        return
      }
      void (async () => {
        if (sound.soundOn) await unlockAudio()
        timer.go()
      })()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [screenshotScene, timer, sound.soundOn])

  return (
    <div className="app">
      <MainScreen
        tomatoPos={timerProps.tomatoPos}
        tomatoVisible={timerProps.tomatoVisible}
        minute={timerProps.minute}
        second={timerProps.second}
        elapsedSec={timerProps.elapsedSec}
        phaseProgress={timerProps.phaseProgress}
        journeys={timerProps.journeys}
        todayTomatoes={todayTomatoes}
        cycleSessionDone={timerProps.cycleSessionDone}
        sessionIndex={timerProps.sessionIndex}
        phase={timerProps.phase}
        status={timerProps.status}
        celebrating={timerProps.celebrating}
        inCycle={timerProps.inCycle}
      />
      <Controls
        status={timerProps.status}
        soundOn={sound.soundOn}
        inCycle={timerProps.inCycle}
        celebrating={timerProps.celebrating}
        todayTomatoes={todayTomatoes}
        onGo={handleGo}
        onPause={screenshotScene ? () => {} : timer.pause}
        onReset={screenshotScene ? () => {} : timer.reset}
        onToggleSound={screenshotScene ? () => {} : sound.toggleSound}
        onOpenHarvest={() => setShowHarvest(true)}
      />
      {showHarvest && (
        <HarvestPanel
          stats={harvestStats}
          onClose={() => !screenshotScene && setShowHarvest(false)}
        />
      )}
    </div>
  )
}
