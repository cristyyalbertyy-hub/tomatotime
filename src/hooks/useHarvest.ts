import { useEffect, useState } from 'react'
import { getHarvestStats, HARVEST_EVENT, type HarvestStats } from '../utils/harvest'

export function useHarvest(): HarvestStats {
  const [stats, setStats] = useState(getHarvestStats)

  useEffect(() => {
    const refresh = () => setStats(getHarvestStats())
    window.addEventListener(HARVEST_EVENT, refresh)
    return () => window.removeEventListener(HARVEST_EVENT, refresh)
  }, [])

  return stats
}
