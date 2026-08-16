import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Schedule from './pages/Schedule.jsx'
import Vip from './pages/Vip.jsx'
import EventMap from './pages/EventMap.jsx'
import NotFound from './pages/NotFound.jsx'
import { ROUTE_LOADERS } from './lib/routeLoaders.js'

// These three are the only routes that touch Firebase, and importing
// `src/firebase.js` has side effects (initializeApp, emulator wiring).
// Loading them lazily keeps the ~169 kB gzipped Firebase SDK out of the chunk
// every visitor downloads — the public pages above must never import it.
const Volunteer = lazy(ROUTE_LOADERS['/volunteer'])
const Cancel = lazy(ROUTE_LOADERS['/cancel'])
const Admin = lazy(ROUTE_LOADERS['/admin'])

export default function AppRoutes() {
  return (
    // Only the lazy routes suspend, so the eager public pages never flash this.
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/map" element={<EventMap />} />
        <Route path="/vip" element={<Vip />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
