import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Suppress Chrome extension messaging errors in development
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('runtime.lastError') ||
      event.message?.includes('The message port closed before a response was received')
    ) {
      event.preventDefault()
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
