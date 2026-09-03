import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { FOOD_VENDORS_2026 } from '../data/foodVendors.js'

export default function Vendors() {
  usePageMeta({
    title: 'Food & Drink Vendors | Senoia PorchFest',
    description:
      'The food trucks, drink and snack vendors serving Senoia PorchFest 2026 on Sunday, September 6 — find them in Food Truck Alley on Gin Street.',
    path: '/vendors',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      <header className="bg-ink text-cream px-6 pt-8 pb-10 text-center">
        <p className="font-script text-flag-bright text-3xl mb-1">Come hungry</p>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold uppercase tracking-wide">
          Food &amp; Drink
        </h1>
        <p className="text-pale/90 mt-5 max-w-2xl mx-auto">
          Ten hours of music needs feeding. These vendors are set up along{' '}
          <strong className="text-cream">Food Truck Alley</strong> on Gin Street between Main and
          Pylant, plus stands scattered through the festival.
        </p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {FOOD_VENDORS_2026.map(({ name, logo, w, h, url, dark }) => (
            <li
              key={name}
              className={`rounded-xl border transition-colors h-32 ${
                dark ? 'bg-ink border-ink hover:border-flag' : 'bg-white border-stone-200 hover:border-flag'
              }`}
            >
              {/* Same three cases as the sponsor grid, and the same reasons —
                  artwork and a confirmed website rarely arrive together for a
                  food truck. The only difference is the third case: rather than
                  bare text, a vendor with no artwork yet gets a plain bordered
                  wordmark, so every cell reads as a logo cell and the roster
                  doesn't look half-finished. It's drawn in markup, not shipped
                  as an image, so it stays sharp at any DPI and costs no bytes —
                  swapping in real artwork is just adding logo/w/h in
                  `src/data/foodVendors.js`. */}
              {logo ? (
                (() => {
                  const art = (
                    <img
                      src={logo}
                      alt={name}
                      width={w}
                      height={h}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  )
                  const box = 'w-full h-full flex items-center justify-center p-4'
                  return url ? (
                    <a href={url} target="_blank" rel="noreferrer" className={box}>
                      {art}
                    </a>
                  ) : (
                    <div className={box}>{art}</div>
                  )
                })()
              ) : (
                <div className="w-full h-full flex items-center justify-center p-3">
                  <span className="w-full border border-ink bg-white px-2 py-3 text-center font-display uppercase tracking-wide text-ink text-sm leading-tight">
                    {name}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="text-stone-600 text-sm mt-6">
          Find them on the{' '}
          <a className="underline font-semibold" href="/map?poi=food-trucks">
            day-of map
          </a>
          . This is the list as vendors register — if you&rsquo;re expecting someone who
          isn&rsquo;t here yet, they may still be finishing their paperwork.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
