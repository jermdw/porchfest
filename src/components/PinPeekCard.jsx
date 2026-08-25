import { useEffect, useRef } from 'react'
import CategoryIcon from './CategoryIcon.jsx'

export default function PinPeekCard({ poi, onClose, activeTimeSlot }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!poi) return null

  return (
    <div
      ref={cardRef}
      role="region"
      aria-label={`${poi.name} details`}
      className="absolute bottom-3 left-3 right-3 z-30 bg-ink text-cream rounded-xl shadow-2xl p-4 border border-pale/25 max-h-[60%] flex flex-col pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-pale/20">
        <div className="min-w-0 flex items-center gap-2.5">
          {poi.category === 'porch' && poi.stage != null ? (
            <span className="w-8 h-8 rounded-full bg-flag text-cream font-display font-bold text-sm flex items-center justify-center shrink-0 shadow">
              {poi.stage}
            </span>
          ) : (
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow text-cream"
              style={{ backgroundColor: `var(--color-cat-${poi.category}, var(--color-flag))` }}
            >
              <CategoryIcon category={poi.category} className="w-4 h-4" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="font-display font-bold uppercase tracking-wide text-base sm:text-lg text-cream truncate">
              {poi.name}
            </h3>
            {poi.where && (
              <p className="text-pale/90 text-xs truncate">
                {poi.where}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close location details"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-cream flex items-center justify-center text-sm font-semibold transition-colors shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Body: Sets or Blurb */}
      <div className="my-2.5 overflow-y-auto no-scrollbar space-y-2 max-h-36 pr-1">
        {poi.performances && poi.performances.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-display uppercase tracking-wider text-pale/70 font-semibold">
              Live Lineup & Set Times
            </p>
            {poi.performances.map((perf) => {
              const isHighlighted =
                activeTimeSlot && activeTimeSlot !== 'all' && perf.start === activeTimeSlot
              return (
                <div
                  key={perf.act + perf.start}
                  className={`flex items-baseline justify-between gap-2 text-xs py-1 px-2 rounded ${
                    isHighlighted ? 'bg-flag/30 border border-flag-bright/50' : 'bg-white/5'
                  }`}
                >
                  <span className="font-display font-semibold text-flag-bright shrink-0 w-16">
                    {perf.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-cream truncate block">
                      {perf.act}
                    </span>
                    {perf.genre && (
                      <span className="text-pale/70 text-[11px] block truncate">
                        {perf.genre}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : poi.blurb ? (
          <p className="text-xs text-pale/90 leading-relaxed">
            {poi.blurb}
          </p>
        ) : (
          <p className="text-xs text-pale/70 italic">
            No additional notes for this stop.
          </p>
        )}
      </div>

      {/* Footer: Directions link */}
      {poi.directions && (
        <div className="pt-2 border-t border-pale/15 flex items-center justify-between">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(poi.directions)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-flag-bright hover:underline"
          >
            <span>Directions in Maps</span>
            <span>→</span>
          </a>
          <span className="text-[10px] text-pale/60">Historic Senoia</span>
        </div>
      )}
    </div>
  )
}
