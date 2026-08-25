import { useEffect, useState, useMemo } from 'react'
import { formatTime, isShowDay, getCurrentSlot } from '../lib/showTime.js'
import { publishedPerformances } from '../data/schedule.js'

const TICK_MS = 30_000

export default function ScheduleList({ onSelectPoi, now }) {
  const [clock, setClock] = useState(() => now ?? new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('all')

  useEffect(() => {
    if (now) return undefined
    const id = setInterval(() => setClock(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [now])

  const performances = useMemo(() => publishedPerformances(), [])
  const current = now ?? clock
  const live = isShowDay(current)
  const activeSlot = live ? getCurrentSlot(current) : null

  // Resolve POI ID for each performance
  const resolvedPerformances = useMemo(() => {
    return performances.map((perf) => {
      let poiId = null
      if (perf.address === '40 Travis Street') {
        poiId = 'vip'
      } else if (perf.venue === 'Main Stage' || perf.stage == null) {
        poiId = 'stage-main'
      } else {
        poiId = `porch-${perf.stage}`
      }
      return { ...perf, poiId }
    })
  }, [performances])

  // Filter performances based on search query and selected slot
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return resolvedPerformances.filter((p) => {
      // Slot filter
      if (selectedSlot !== 'all') {
        if (selectedSlot === 'now') {
          if (activeSlot && p.start !== activeSlot) return false
        } else if (p.start !== selectedSlot) {
          return false
        }
      }
      // Search query
      if (q) {
        const matchAct = p.act.toLowerCase().includes(q)
        const matchGenre = p.genre?.toLowerCase().includes(q)
        const matchVenue = p.venue?.toLowerCase().includes(q)
        const matchAddress = p.address?.toLowerCase().includes(q)
        const matchStage = p.stage != null && `stage ${p.stage}`.includes(q)
        if (!matchAct && !matchGenre && !matchVenue && !matchAddress && !matchStage) {
          return false
        }
      }
      return true
    })
  }, [resolvedPerformances, searchQuery, selectedSlot, activeSlot])

  // Group by start time
  const groupedByTime = useMemo(() => {
    const map = new Map()
    filtered.forEach((p) => {
      if (!map.has(p.start)) {
        map.set(p.start, { time: p.time, start: p.start, items: [] })
      }
      map.get(p.start).items.push(p)
    })
    return [...map.values()].sort((a, b) => a.start.localeCompare(b.start))
  }, [filtered])

  const timeSlots = [
    { id: 'all', label: 'All Sets' },
    { id: 'now', label: '⚡ Playing Now' },
    { id: '14:00', label: '2 PM VIP' },
    { id: '15:00', label: '3 PM' },
    { id: '16:00', label: '4 PM' },
    { id: '17:00', label: '5 PM' },
    { id: '18:00', label: '6 PM' },
    { id: '19:00', label: '7 PM' },
    { id: '20:00', label: '8 PM Main' },
  ]

  return (
    <div className="space-y-4">
      {/* Search and Time Filter Bar */}
      <div className="space-y-2.5 print:hidden">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search acts, genres, stages, or streets..."
            className="w-full bg-white text-ink border border-stone-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-flag shadow-sm"
          />
          <span className="absolute left-3.5 top-2.5 text-stone-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Time Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wide whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-ink text-cream font-bold shadow'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-stone-500'
                }`}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      {groupedByTime.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-stone-600">
          <p className="text-base font-semibold">No performances match your search.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedSlot('all')
            }}
            className="mt-2 text-sm text-flag underline font-semibold"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByTime.map((group) => {
            const isGroupNow = activeSlot === group.start
            return (
              <section key={group.start} className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <h3 className="font-display font-bold text-lg uppercase tracking-wide text-ink flex items-center gap-2">
                    <span className={isGroupNow ? 'text-flag' : 'text-ink'}>
                      {formatTime(group.start)} Sets
                    </span>
                    {isGroupNow && (
                      <span className="bg-flag text-cream text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-normal">
                        Live Now
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-stone-500 font-semibold">
                    {group.items.length} {group.items.length === 1 ? 'act' : 'acts'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.items.map((perf) => (
                    <div
                      key={perf.act + perf.address}
                      className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm hover:border-flag transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-ink text-base leading-snug">
                            {perf.act}
                          </h4>
                          {perf.stage != null ? (
                            <span className="w-6 h-6 rounded-full bg-flag text-cream font-display font-bold text-xs flex items-center justify-center shrink-0">
                              {perf.stage}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-ink text-cream font-display text-[10px] uppercase font-bold shrink-0">
                              Main
                            </span>
                          )}
                        </div>

                        {perf.genre && (
                          <p className="text-xs text-stone-600 font-medium mt-0.5">
                            {perf.genre}
                          </p>
                        )}

                        <p className="text-xs text-stone-500 mt-2">
                          {perf.venue ? `${perf.venue} · ` : ''}
                          {perf.address}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                        {perf.poiId ? (
                          <button
                            type="button"
                            onClick={() => onSelectPoi?.(perf.poiId)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-flag hover:text-flag-deep underline underline-offset-2"
                          >
                            <span>📍 Show on Map</span>
                          </button>
                        ) : <div />}
                        <span className="text-[11px] font-display text-stone-400">
                          {perf.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
