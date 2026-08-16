import { useEffect, useRef, useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import Panzoom from '@panzoom/panzoom'
import CategoryIcon from './CategoryIcon.jsx'
import PinPeekCard from './PinPeekCard.jsx'
import { toPercent, isWithinMap, ATTRIBUTION } from '../lib/venueGeo.js'
import { isPoiActiveInSlot } from '../lib/showTime.js'

const BASE_MAP = '/venue-base-2026-web.webp'
const MIN_SCALE = 1
const MAX_SCALE = 6

export default function MapCanvas({
  pois,
  categories,
  activeCategories,
  selectedId,
  onSelect,
  activeTimeSlot = 'all',
}) {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const panzoomRef = useRef(null)
  const pinRefs = useRef({})
  const [scale, setScale] = useState(1)

  // Geolocation state
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationToast, setLocationToast] = useState(null)
  const [showTouchHint, setShowTouchHint] = useState(false)
  const touchHintTimer = useRef(null)

  const selectedPoi = pois.find((p) => p.id === selectedId) || null

  // Gate on isWithinMap, not merely on having coordinates
  const placed = pois
    .filter((p) => isWithinMap(p.lat, p.lon))
    .map((p) => ({ poi: p, pos: toPercent(p.lat, p.lon) }))

  // Pin fan-out for items sharing exact coordinates (e.g. first aid and merch tent at Pylant & Gin)
  const FAN_RADIUS_PX = 11
  const groups = new Map()
  placed.forEach((p) => {
    const key = `${p.pos.x.toFixed(4)},${p.pos.y.toFixed(4)}`
    const g = groups.get(key)
    if (g) g.push(p)
    else groups.set(key, [p])
  })
  groups.forEach((members) => {
    if (members.length < 2) return
    members.forEach((m, i) => {
      const angle = (i / members.length) * 2 * Math.PI - Math.PI / 2
      m.fan = {
        dx: Math.cos(angle) * FAN_RADIUS_PX,
        dy: Math.sin(angle) * FAN_RADIUS_PX,
      }
    })
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const pz = Panzoom(stage, {
      minScale: MIN_SCALE,
      maxScale: MAX_SCALE,
      contain: 'outside',
      excludeClass: 'map-pin',
      touchAction: 'pan-y', // Lets the browser handle natural vertical page scrolling
      setTransform: (elem, { scale: s, x, y }) => {
        elem.style.transform = `scale(${s}) translate(${x}px, ${y}px)`
        setScale(s)
      },
    })
    panzoomRef.current = pz
    const parent = stage.parentElement
    const onWheel = (e) => pz.zoomWithWheel(e)
    parent.addEventListener('wheel', onWheel)

    const onBeforePrint = () => flushSync(() => pz.reset({ animate: false }))
    window.addEventListener('beforeprint', onBeforePrint)

    return () => {
      parent.removeEventListener('wheel', onWheel)
      window.removeEventListener('beforeprint', onBeforePrint)
      pz.destroy()
    }
  }, [])

  const centerOn = useCallback((id) => {
    const pz = panzoomRef.current
    const pin = pinRefs.current[id]
    const container = containerRef.current
    if (!pz || !pin || !container) return
    const c = container.getBoundingClientRect()
    const p = pin.getBoundingClientRect()
    if (!p.width || !p.height) return
    const dx = c.left + c.width / 2 - (p.left + p.width / 2)
    const dy = c.top + c.height / 2 - (p.top + p.height / 2)
    const cur = pz.getPan()
    const s = pz.getScale()
    pz.pan(cur.x + dx / s, cur.y + dy / s, { animate: false })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const raf = requestAnimationFrame(() => centerOn(selectedId))
    return () => cancelAnimationFrame(raf)
  }, [selectedId, centerOn])

  const zoomBy = (factor) => {
    const pz = panzoomRef.current
    if (pz) pz.zoom(Math.min(MAX_SCALE, Math.max(MIN_SCALE, pz.getScale() * factor)), { animate: true })
  }
  const reset = () => panzoomRef.current?.reset({ animate: true })

  // GPS "Locate Me" handler
  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationToast('Geolocation is not supported by your browser.')
      setTimeout(() => setLocationToast(null), 3500)
      return
    }

    setLocating(true)
    setLocationToast(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const { latitude, longitude } = pos.coords
        if (isWithinMap(latitude, longitude)) {
          const coords = toPercent(latitude, longitude)
          setUserPos(coords)
          setLocationToast('Location found inside festival area!')
          setTimeout(() => setLocationToast(null), 3000)

          // Pan to user
          const pz = panzoomRef.current
          const container = containerRef.current
          if (pz && container) {
            const c = container.getBoundingClientRect()
            const cur = pz.getPan()
            const s = pz.getScale()
            const targetX = (coords.x / 100) * c.width
            const targetY = (coords.y / 100) * c.height
            const dx = c.width / 2 - targetX
            const dy = c.height / 2 - targetY
            pz.pan(cur.x + dx / s, cur.y + dy / s, { animate: true })
          }
        } else {
          setLocationToast('You appear to be outside the historic Senoia festival area.')
          setTimeout(() => setLocationToast(null), 4000)
        }
      },
      () => {
        setLocating(false)
        setLocationToast('Unable to retrieve your location. Check location permissions.')
        setTimeout(() => setLocationToast(null), 4000)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    )
  }

  // Handle single finger touch gesture hint on mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && scale === 1) {
      if (touchHintTimer.current) clearTimeout(touchHintTimer.current)
      setShowTouchHint(true)
      touchHintTimer.current = setTimeout(() => setShowTouchHint(false), 2200)
    }
  }

  const labelFor = (poi) => {
    const cat = categories.find((c) => c.id === poi.category)
    return `${poi.name}${poi.where ? `, ${poi.where}` : ''}${cat ? ` — ${cat.label}` : ''}`
  }

  return (
    <figure className="mb-4">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        className="relative overflow-hidden rounded-xl border border-stone-200 bg-white aspect-[1478/1339] select-none"
      >
        <div ref={stageRef} className="relative w-full h-full origin-center">
          <img
            src={BASE_MAP}
            alt="Street map of historic Senoia showing Main Street and the surrounding PorchFest neighborhoods."
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable="false"
          />

          {/* User Location Pulsing Dot */}
          {userPos && (
            <div
              className="absolute z-25 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
              aria-label="Your location"
            >
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-600 border-2 border-white shadow-xl items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </span>
              </span>
            </div>
          )}

          {placed.map(({ poi, pos, fan }) => {
            const isSelected = poi.id === selectedId
            const isActiveCategory = activeCategories.includes(poi.category)
            const isSlotActive = isPoiActiveInSlot(poi, activeTimeSlot)
            const isDimmed = activeTimeSlot !== 'all' && !isSlotActive

            return (
              <button
                key={poi.id}
                ref={(el) => {
                  pinRefs.current[poi.id] = el
                }}
                type="button"
                onClick={() => onSelect?.(poi.id)}
                aria-label={labelFor(poi)}
                aria-current={isSelected ? 'true' : undefined}
                aria-hidden={!isActiveCategory}
                tabIndex={isActiveCategory ? undefined : -1}
                className={`map-pin absolute items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 shadow-md transition-all print:flex ${
                  isActiveCategory ? 'flex' : 'hidden'
                } ${isDimmed ? 'opacity-35 scale-90' : 'opacity-100'} ${
                  isSlotActive && activeTimeSlot !== 'all' && poi.category === 'porch'
                    ? 'ring-2 ring-flag ring-offset-1'
                    : ''
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) translate(${(fan?.dx ?? 0) / scale}px, ${
                    (fan?.dy ?? 0) / scale
                  }px) scale(${1 / scale})`,
                  zIndex: isSelected ? 25 : isSlotActive ? 15 : 10,
                  backgroundColor: isSelected
                    ? 'var(--color-star)'
                    : `var(--color-cat-${poi.category}, var(--color-ink))`,
                  borderColor: isSelected ? 'var(--color-ink)' : 'var(--color-cream)',
                  color: isSelected ? 'var(--color-ink)' : 'var(--color-cream)',
                }}
              >
                {poi.category === 'porch' && poi.stage != null ? (
                  <span className="font-display font-semibold text-sm sm:text-base leading-none">
                    {poi.stage}
                  </span>
                ) : (
                  <CategoryIcon category={poi.category} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            )
          })}
        </div>

        {/* Floating Pin Peek Sheet (Eliminates Pogo-Sticking) */}
        {selectedPoi && (
          <PinPeekCard
            poi={selectedPoi}
            onClose={() => onSelect(null)}
            activeTimeSlot={activeTimeSlot}
          />
        )}

        {/* Relocated Map Controls (Top Left to keep Seavy St East porches clear) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 print:hidden z-20">
          <button
            type="button"
            onClick={() => zoomBy(1.5)}
            aria-label="Zoom in"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-ink/90 hover:bg-ink text-cream font-display text-xl leading-none shadow-md backdrop-blur flex items-center justify-center transition-colors"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.5)}
            aria-label="Zoom out"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-ink/90 hover:bg-ink text-cream font-display text-xl leading-none shadow-md backdrop-blur flex items-center justify-center transition-colors"
          >
            −
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset map view"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-ink/90 hover:bg-ink text-cream font-display text-[10px] uppercase tracking-wider shadow-md backdrop-blur flex items-center justify-center transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={locateUser}
            disabled={locating}
            aria-label="Find my location"
            title="Find my location"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-display text-xs uppercase shadow-md backdrop-blur flex items-center justify-center transition-colors ${
              userPos
                ? 'bg-sky-600 text-white'
                : locating
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-ink/90 hover:bg-ink text-cream'
            }`}
          >
            {locating ? '...' : '📍'}
          </button>
        </div>

        {/* Geolocation & Touch Hints Toast */}
        {(locationToast || showTouchHint) && (
          <div className="absolute top-3 right-3 left-16 sm:left-20 pointer-events-none z-20 transition-all">
            <div className="bg-ink/90 text-cream text-xs px-3 py-2 rounded-lg shadow-lg border border-pale/20 backdrop-blur text-center animate-in fade-in">
              {locationToast || '💡 Tip: Use two fingers to pinch & zoom map'}
            </div>
          </div>
        )}
      </div>

      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-stone-600">
        <span>
          {placed.length} of {pois.length} locations pinned — the rest are listed under Find Your Way.
        </span>
        <span>{ATTRIBUTION}</span>
      </figcaption>
    </figure>
  )
}
