import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRoutes from './AppRoutes.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { initGtm } from './lib/gtm.js'

// Analytics must not race the hero art for a congested pipe: on Slow 4G the
// gtm.js request was measured going out ahead of the wordmark and both fonts.
// Idle time is late enough to stay off the critical path but early enough that
// no real session is missed; the timeout bounds it on a page that never idles,
// and the setTimeout fallback covers browsers without requestIdleCallback.
// Safe to defer: pushPageView creates window.dataLayer itself if it fires first,
// and GTM replays whatever is already queued when the container loads.
if (import.meta.env.PROD) {
  if ('requestIdleCallback' in window) requestIdleCallback(initGtm, { timeout: 3000 })
  else setTimeout(initGtm, 1500)
}

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error, info) {
    console.error('render error', error, info)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-stone-700">
        <p>
          Something went wrong. Please refresh the page, or email{' '}
          <a className="underline" href="mailto:info@enjoysenoia.com">info@enjoysenoia.com</a>.
        </p>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
