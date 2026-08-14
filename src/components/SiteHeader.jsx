import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { warmRoute } from '../lib/routeLoaders.js'

// Start fetching a lazily-loaded route's chunk as soon as intent is visible, so the
// navigation itself feels instant. Pointer-down covers touch, where there is no hover.
const prefetch = (to) => ({
  onPointerEnter: () => warmRoute(to),
  onPointerDown: () => warmRoute(to),
  onFocus: () => warmRoute(to),
})

const LINKS = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/volunteer', label: 'Volunteer' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-display uppercase tracking-wide px-3 py-2 transition-colors ${
      isActive ? 'text-porch' : 'text-cream hover:text-porch-pale'
    }`

  return (
    <header className="bg-ink sticky top-0 z-40 shadow-lg shadow-black/30">
      <div className="max-w-5xl mx-auto flex items-center gap-2 px-4 py-2">
        {/* Text wordmark until real PorchFest art exists — keeps every page light. */}
        <Link to="/" className="shrink-0 leading-none py-1" onClick={() => setOpen(false)}>
          <span className="font-script text-porch text-2xl mr-1.5">Senoia</span>
          <span className="font-display uppercase tracking-wider text-cream text-xl font-semibold">
            PorchFest
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 justify-end items-center">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} {...prefetch(l.to)}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            {...prefetch('/admin')}
            className="ml-3 text-porch-pale/70 hover:text-porch-pale text-xs font-display uppercase tracking-wide"
          >
            Organizers
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="md:hidden ml-auto text-cream text-3xl leading-none px-2"
        >
          ☰
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-porch/20 px-4 pb-3 flex flex-col">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              onClick={() => setOpen(false)}
              {...prefetch(l.to)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            {...prefetch('/admin')}
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-porch-pale/50 text-sm font-display uppercase tracking-wide"
          >
            Organizers
          </Link>
        </nav>
      )}
    </header>
  )
}
