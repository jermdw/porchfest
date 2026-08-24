import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SocialIcon from '../components/SocialIcon.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { getBandsWithSchedule } from '../data/bands.js'

const GENRE_FILTERS = [
  { id: 'all', label: 'All Genres' },
  { id: 'country', label: 'Country' },
  { id: 'classic-rock', label: 'Classic Rock' },
  { id: 'southern-rock', label: 'Southern Rock' },
  { id: 'blues-soul', label: 'Blues & Soul' },
  { id: 'americana-folk', label: 'Americana & Folk' },
  { id: 'pop-covers', label: 'Pop & Covers' },
  { id: 'indie-alt', label: 'Indie & Alternative' },
]

function matchesGenre(bandGenre, filterId) {
  if (filterId === 'all') return true
  const g = (bandGenre || '').toLowerCase()
  switch (filterId) {
    case 'country':
      return g.includes('country')
    case 'classic-rock':
      return g.includes('classic rock') || g.includes("60's") || g.includes("70's") || g.includes("rock n roll")
    case 'southern-rock':
      return g.includes('southern rock') || g.includes('southern and')
    case 'blues-soul':
      return g.includes('blues') || g.includes('soul') || g.includes('gospel')
    case 'americana-folk':
      return g.includes('americana') || g.includes('folk') || g.includes('acoustic')
    case 'pop-covers':
      return g.includes('pop') || g.includes('cover') || g.includes('dance')
    case 'indie-alt':
      return g.includes('indie') || g.includes('alternative') || g.includes('jam')
    default:
      return true
  }
}

export default function Bands() {
  usePageMeta({
    title: '2026 Band Bios & Lineup — Meet the Artists | Senoia PorchFest',
    description:
      'Explore concise bios, band instrumentation, sound previews, and social links for all 41 acts playing Senoia PorchFest 2026 on Sunday, Sept 6.',
    path: '/bands',
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('alpha') // 'alpha' | 'time'

  const allBands = useMemo(() => getBandsWithSchedule(), [])

  const filteredBands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const list = allBands.filter((b) => {
      // Genre filter
      if (!matchesGenre(b.genre, selectedGenre)) {
        return false
      }

      // Search query
      if (q) {
        const matchName = b.act.toLowerCase().includes(q)
        const matchGenre = (b.genre || '').toLowerCase().includes(q)
        const matchComp = (b.composition || '').toLowerCase().includes(q)
        const matchBio = (b.bio || '').toLowerCase().includes(q)
        const matchAddress = (b.address || '').toLowerCase().includes(q)
        const matchVenue = (b.venue || '').toLowerCase().includes(q)
        const matchStage = b.stage != null && `stage ${b.stage}`.includes(q)
        if (!matchName && !matchGenre && !matchComp && !matchBio && !matchAddress && !matchVenue && !matchStage) {
          return false
        }
      }

      return true
    })

    if (sortBy === 'time') {
      return [...list].sort((a, b) => (a.start || '99:99').localeCompare(b.start || '99:99') || a.act.localeCompare(b.act))
    }
    return [...list].sort((a, b) => a.act.localeCompare(b.act))
  }, [allBands, searchQuery, selectedGenre, sortBy])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      {/* Hero Header */}
      <header className="bg-ink text-cream px-4 sm:px-6 pt-8 pb-10 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-script text-flag-bright text-2xl sm:text-3xl mb-1">
            Music on the porches
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-cream mb-3">
            2026 Performer <span className="text-flag-bright">Bios &amp; Lineup</span>
          </h1>
          <p className="text-pale text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sunday, September 6, 2026 &mdash; 41 acts across ~29 porches in historic Senoia, Georgia.
            Browse artist bios, lineups, and social links to find your favorite sounds and plan your afternoon.
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg text-sm transition-colors shadow"
            >
              <span>⏰ View Performance Schedule</span>
              <span>→</span>
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 border border-pale/40 hover:border-cream text-pale hover:text-cream font-display uppercase tracking-wider px-4 py-2.5 rounded-lg text-xs transition-colors"
            >
              <span>🗺️ Interactive Day-Of Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artist, genre, instrument, stage, or street..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 pl-10 text-sm text-ink focus:outline-none focus:border-flag focus:bg-white transition-colors"
              />
              <span className="absolute left-3.5 top-2.5 text-stone-400 text-sm">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown / Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort-select" className="text-xs font-display uppercase font-bold text-stone-600">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-display uppercase font-semibold text-ink focus:outline-none focus:border-flag cursor-pointer"
              >
                <option value="alpha">Alphabetical (A–Z)</option>
                <option value="time">Set Time (Earliest First)</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
            {GENRE_FILTERS.map((f) => {
              const isSelected = selectedGenre === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedGenre(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wide whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-ink text-cream font-bold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
            <span>
              Showing <strong className="text-ink font-bold">{filteredBands.length}</strong> of {allBands.length} performers
            </span>
            {(searchQuery || selectedGenre !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedGenre('all')
                }}
                className="text-flag hover:underline font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Bands Grid */}
        {filteredBands.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <p className="font-script text-flag text-3xl mb-2">No performers found</p>
            <p className="text-stone-600 text-sm mb-4">
              We couldn&rsquo;t find any acts matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear your genre filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedGenre('all')
              }}
              className="bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg text-xs transition-colors"
            >
              Show All 41 Performers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredBands.map((band) => {
              const slotId = band.time ? `slot-${band.time.replace(/[^a-zA-Z0-9]/g, '-')}` : ''
              const hasLinks = Object.keys(band.links || {}).length > 0

              return (
                <article
                  key={band.act}
                  id={band.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-flag/60 transition-all flex flex-col justify-between overflow-hidden scroll-mt-24"
                >
                  <div>
                    {/* Band Photo or Branded Header */}
                    {band.photo ? (
                      <div className="relative h-48 sm:h-52 w-full bg-ink overflow-hidden border-b border-stone-200 group">
                        <img
                          src={band.photo}
                          alt={`${band.act} live performance`}
                          loading="lazy"
                          width="640"
                          height="380"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                        {/* Stage Number / VIP / Main Badge top-left */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          {band.stage != null ? (
                            <span
                              className="w-10 h-10 rounded-full bg-flag text-cream font-display font-bold text-base flex items-center justify-center shadow-md border-2 border-white/25"
                              title={`Stage ${band.stage}`}
                            >
                              {band.stage}
                            </span>
                          ) : band.venue === 'Main Stage' ? (
                            <span className="px-3 py-1 rounded-md bg-flag text-cream font-display text-xs uppercase font-bold tracking-wider shadow-md">
                              Main Stage
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-md bg-amber-600 text-cream font-display text-xs uppercase font-bold tracking-wider shadow-md">
                              VIP Lounge
                            </span>
                          )}
                        </div>

                        {/* Set time & genre badges bottom on photo */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-ink/90 backdrop-blur-xs text-cream font-display font-bold text-xs tracking-wide border border-white/15 shadow-xs">
                            ⏰ {band.time || 'Time pending'}
                          </span>
                          <span className="text-[11px] font-semibold bg-white/90 text-ink px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs max-w-[150px] truncate">
                            {band.genre}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 sm:h-52 w-full bg-gradient-to-br from-ink via-[#17254b] to-ink p-4 flex flex-col justify-between border-b border-stone-200 overflow-hidden">
                        {/* Decorative Stage Number & Ambient Watermarks */}
                        <div className="absolute -right-3 -bottom-6 text-white/[0.04] font-display font-black text-8xl select-none pointer-events-none">
                          {band.stage != null ? `#${band.stage}` : 'SPF'}
                        </div>
                        <div className="absolute -left-6 -top-6 w-32 h-32 bg-flag/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Top row: Stage badge + Genre */}
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-2.5">
                            {band.stage != null ? (
                              <span
                                className="w-10 h-10 rounded-full bg-flag text-cream font-display font-bold text-base flex items-center justify-center shadow-md border-2 border-white/20"
                                title={`Stage ${band.stage}`}
                              >
                                {band.stage}
                              </span>
                            ) : band.venue === 'Main Stage' ? (
                              <span className="px-3 py-1 rounded-md bg-flag text-cream font-display text-xs uppercase font-bold tracking-wider shadow-sm">
                                Main Stage
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-md bg-amber-600 text-cream font-display text-xs uppercase font-bold tracking-wider shadow-sm">
                                VIP Lounge
                              </span>
                            )}

                            <div className="min-w-0">
                              <p className="text-[10px] font-display uppercase tracking-widest text-pale/70">
                                {band.stage != null ? `Stage ${band.stage}` : 'Featured Stage'}
                              </p>
                              <p className="text-xs font-display font-bold text-flag-bright tracking-wide">
                                {band.time || 'Schedule pending'}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold bg-white/10 text-cream px-2.5 py-1 rounded-full uppercase tracking-wider truncate max-w-[140px]">
                            {band.genre}
                          </span>
                        </div>

                        {/* Center visual accent */}
                        <div className="z-10 text-center my-auto py-1">
                          <p className="font-script text-flag-bright text-2xl tracking-wide opacity-90">
                            Live on the Porch
                          </p>
                        </div>

                        {/* Bottom row: Set time & festival tag */}
                        <div className="z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                          <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-xs text-cream font-display font-bold text-xs tracking-wide border border-white/10">
                            ⏰ {band.time || 'Time pending'}
                          </span>
                          <span className="text-[10px] font-display uppercase tracking-wider text-pale/60">
                            Senoia PorchFest 2026
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      {/* Act Title */}
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-ink leading-tight">
                          {band.act}
                        </h2>

                        {band.composition && (
                          <p className="text-xs text-stone-600 font-medium mt-1 leading-snug">
                            {band.composition}
                          </p>
                        )}
                      </div>

                      {/* Porch Location */}
                      <div className="bg-stone-50 rounded-lg p-2.5 text-xs text-stone-600 border border-stone-200/80 flex items-start gap-1.5">
                        <span className="shrink-0 text-stone-400">📍</span>
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-800">{band.address}</span>
                          {band.venue ? (
                            <span className="text-stone-500 block"> ({band.venue})</span>
                          ) : null}
                        </div>
                      </div>

                      {/* Bio Description */}
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {band.bio}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Social Links & Navigation Actions */}
                  <div className="p-5 pt-3 border-t border-stone-100 bg-stone-50/50 space-y-3">
                    {/* Social & Media Links */}
                    {hasLinks && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-display uppercase tracking-wider text-stone-600 font-bold mr-1">
                          Links:
                        </span>
                        {Object.entries(band.links).map(([network, url]) => (
                          <a
                            key={network}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-stone-200 hover:border-flag text-stone-700 hover:text-flag text-xs transition-colors shadow-2xs"
                            title={`Open ${network} page`}
                          >
                            <SocialIcon network={network} className="w-3.5 h-3.5 shrink-0" />
                            <span className="capitalize text-[11px] font-semibold">{network}</span>
                            <span className="text-[10px] text-stone-600">↗</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {band.poiId && (
                        <Link
                          to={`/map?poi=${band.poiId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-flag hover:text-flag-deep font-display uppercase tracking-wide"
                        >
                          <span>🗺️ View on Map</span>
                          <span>→</span>
                        </Link>
                      )}

                      {band.time && (
                        <Link
                          to={`/schedule#${slotId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-ink font-display uppercase tracking-wide"
                        >
                          <span>⏰ Set Time</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
