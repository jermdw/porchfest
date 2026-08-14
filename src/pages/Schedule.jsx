import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { publishedPerformances } from '../data/schedule.js'

export default function Schedule() {
  const confirmed = publishedPerformances()

  // Group by display time so simultaneous sets read as one walkable block.
  const bySlot = new Map()
  for (const p of confirmed) {
    if (!bySlot.has(p.time)) bySlot.set(p.time, [])
    bySlot.get(p.time).push(p)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <header className="bg-ink text-cream px-6 pt-6 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold uppercase tracking-wide">
          2026 <span className="text-flag-bright">Schedule</span>
        </h1>
        <p className="text-pale/80 mt-3 max-w-xl mx-auto">
          Sunday, September 6 — new sets every hour, 3:00 to 8:00pm, on porches
          across historic Senoia. Admission is free. Stage numbers match the
          signs at each porch and the pins on the{' '}
          <Link to="/map" className="underline text-cream hover:text-pale">
            day-of map
          </Link>
          .
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {confirmed.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-script text-flag text-3xl mb-3">Tuning up…</p>
            <p className="text-stone-600 max-w-md mx-auto">
              The 2026 performer lineup and porch schedule will be posted here
              as soon as it's final. Check back soon!
            </p>
          </div>
        ) : (
          [...bySlot.entries()].map(([slot, sets]) => (
            <section key={slot} className="mb-8">
              <h2 className="text-xl font-bold text-stone-800 border-b-2 border-flag pb-2 mb-4">
                {slot}
              </h2>
              <ul className="space-y-3">
                {sets.map((p) => (
                  <li key={`${p.act}|${p.address}`}>
                    <Link
                      to={p.stage != null ? `/map?poi=porch-${p.stage}` : '/map?poi=stage-main'}
                      className="bg-white rounded-lg shadow-sm border border-stone-200 hover:border-flag transition-colors p-4 flex items-center gap-4"
                    >
                      <span
                        className="shrink-0 w-10 h-10 rounded-full bg-ink text-cream font-display font-semibold flex items-center justify-center"
                        aria-label={p.stage != null ? `Stage ${p.stage}` : 'Main Stage'}
                      >
                        {p.stage ?? '♪'}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{p.act}</span>
                        <span className="block text-flag text-xs font-semibold uppercase tracking-wide mt-0.5">
                          {p.genre}
                        </span>
                        <span className="block text-stone-500 text-sm mt-0.5">
                          {p.address}
                          {p.venue ? ` (${p.venue})` : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        {confirmed.length > 0 && (
          <p className="text-center text-stone-500 text-sm mt-10">
            Prefer paper? Grab the{' '}
            <a href="/schedule-poster-2026.jpg" target="_blank" rel="noreferrer" className="underline text-flag">
              official schedule card
            </a>{' '}
            or the{' '}
            <a href="/lineup-poster-2026.png" target="_blank" rel="noreferrer" className="underline text-flag">
              lineup poster
            </a>
            .
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
