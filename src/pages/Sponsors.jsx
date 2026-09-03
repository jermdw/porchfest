import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { SPONSORS_2026, TIERS, SPONSOR_CHECKOUT } from '../data/sponsors.js'

export default function Sponsors() {
  usePageMeta({
    title: '2026 Sponsors | Senoia PorchFest',
    description:
      'Meet the businesses behind Senoia PorchFest 2026 — and join them. Presenting, Title, Gold, Silver, Porch and Kid’s Corner sponsorships keep PorchFest free for everyone.',
    path: '/sponsors',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      <header className="bg-ink text-cream px-6 pt-8 pb-10 text-center">
        <p className="font-script text-flag-bright text-3xl mb-1">Thank you to our sponsors</p>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold uppercase tracking-wide">
          2026 Sponsors
        </h1>
        <p className="text-pale/90 mt-5 max-w-2xl mx-auto">
          PorchFest is <strong className="text-cream">free for everyone</strong> because local
          businesses step up. These are the businesses putting music on Senoia&rsquo;s porches on
          Sunday, September 6 &mdash; please support the people who support the festival.
        </p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Tier rank is carried by scale, not by colour. Each tier gets a
            smaller heading, a fainter rule, and — the part that actually reads
            from across the page — a shorter cell in a denser grid, so a
            Presenting sponsor's logo is physically several times the size of a
            Porch sponsor's. Giving each tier its own colour was the obvious
            alternative and the wrong one: it would drag gold and silver into a
            navy/red/cream palette, and "Presenting" and "Porch" have no colour
            anyone would recognise anyway. One accent, varied in weight. */}
        {SPONSORS_2026.map(({ tier, cell, cols, heading, rule, sponsors }) => (
          <section key={tier} className="mb-10">
            <h2
              className={`font-display ${heading} uppercase tracking-wide text-flag border-b-2 ${rule} pb-1.5 mb-3`}
            >
              {tier}
            </h2>
            <ul className={`grid gap-4 ${cols}`}>
              {sponsors.map(({ name, logo, w, h, url, dark, note }) => (
                <li
                  key={name}
                  className={`rounded-xl border transition-colors ${cell} ${
                    dark ? 'bg-ink border-ink hover:border-flag' : 'bg-white border-stone-200 hover:border-flag'
                  }`}
                >
                  {/* Artwork and a confirmed link arrive independently, so the
                      two choices below are kept independent too: what fills the
                      cell, and whether the cell is a link. Deciding them
                      together previously meant a sponsor with a `url` but no
                      logo silently lost their link. */}
                  {(() => {
                    const inner = logo ? (
                      // Logos vary widely in aspect ratio; contain them in a
                      // fixed-height cell so the rows stay tidy. width/height
                      // carry the intrinsic ratio so the grid doesn't shift as
                      // they load — which is also what keeps lazy loading free
                      // of layout shift.
                      //
                      // These were eager on the argument that a lazy image which
                      // never intersects stays invisible. Measured on a 390 px
                      // phone, 32 of the 34 logos start below the fold and the
                      // grid pulls 530 kB up front — on the congested network
                      // outside the festival. Lazy images still load on scroll,
                      // and both Chrome and Safari force-load them before
                      // printing, so nothing is actually lost.
                      <img
                        src={logo}
                        alt={name}
                        width={w}
                        height={h}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                      />
                    ) : (
                      // No artwork yet — the name keeps the tier list accurate.
                      <span
                        className={`font-display uppercase tracking-wide ${dark ? 'text-cream' : 'text-ink'}`}
                      >
                        {name}
                      </span>
                    )
                    // `note` names the person behind a sponsorship the brand
                    // alone does not identify — an independent distributor, for
                    // instance. Rendered under whatever fills the cell, so it
                    // works for a logo entry as well as a name-only one.
                    const filled = note ? (
                      <span className="flex flex-col items-center gap-1">
                        {inner}
                        <span
                          className={`text-xs font-medium ${dark ? 'text-pale' : 'text-stone-600'}`}
                        >
                          {note}
                        </span>
                      </span>
                    ) : (
                      inner
                    )
                    // The whole cell is the target, not just the logo pixels — a
                    // wordmark with whitespace around it is frustrating to hit
                    // otherwise. Without a url there is no anchor at all, rather
                    // than an <a> with no href, which is a link that goes nowhere.
                    const box = `w-full h-full flex items-center justify-center p-4${logo ? '' : ' text-center'}`
                    return url ? (
                      <a href={url} target="_blank" rel="noreferrer" className={box}>
                        {filled}
                      </a>
                    ) : (
                      <div className={box}>{filled}</div>
                    )
                  })()}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <h2
          id="become-a-sponsor"
          className="font-display text-3xl uppercase tracking-wide text-ink border-b-2 border-flag pb-2 mt-14 mb-2"
        >
          Become a <span className="text-flag">Sponsor</span>
        </h2>
        <p className="text-stone-700 mb-6 leading-relaxed max-w-2xl">
          Put your business in front of the thousands of neighbours and visitors who spend the
          evening walking porch to porch through historic Senoia. Sponsorships support the Senoia
          Downtown Development Authority and keep admission free for every guest.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-6 ${
                t.featured ? 'bg-ink text-cream border-flag shadow-lg' : 'bg-white border-stone-200'
              }`}
            >
              <p
                className={`font-display text-xl uppercase tracking-wide ${
                  t.featured ? 'text-flag-bright' : 'text-ink'
                }`}
              >
                {t.name}
              </p>
              <p
                className={`font-display text-3xl mb-3 ${t.featured ? 'text-cream' : 'text-flag'}`}
              >
                {t.price}
              </p>
              <ul className={`space-y-1 text-sm ${t.featured ? 'text-pale/90' : 'text-stone-700'}`}>
                {t.perks.map((p) => (
                  <li key={p}>&bull; {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={SPONSOR_CHECKOUT}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-flag hover:bg-flag-deep text-cream font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
          >
            Sponsor PorchFest &rarr;
          </a>
          <p className="text-stone-600 text-sm mt-4">
            Sponsorships are handled through the same secure Ticket Tailor checkout as VIP tickets.
            Questions? Email{' '}
            <a className="underline" href="mailto:info@enjoysenoia.com">
              info@enjoysenoia.com
            </a>{' '}
            or call{' '}
            <a className="underline" href="tel:+17707279173">
              (770) 727-9173
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
