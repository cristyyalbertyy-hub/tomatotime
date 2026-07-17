import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { initNotifications } from './utils/notifications'
import { initTheme } from './utils/theme'
import { initTomatoColor } from './utils/tomatoColor'
import { getHtmlLang, getLocale } from './i18n/messages'
import './index.css'

initTheme()
initTomatoColor()
document.documentElement.lang = getHtmlLang(getLocale())
void initNotifications()

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
