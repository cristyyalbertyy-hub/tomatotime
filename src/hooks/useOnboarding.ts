import { useCallback, useState } from 'react'
import { isOnboarded, setOnboarded } from '../utils/settings'

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded())

  const completeOnboarding = useCallback(() => {
    setOnboarded()
    setShowOnboarding(false)
  }, [])

  return { showOnboarding, completeOnboarding }
}
