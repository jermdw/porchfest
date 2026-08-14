import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { PERFORMANCES } from '../data/schedule.js'

export default function Schedule() {
  const confirmed = PERFORMANCES.filter((p) => p.confirmed)
    .sort((a, b) => a.start.localeCompare(b.start) || a.porch.localeCompare(b.porch))

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
          2026 <span className="text-porch">Schedule</span>
        </h1>
        <p className="text-porch-pale/80 mt-3 max-w-xl mx-auto">
          Sunday, September 6 — music starts at 3pm on porches across historic
          Senoia. Admission is free.
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {confirmed.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-script text-porch-deep text-3xl mb-3">Tuning up…</p>
            <p className="text-stone-600 max-w-md mx-auto">
              The 2026 performer lineup and porch schedule will be posted here
              as soon as it's final. Check back soon!
            </p>
          </div>
        ) : (
          [...bySlot.entries()].map(([slot, sets]) => (
            <section key={slot} className="mb-8">
              <h2 className="text-xl font-bold text-stone-800 border-b-2 border-porch pb-2 mb-4">
                {slot}
              </h2>
              <ul className="space-y-3">
                {sets.map((p) => (
                  <li
                    key={`${p.act}|${p.porch}`}
                    className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <span className="font-semibold text-ink">{p.act}</span>
                    <span className="text-stone-500 text-sm">{p.porch}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
