import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { publishedPerformances } from '../data/schedule.js'

export default function Schedule() {
  usePageMeta({
    title: '2026 Schedule & Lineup Card — Who Plays Where & When | Senoia PorchFest',
    description:
      'The complete Senoia PorchFest 2026 schedule and lineup card: 41 acts across 29 porches in historic Senoia, GA. Free admission.',
    path: '/schedule',
  })

  const confirmed = publishedPerformances()

  // Group by display time slot
  const bySlot = new Map()
  for (const p of confirmed) {
    if (!bySlot.has(p.time)) bySlot.set(p.time, [])
    bySlot.get(p.time).push(p)
  }

  const timeSlots = [...bySlot.entries()]

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      {/* Hero Header */}
      <header className="bg-ink text-cream px-4 sm:px-6 pt-8 pb-10 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-script text-flag-bright text-2xl sm:text-3xl mb-1">
            Official Lineup Card
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-cream mb-3">
            2026 Performance <span className="text-flag-bright">Schedule</span>
          </h1>
          <p className="text-pale text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sunday, September 6, 2026 — 41 acts across ~29 porches in historic Senoia, Georgia.
            Music runs 3:00 to 10:00pm. Admission is <strong>free</strong>.
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg text-sm transition-colors shadow"
            >
              <span>🗺️ Open Interactive Day-Of Map</span>
              <span>→</span>
            </Link>
            <a
              href="/senoia-porchfest-2026-lineup-card.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border border-pale/40 hover:border-cream text-pale hover:text-cream font-display uppercase tracking-wider px-4 py-2.5 rounded-lg text-xs transition-colors"
            >
              <span>📄 Download Lineup Card (PDF)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Quick Jump Bar */}
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-stone-300 py-2.5 px-4 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs font-display uppercase font-bold text-stone-600 hidden sm:inline">
            Jump to Time:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
            {timeSlots.map(([slot]) => (
              <a
                key={slot}
                href={`#slot-${slot.replace(/[^a-zA-Z0-9]/g, '-')}`}
                className="px-3 py-1 rounded-full bg-white hover:bg-ink hover:text-cream text-ink border border-stone-300 font-display text-xs uppercase tracking-wide whitespace-nowrap transition-colors shadow-2xs"
              >
                {slot}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Schedule Columns */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {confirmed.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-script text-flag text-3xl mb-3">Tuning up…</p>
            <p className="text-stone-600 max-w-md mx-auto">
              The 2026 performer lineup and porch schedule will be posted here
              as soon as it's final. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* VIP Kickoff & Main Porch Hours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
              {timeSlots
                .filter(([slot]) => slot !== '8:00 PM')
                .map(([slot, sets]) => {
                  const slotId = `slot-${slot.replace(/[^a-zA-Z0-9]/g, '-')}`
                  const isVipSlot = slot === '2:00 PM'
                  return (
                    <section
                      key={slot}
                      id={slotId}
                      className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col scroll-mt-16"
                    >
                      {/* Column Header */}
                      <div className={`px-4 py-3 border-b ${
                        isVipSlot ? 'bg-amber-900/90 text-cream border-amber-800' : 'bg-ink text-cream border-stone-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                            {slot}
                          </h2>
                          <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-white/15 text-cream">
                            {isVipSlot ? 'VIP Doors' : `${sets.length} Acts`}
                          </span>
                        </div>
                        {isVipSlot && (
                          <p className="text-[11px] text-amber-200 mt-0.5">
                            Farmers' Market Kickoff
                          </p>
                        )}
                      </div>

                      {/* Acts in this Time Column */}
                      <div className="p-3 space-y-2.5 divide-y divide-stone-100">
                        {sets.map((p, idx) => (
                          <div
                            key={`${p.act}|${p.address}`}
                            className={idx > 0 ? 'pt-2.5' : ''}
                          >
                            <div className="flex items-start gap-2.5">
                              {/* Stage Number Badge */}
                              {p.stage != null ? (
                                <span
                                  className="shrink-0 w-8 h-8 rounded-full bg-flag text-cream font-display font-bold text-sm flex items-center justify-center shadow-xs"
                                  title={`Stage ${p.stage}`}
                                >
                                  {p.stage}
                                </span>
                              ) : (
                                <span
                                  className="shrink-0 px-2 py-1 rounded bg-ink text-cream font-display text-[10px] uppercase font-bold leading-none"
                                >
                                  VIP
                                </span>
                              )}

                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-ink text-sm sm:text-base leading-tight">
                                  {p.act}
                                </h3>
                                <p className="text-xs font-semibold text-flag uppercase tracking-wide mt-0.5">
                                  {p.genre}
                                </p>
                                <p className="text-xs text-stone-500 mt-1 leading-snug">
                                  {p.address}
                                  {p.venue ? (
                                    <span className="block text-stone-600 font-medium">
                                      {p.venue}
                                    </span>
                                  ) : null}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                })}
            </div>

            {/* 8:00 PM Closing Act Banner Column */}
            {timeSlots
              .filter(([slot]) => slot === '8:00 PM')
              .map(([slot, sets]) => {
                const slotId = `slot-${slot.replace(/[^a-zA-Z0-9]/g, '-')}`
                return (
                  <section
                    key={slot}
                    id={slotId}
                    className="bg-ink text-cream rounded-2xl p-6 sm:p-8 shadow-md border-2 border-flag relative overflow-hidden scroll-mt-16"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-flag text-cream font-display text-xs uppercase font-bold tracking-wider">
                            Closing Headliner
                          </span>
                          <span className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-flag-bright">
                            8:00 PM – Main Stage
                          </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-wider text-cream">
                          {sets[0]?.act ?? 'Chuck X Nick'}
                        </h2>
                        <p className="text-pale text-sm mt-1">
                          Bottom of Main Street at Travis & Gin Street
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <Link
                          to="/map?poi=stage-main"
                          className="bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap shadow"
                        >
                          📍 View Main Stage on Map
                        </Link>
                      </div>
                    </div>
                  </section>
                )
              })}
          </div>
        )}

        {/* Printable Card Footer Links */}
        <footer className="mt-12 pt-8 border-t border-stone-300 text-center space-y-3">
          <p className="text-stone-600 text-sm">
            Stage numbers match the physical signs at each porch and the pins on the{' '}
            <Link to="/map" className="font-semibold text-flag underline hover:text-ink">
              Day-Of Map
            </Link>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-stone-500">
            <a
              href="/senoia-porchfest-2026-lineup-card.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-flag hover:underline inline-flex items-center gap-1 font-semibold"
            >
              📥 Download Printable Lineup Card (PDF)
            </a>
          </div>
        </footer>
      </main>

      <SiteFooter />
    </div>
  )
}
