import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { PHOTOS, GALLERY_YEAR } from '../data/gallery.js'

// Tiles are a fixed 4:3 crop with object-cover, so the grid's height is known
// before a single image arrives. That is what keeps twenty lazy-loaded photos
// from reflowing the page as they land — not the per-image width/height, which
// most photos here won't carry.
function Tile({ photo, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 border border-stone-200 hover:border-flag focus:outline-none focus-visible:ring-2 focus-visible:ring-flag focus-visible:ring-offset-2 focus-visible:ring-offset-cream transition-colors"
      aria-label={`View photo: ${photo.alt}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </button>
  )
}

function Lightbox({ photos, index, onClose, onStep }) {
  const photo = photos[index]

  // Escape to close and arrows to step are how people expect a lightbox to
  // behave, and without them a keyboard user has no way out of it at all.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    // The page behind must not scroll under the overlay on touch.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.alt}
      className="fixed inset-0 z-50 bg-ink flex flex-col"
      onClick={onClose}
    >
      <div className="flex justify-between items-center px-4 py-3 text-cream shrink-0">
        <span className="font-display uppercase tracking-wide text-sm text-pale/80">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-display uppercase tracking-wide px-3 py-2 hover:text-flag-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-flag-bright rounded"
        >
          Close ✕
        </button>
      </div>

      {/* Stop clicks on the image itself from closing — only the backdrop and
          the Close button should. */}
      <figure
        className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          className="min-h-0 max-w-full max-h-full object-contain rounded-lg"
        />
        {(photo.caption || photo.credit) && (
          <figcaption className="text-center mt-3 shrink-0">
            {photo.caption && <p className="text-cream">{photo.caption}</p>}
            {photo.credit && <p className="text-pale/70 text-sm mt-0.5">{photo.credit}</p>}
          </figcaption>
        )}
      </figure>

      {photos.length > 1 && (
        <div
          className="flex justify-center gap-4 pb-6 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onStep(-1)}
            className="font-display uppercase tracking-wide text-cream border border-pale/40 rounded px-5 py-2 hover:border-flag-bright hover:text-flag-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-flag-bright"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            className="font-display uppercase tracking-wide text-cream border border-pale/40 rounded px-5 py-2 hover:border-flag-bright hover:text-flag-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-flag-bright"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default function Gallery() {
  usePageMeta({
    title: `${GALLERY_YEAR} Photo Gallery | Senoia PorchFest`,
    description: `Highlights from Senoia PorchFest ${GALLERY_YEAR} — a day of live music on the porches of historic Senoia, Georgia.`,
    path: '/photos',
    // An empty gallery is not worth indexing, and a "check back soon" page in
    // search results is worse than no result at all. This flips itself the
    // moment the first photo is added, so there is nothing to remember —
    // but the nav link and the sitemap entry are still manual (see
    // playbook 02 → Content pages).
    noindex: PHOTOS.length === 0,
  })

  const [openIndex, setOpenIndex] = useState(null)

  // Wrapping keeps the arrow keys usable without dead ends at either end.
  const step = useCallback(
    (delta) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + PHOTOS.length) % PHOTOS.length)),
    [],
  )
  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      <header className="bg-ink text-cream px-6 pt-8 pb-10 text-center">
        <p className="font-script text-flag-bright text-3xl mb-1">That&rsquo;s a wrap</p>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold uppercase tracking-wide">
          {GALLERY_YEAR} Highlights
        </h1>
        <p className="text-pale/90 mt-5 max-w-2xl mx-auto">
          Ten hours of music on the porches of historic Senoia. Thank you to every host,
          performer, sponsor and volunteer who made it happen.
        </p>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {PHOTOS.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-600">
              Photos from this year are on their way — check back soon.
            </p>
            <p className="text-stone-600 text-sm mt-4">
              In the meantime, the{' '}
              <Link to="/schedule" className="underline font-semibold text-flag hover:text-flag-deep">
                full {GALLERY_YEAR} lineup
              </Link>{' '}
              and the{' '}
              <Link to="/map" className="underline font-semibold text-flag hover:text-flag-deep">
                festival map
              </Link>{' '}
              are still up.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {PHOTOS.map((photo, i) => (
                <li key={photo.src}>
                  <Tile photo={photo} index={i} onOpen={setOpenIndex} />
                </li>
              ))}
            </ul>
            <p className="text-stone-600 text-sm mt-8 text-center">
              Relive the day with the{' '}
              <Link to="/schedule" className="underline font-semibold text-flag hover:text-flag-deep">
                {GALLERY_YEAR} lineup
              </Link>{' '}
              and the{' '}
              <Link to="/map" className="underline font-semibold text-flag hover:text-flag-deep">
                festival map
              </Link>
              .
            </p>
          </>
        )}
      </main>

      {openIndex !== null && (
        <Lightbox photos={PHOTOS} index={openIndex} onClose={close} onStep={step} />
      )}

      <SiteFooter />
    </div>
  )
}
