import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import TicketTailorWidget from '../components/TicketTailorWidget.jsx'
import usePageMeta from '../lib/usePageMeta.js'
// Tiers and the sponsorship checkout live with the rest of the sponsor data so
// /vip and /sponsors can never drift apart on price or tier list.
import { SPONSOR_CHECKOUT, TIERS } from '../data/sponsors.js'

// Recovered from the DDA's enjoysenoia.com PorchFest page before it was
// redirected here — the same Ticket Tailor event, still live: "Senoia
// Porchfest VIP Luxury Lounge" ($100).
export const VIP_CHECKOUT =
  'https://www.tickettailor.com/checkout/new-session/id/8805677/chk/b7e1318d779600a036aff27d81dd3e09/?ref=website_widget&show_event_filter=false'

// Perks as printed on the official VIP flyer.
const PERKS = [
  ['Live music', 'Kellar McCoy kicks off the lounge at 2:00pm'],
  ['All-American Southern table', 'Fried chicken, honey-baked ham and fixings'],
  ['Three adult beverage tickets', ''],
  ['VIP reserved parking', "In Maguire's lot, off Travis Street"],
  ['Private restroom access', 'Inside the market, 2:00–8:00pm'],
  ['PorchFest t-shirt', 'Plus a VIP commemorative badge'],
  ['Gift basket drawing', 'Each ticket has a chance to win a basket valued over $750'],
]

export default function Vip() {
  usePageMeta({
    title: 'VIP Luxury Lounge Tickets — $100 | Senoia PorchFest 2026',
    description:
      "VIP tickets for Senoia PorchFest 2026: the VIP Luxury Lounge sponsored by BMW of South Atlanta at the Senoia Farmers' Market — Southern table, drink tickets, reserved parking, PorchFest tee. $100, limited.",
    path: '/vip',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <header className="bg-ink text-cream px-6 pt-8 pb-10 text-center">
        <p className="font-script text-flag-bright text-3xl mb-1">Kick off PorchFest as a VIP</p>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold uppercase tracking-wide">
          VIP Luxury Lounge
        </h1>
        <p className="font-display uppercase tracking-widest text-pale/80 mt-2">
          Sponsored by BMW of South Atlanta
        </p>
        <p className="text-pale/90 mt-5 max-w-xl mx-auto">
          Sunday, September 6 &middot; doors at 2:00pm &middot; the Senoia Farmers&rsquo;
          Market, 40 Travis Street. <strong className="text-cream">$100 per ticket</strong>{' '}
          &mdash; limited tickets sold.
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <section aria-labelledby="buy" className="mb-12">
          <h2 id="buy" className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-flag pb-2 mb-4">
            Buy VIP Tickets
          </h2>
          <TicketTailorWidget checkoutUrl={VIP_CHECKOUT} />
        </section>

        <section aria-labelledby="perks" className="mb-12">
          <h2 id="perks" className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-flag pb-2 mb-4">
            Exclusive VIP Guests Receive
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PERKS.map(([title, detail]) => (
              <li key={title} className="bg-white rounded-lg border border-stone-200 p-4">
                <p className="font-semibold text-ink">{title}</p>
                {detail && <p className="text-stone-600 text-sm mt-0.5">{detail}</p>}
              </li>
            ))}
          </ul>
          <p className="text-stone-600 text-sm mt-4">
            The lounge is also a porch stage &mdash; Tim McGee plays at 4:00 and the Ashton
            Dooley Band at 7:00. Find it on the{' '}
            <Link to="/map?poi=vip" className="underline text-flag font-semibold">map</Link>.
          </p>
        </section>

        <section aria-labelledby="sponsor" className="mb-4">
          <h2 id="sponsor" className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-flag pb-2 mb-4">
            Become a 2026 Sponsor
          </h2>
          <p className="text-stone-700 mb-4 leading-relaxed">
            PorchFest is free for everyone because local businesses step up. Sponsorships
            are handled through the same secure checkout:
          </p>
          <ul className="flex flex-wrap gap-2 mb-5">
            {TIERS.map(({ name, price }) => (
              <li key={name} className="bg-white border border-stone-200 rounded-full px-4 py-1.5 text-sm">
                {/* The chips are a glance-able price list; the full benefits for
                    each tier live on /sponsors. */}
                <span className="font-semibold text-ink">{name.replace(/ Sponsor$/, '')}</span>{' '}
                <span className="text-stone-600">{price}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SPONSOR_CHECKOUT}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-ink hover:bg-flag text-cream font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
            >
              Sponsor PorchFest →
            </a>
            <Link
              to="/sponsors"
              className="font-display uppercase tracking-wider text-flag hover:text-flag-deep underline"
            >
              See tier benefits & our 2026 sponsors
            </Link>
          </div>
          <p className="text-stone-500 text-sm mt-4">
            Questions about sponsorship? Email{' '}
            <a className="underline" href="mailto:info@enjoysenoia.com">info@enjoysenoia.com</a>{' '}
            or call (770) 727-9173.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
