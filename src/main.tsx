import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initNotifications } from './utils/notifications'
import './index.css'

void initNotifications()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)