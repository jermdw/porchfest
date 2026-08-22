import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import MapCanvas from '../components/MapCanvas.jsx'
import PoiList from '../components/PoiList.jsx'
import ScheduleList from '../components/ScheduleList.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { TIME_SLOT_OPTIONS } from '../lib/showTime.js'
import {
  CATEGORIES,
  publishedPois,
} from '../data/eventMap.js'

export default function EventMap() {
  usePageMeta({
    title: 'Day-Of Map — Porch Stages, Food & Parking | Senoia PorchFest',
    description:
      'The interactive Senoia PorchFest 2026 festival map: every porch stage, plus food, restrooms, parking, and more across historic Senoia, Georgia.',
    path: '/map',
  })

  const pois = useMemo(publishedPois, [])
  const mapCanvasRef = useRef(null)

  // Categories that actually have published locations
  const categories = useMemo(
    () => CATEGORIES.filter((c) => pois.some((p) => p.category === c.id)),
    [pois],
  )

  const [active, setActive] = useState(() => categories.map((c) => c.id))
  const [timeSlot, setTimeSlot] = useState('all')

  // ?poi=<id> lets a QR code on a sign deep-link straight to one location.
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('poi')

  const selectPoi = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id && id !== selectedId) {
      next.set('poi', id)
    } else if (!id) {
      next.delete('poi')
    }
    setSearchParams(next, { replace: true })

    if (id) {
      // Smoothly scroll the map container into view so the user can see the highlighted pin & peek sheet
      mapCanvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  // Which tab is showing also lives in the URL
  const view = searchParams.get('view') === 'schedule' ? 'schedule' : 'locations'
  const setView = (v) => {
    const next = new URLSearchParams(searchParams)
    if (v === 'schedule') next.set('view', v)
    else next.delete('view')
    setSearchParams(next, { replace: true })
  }

  // Arrow/Home/End movement between tabs
  const tabRefs = useRef({})
  const onTabKey = (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const next =
      e.key === 'Home'
        ? 'locations'
        : e.key === 'End'
          ? 'schedule'
          : view === 'locations'
            ? 'schedule'
            : 'locations'
    setView(next)
    tabRefs.current[next]?.focus()
  }

  const visible = pois.filter((p) => active.includes(p.category))
  const allOn = active.length === categories.length

  const toggle = (id) =>
    setActive((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          PorchFest <span className="text-flag">Day Of</span>
        </h1>
        <p className="font-script text-flag text-2xl mb-4">
          Sunday, September 6, 2026
        </p>
        <p className="text-stone-700 mb-6 leading-relaxed">
          Every numbered pin is a porch stage — tap one to see who plays there
          and when. Admission is <strong>free</strong>; music runs 3:00 to
          10:00pm with the closing act at 8:00.
        </p>

        {/* Hourly / Playing Now Filter Bar */}
        <div className="mb-3 print:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {TIME_SLOT_OPTIONS.map((slot) => {
              const isSelected = timeSlot === slot.id
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setTimeSlot(slot.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-display uppercase tracking-wide whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-flag text-cream font-bold shadow-sm'
                      : 'bg-white text-ink border border-stone-300 hover:border-ink'
                  }`}
                >
                  {slot.label}
                </button>
              )
            })}
          </div>
        </div>

        <div ref={mapCanvasRef} className="scroll-mt-4">
          <MapCanvas
            pois={pois}
            categories={categories}
            activeCategories={view === 'schedule' ? categories.map((c) => c.id) : active}
            selectedId={selectedId}
            onSelect={selectPoi}
            activeTimeSlot={timeSlot}
          />
        </div>

        {/* Two intents, one page: "where is it" and "when is it". */}
        <div
          role="tablist"
          aria-label="Day-of guide"
          className="flex border-b-2 border-flag mb-6 print:hidden"
        >
          {[
            { id: 'locations', label: 'Find Your Way' },
            { id: 'schedule', label: 'Lineup & Schedule' },
          ].map((t) => {
            const on = view === t.id
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={on}
                aria-controls={`panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setView(t.id)}
                onKeyDown={onTabKey}
                className={`min-h-11 px-5 font-display text-lg uppercase tracking-wide rounded-t-md transition-colors ${
                  on
                    ? 'bg-ink text-cream'
                    : 'text-stone-600 hover:text-ink hover:bg-pale/40'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id="panel-locations"
          aria-labelledby="tab-locations"
          tabIndex={0}
          className={view === 'locations' ? '' : 'hidden print:block'}
        >
          {/* Single-Row Horizontal Category Scroll Strip (reclaims ~150px height) */}
          <div className="mb-6 print:hidden">
            <div
              className="flex gap-2 overflow-x-auto no-scrollbar py-1 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
              role="group"
              aria-label="Filter locations by type"
            >
              {categories.map((c) => {
                const on = active.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(c.id)}
                    aria-pressed={on}
                    style={
                      on
                        ? {
                            backgroundColor: `var(--color-cat-${c.id})`,
                            borderColor: `var(--color-cat-${c.id})`,
                            color: 'var(--color-cream)',
                          }
                        : { color: `var(--color-cat-${c.id})` }
                    }
                    className={`inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-full border font-display uppercase tracking-wide text-xs whitespace-nowrap shrink-0 transition-colors ${
                      on ? 'shadow-sm' : 'bg-white border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    <CategoryIcon category={c.id} className="w-3.5 h-3.5" />
                    {c.label}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActive(categories.map((c) => c.id))}
                disabled={allOn}
                className="min-h-9 text-xs font-semibold text-ink underline underline-offset-2 hover:text-flag disabled:no-underline disabled:text-stone-400 disabled:hover:text-stone-400"
              >
                Show all categories
              </button>
              {timeSlot !== 'all' && (
                <button
                  type="button"
                  onClick={() => setTimeSlot('all')}
                  className="min-h-9 text-xs font-semibold text-flag underline underline-offset-2 hover:text-flag-deep"
                >
                  Reset time filter
                </button>
              )}
            </div>
          </div>

          <div className="print:hidden">
            <PoiList
              categories={categories}
              pois={visible}
              selectedId={selectedId}
              onSelect={selectPoi}
            />
          </div>
          <div className="hidden print:block">
            <PoiList categories={categories} pois={pois} idPrefix="poi-print" />
          </div>
        </div>

        <div
          role="tabpanel"
          id="panel-schedule"
          aria-labelledby="tab-schedule"
          tabIndex={0}
          className={view === 'schedule' ? '' : 'hidden print:block'}
        >
          <h2 className="hidden print:block font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-flag pb-2 mb-4 mt-10">
            PorchFest Day Schedule
          </h2>
          <ScheduleList onSelectPoi={selectPoi} />
        </div>

        <div className="bg-ink rounded-xl p-6 text-center mt-10 print:hidden">
          <p className="font-script text-flag-bright text-2xl mb-3">
            Planning your porch route?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/schedule"
              className="inline-block bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
            >
              Full Lineup Card
            </Link>
            <a
              href="/senoia-porchfest-2026-map.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-pale/40 text-pale hover:text-cream hover:border-cream font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
            >
              Download Map PDF
            </a>
            <a
              href="/senoia-porchfest-2026-lineup-card.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-pale/40 text-pale hover:text-cream hover:border-cream font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
            >
              Download Lineup PDF
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
