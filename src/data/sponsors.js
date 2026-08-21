// 2026 sponsorship data — tiers, benefits, and the confirmed sponsor roster.
//
// Tiers and their benefits come from the DDA's official sponsorship sheet (the
// same one printed on the enjoysenoia.com event page); never invent a perk or a
// price here. Order is the ranking, richest first — the page renders tiers in
// array order and the roster is grouped the same way.
//
// The roster is reconciled against the Ticket Tailor "2026 Sponsorships" export
// (event 8121226). Only sponsors who answered **Yes** to "Would you like us to
// share your business info on our event website?" appear here — that consent
// question is the whole reason the column exists, so a sponsor who declines is
// silently omitted rather than listed without a link.
//
// Not every sponsor comes through that checkout. Some are relayed by the
// organizers after paying another way — BMW of South Atlanta, and (Aug 2026)
// Kim Peacock, Senoia Family Dentistry and Bella Medical, plus Bragassa's
// upgrade to Silver. Those have no Ticket Tailor row to reconcile against, so
// when a name here is missing from the export, check with the DDA rather than
// assuming it is stale and deleting it.
import bmwLogo from '../assets/sponsor-bmw-south-atlanta.webp'
import progressiveLogo from '../assets/sponsor-progressive-heating-air.webp'
import trunorthLogo from '../assets/sponsor-trunorth-pest.webp'
import peachtreeLogo from '../assets/sponsor-peachtree-omfs.webp'
import inspiredLogo from '../assets/sponsor-inspired-wealth-planning.webp'
import turinLogo from '../assets/sponsor-turin-pest.webp'
import roofKingLogo from '../assets/sponsor-roof-king-exteriors.webp'
import rbaLogo from '../assets/sponsor-renewal-by-andersen.webp'
import farmersMarketLogo from '../assets/sponsor-senoia-farmers-market.webp'
import senoiaDentistryLogo from '../assets/sponsor-senoia-family-dentistry.webp'
import andreoneLogo from '../assets/sponsor-andreone-chiropractic.webp'
import borgoLogo from '../assets/sponsor-borgo-italia.webp'
import aAbbyLogo from '../assets/sponsor-a-abby-group.webp'
import senoiaBicycleLogo from '../assets/sponsor-senoia-bicycle.webp'
import bragassaLogo from '../assets/sponsor-bragassa-orthodontics.webp'

export const SPONSOR_CHECKOUT =
  'https://www.tickettailor.com/checkout/new-session/id/8121226/chk/a9f6/?ref=website_widget&show_event_filter=false'

// Benefits as printed on the DDA sponsorship sheet. `featured` lifts the two
// top tiers onto navy so the page leads with what a big sponsor actually buys.
export const TIERS = [
  {
    name: 'Presenting Sponsor',
    price: '$5,000',
    featured: true,
    perks: [
      'Exclusive: only business name featured on event shirts',
      '10 complimentary event shirts',
      'VIP Luxury Lounge access for 10 guests',
      'Prime location for a sponsor tent',
      'Reserved table for 8 at the closing main concert',
    ],
  },
  {
    name: 'Title Sponsor',
    price: '$2,000',
    featured: true,
    perks: [
      'Primary logo treatment on event signage and banners',
      '4 tickets for VIP area admission',
      'Exclusive individual acknowledgement posts on Enjoy Senoia social media',
    ],
  },
  {
    name: 'Gold Sponsor',
    price: '$1,000',
    perks: [
      'Large logo treatment on event signage and banners',
      '2 tickets for VIP area admission',
      'Shared acknowledgement on Enjoy Senoia social media',
    ],
  },
  {
    name: 'Silver Sponsor',
    price: '$500',
    perks: [
      'Logo treatment on event signage and banners',
      'Shared acknowledgement on Enjoy Senoia social media',
    ],
  },
  {
    name: 'Porch Sponsor',
    price: '$200',
    perks: [
      'Sponsorship of an individual porch used as an event stage',
      'Signage with your business or family name at that porch',
      'Recognition in local and online advertising',
    ],
  },
  {
    name: "Kid's Corner Sponsor",
    price: '$200',
    perks: [
      "Logo placement on all signage and banners in the Kid's Corner",
      'Shared acknowledgement on Enjoy Senoia social media',
    ],
  },
]

// `url` is each sponsor's own site. Every link here was loaded and confirmed to
// be the right business (Aug 2026) — a wrong link on a page thanking a paying
// sponsor is worse than no link, so a business whose site could not be pinned
// down gets a name-only entry instead of a plausible guess.
//
// `dark: true` marks artwork that only exists as a reverse (light-ink) lockup,
// which its owner designed for a dark header and which would be invisible in a
// white cell. Those cells render on navy instead. The alternative — recolouring
// the mark ourselves — would mean inventing a version of someone else's
// trademark, so we show each logo on the background it was drawn for.
export const SPONSORS_2026 = [
  {
    tier: 'Presenting Sponsor',
    cell: 'h-32',
    sponsors: [
      {
        name: 'Peachtree Oral & Facial Surgery',
        logo: peachtreeLogo,
        w: 400,
        h: 136,
        url: 'https://www.peachtreeomfs.com/',
      },
    ],
  },
  {
    tier: 'Title Sponsors',
    cell: 'h-32',
    sponsors: [
      {
        name: 'BMW of South Atlanta',
        logo: bmwLogo,
        w: 400,
        h: 168,
        url: 'https://www.bmwofsouthatlanta.com/',
      },
      {
        name: 'Progressive Heating & Air',
        logo: progressiveLogo,
        w: 400,
        h: 217,
        url: 'https://progressiveac.com/',
      },
      {
        name: 'TruNorth Pest Control',
        logo: trunorthLogo,
        w: 265,
        h: 84,
        url: 'https://trunorthpest.com/',
      },
    ],
  },
  {
    tier: 'Gold Sponsors',
    cell: 'h-28',
    sponsors: [
      {
        name: 'Inspired Wealth Planning',
        logo: inspiredLogo,
        w: 400,
        h: 90,
        url: 'https://www.inspiredwealthplanning.com/',
        dark: true,
      },
      {
        name: 'Turin Pest Control',
        logo: turinLogo,
        w: 400,
        h: 400,
        url: 'https://turinpest.com/',
      },
      {
        name: 'Roof King + Exteriors',
        logo: roofKingLogo,
        w: 400,
        h: 400,
        url: 'https://roofkingexteriors.com/',
      },
    ],
  },
  {
    tier: 'Silver Sponsors',
    cell: 'h-28',
    sponsors: [
      {
        name: 'Renewal by Andersen',
        logo: rbaLogo,
        w: 400,
        h: 137,
        url: 'https://www.renewalbyandersen.com/locations/atlanta-ga',
      },
      // Upgraded from the $200 Kid's Corner tier to a $500 Silver sponsorship.
      // Listed once, at the tier they now hold — the Kid's Corner signage they
      // also asked about is physical signage at the event, not a second web
      // listing, and the same business appearing twice on a thank-you page
      // reads as a bug.
      {
        name: 'Bragassa Orthodontics',
        logo: bragassaLogo,
        w: 400,
        h: 117,
        url: 'https://www.bragassaorthodontics.com/',
      },
      // An individual sponsor rather than a business, so there is no logo or
      // site to link — the name-only fallback is exactly this case.
      { name: 'Kim Peacock' },
      // The sponsor is the Newnan office (8 Savannah St — Coweta County, and
      // registered federally as "Guiding Light Hospice SW, LLC"). Neither
      // findable site is confirmably that entity: guidinglighthospicega.com is
      // a Stockbridge practice ~45 miles away with a different phone number,
      // and glhospice.com is an unfinished starter template. Name-only until
      // the organizers confirm the right site and artwork.
      { name: 'Guiding Light Hospice' },
    ],
  },
  {
    tier: 'Porch Sponsors',
    cell: 'h-28',
    sponsors: [
      {
        name: "Senoia Farmers' Market",
        logo: farmersMarketLogo,
        w: 400,
        h: 400,
        url: 'https://www.senoiafarmersmarket.com/',
      },
      {
        name: 'Andreone Sports & Family Chiropractic',
        logo: andreoneLogo,
        w: 400,
        h: 364,
        url: 'https://www.andreone.com/',
      },
      {
        name: 'Borgo Italia',
        logo: borgoLogo,
        w: 400,
        h: 400,
        url: 'https://www.borgoitalia.us/',
        dark: true,
      },
      {
        name: 'A Abby Group',
        logo: aAbbyLogo,
        w: 400,
        h: 151,
        url: 'https://www.aabbygroup.com/',
      },
      {
        name: 'Senoia Bicycle',
        logo: senoiaBicycleLogo,
        w: 175,
        h: 165,
        url: 'https://www.senoiabicycle.com/',
        dark: true,
      },
      {
        name: 'Senoia Family Dentistry',
        logo: senoiaDentistryLogo,
        w: 400,
        h: 352,
        url: 'https://www.senoiadental.com/',
      },
      // "Bella Medical" matches two different practices and neither mentions
      // Senoia: Bella Medical Aesthetics, PC (Fayetteville / Peachtree City,
      // trading on both bellamedical.us and bellamedical.biz) and Ciao Bella
      // Medical Center and Spa (Newnan). Name-only until the organizers say
      // which one sponsored.
      { name: 'Bella Medical' },
      // Signed up as "Miss Dottie's" and asked whether we could feature their
      // Facebook page, so no website was supplied. The only "Miss Dottie's"
      // findable online is a gift shop in Gray, GA — ~90 miles from Senoia and
      // almost certainly a different business — so this stays a name-only entry
      // until the organizers confirm the right page and artwork.
      { name: "Miss Dottie's" },
    ],
  },
  // No Kid's Corner group: Bragassa moved up to Silver and nobody else holds
  // that tier yet. A group with an empty `sponsors` array would render a bare
  // heading over an empty grid, so the tier is omitted here entirely — it is
  // still offered for sale, and still listed in TIERS above.
]
