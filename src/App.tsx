import { useState } from 'react'
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

  return (
    <div className="app">
      <MainScreen
        tomatoPos={timerProps.tomatoPos}
        tomatoVisible={timerProps.tomatoVisible}
        minute={timerProps.minute}
        second={timerProps.second}
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
