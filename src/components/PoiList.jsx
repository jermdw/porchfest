import CategoryIcon from './CategoryIcon.jsx'
import { isWithinMap } from '../lib/venueGeo.js'

export default function PoiList({ categories, pois, selectedId, onSelect, idPrefix = 'poi' }) {
  // Separate porch stages from other amenity/stage categories
  const nonPorchCategories = categories.filter((c) => c.id !== 'porch')
  const porchCategory = categories.find((c) => c.id === 'porch')

  const nonPorchGroups = nonPorchCategories
    .map((c) => ({ category: c, items: pois.filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length > 0)

  const porchItems = pois
    .filter((p) => p.category === 'porch')
    .sort((a, b) => (a.stage ?? 0) - (b.stage ?? 0))

  if (nonPorchGroups.length === 0 && porchItems.length === 0) {
    return (
      <p className="text-stone-600 bg-white border border-stone-200 rounded-lg p-6">
        No locations match the filters you have selected.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Amenities, Main Stage, VIP, Food, Parking, Restrooms, etc. */}
      {nonPorchGroups.map(({ category, items }) => (
        <section key={category.id} aria-labelledby={`${idPrefix}-group-${category.id}`}>
          <h3
            id={`${idPrefix}-group-${category.id}`}
            className="flex items-center gap-2 font-display uppercase tracking-wide text-ink mb-2"
          >
            <CategoryIcon
              category={category.id}
              className="w-5 h-5"
              style={{ color: `var(--color-cat-${category.id})` }}
            />
            {category.label}
          </h3>
          <ul className="space-y-2">
            {items.map((poi) => {
              const pinned = isWithinMap(poi.lat, poi.lon)
              const body = (
                <>
                  <span className="block font-semibold text-ink">{poi.name}</span>
                  {poi.where && (
                    <span className="block text-stone-700 text-sm mt-0.5">
                      {poi.where}
                    </span>
                  )}
                  {poi.blurb && (
                    <span className="block text-stone-600 text-sm mt-1 leading-relaxed">
                      {poi.blurb}
                    </span>
                  )}
                </>
              )
              return (
                <li key={poi.id}>
                  {pinned ? (
                    <button
                      type="button"
                      onClick={() => onSelect?.(poi.id)}
                      aria-current={selectedId === poi.id ? 'true' : undefined}
                      className={`w-full text-left rounded-lg border p-4 min-h-11 transition-colors ${
                        selectedId === poi.id
                          ? 'bg-pale border-flag'
                          : 'bg-white border-stone-200 hover:border-flag'
                      }`}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="rounded-lg border border-stone-200 bg-white p-4">
                      {body}
                      {poi.directions && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(poi.directions)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center min-h-11 mt-1 text-sm font-semibold text-flag underline underline-offset-2 hover:text-ink"
                        >
                          Driving directions →
                        </a>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {/* 2. Collapsible Porch Stages Section (Sorted numerically, no band blurbs) */}
      {porchCategory && porchItems.length > 0 && (
        <details
          className="group rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden print:open"
          aria-labelledby={`${idPrefix}-group-porch`}
        >
          <summary
            id={`${idPrefix}-group-porch`}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50 transition-colors select-none"
          >
            <div className="flex items-center gap-2.5 font-display uppercase tracking-wide text-ink font-bold text-base sm:text-lg">
              <CategoryIcon
                category="porch"
                className="w-5 h-5"
                style={{ color: 'var(--color-cat-porch)' }}
              />
              <span>Porch Stages ({porchItems.length})</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <span className="group-open:hidden">Tap to view stages</span>
              <span className="hidden group-open:inline">Tap to collapse</span>
              <span className="transform transition-transform duration-200 group-open:rotate-180 text-sm">
                ▼
              </span>
            </div>
          </summary>

          <div className="px-4 pb-4 pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 mb-3 italic">
              Sorted numerically by stage number. Tap any stage to center and view details on the map.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {porchItems.map((poi) => {
                const isSelected = selectedId === poi.id
                return (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => onSelect?.(poi.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`text-left rounded-lg border p-3 min-h-11 transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'bg-pale border-flag'
                        : 'bg-stone-50/60 border-stone-200 hover:border-flag'
                    }`}
                  >
                    {poi.stage != null && (
                      <span className="shrink-0 w-7 h-7 rounded-full bg-flag text-cream font-display font-bold text-xs flex items-center justify-center shadow-xs">
                        {poi.stage}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink text-sm truncate">
                        {poi.address || poi.name}
                      </span>
                      {poi.where && (
                        <span className="block text-stone-600 text-xs truncate">
                          {poi.where}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </details>
      )}
    </div>
  )
}
