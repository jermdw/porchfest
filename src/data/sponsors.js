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
// Kim Peacock, Senoia Family Dentistry and Bella Medical Aesthetics, plus Bragassa's
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
import bellaMedicalLogo from '../assets/sponsor-bella-medical-aesthetics.webp'
import fourRiversLogo from '../assets/sponsor-4-rivers-antiques.webp'
import knifeStoneLogo from '../assets/sponsor-knife-and-stone.webp'
import mahaffeyLinkousLogo from '../assets/sponsor-mahaffey-linkous-orthodontics.webp'
import pollardLogo from '../assets/sponsor-pollard-waste.webp'
import senoiaCoffeeLogo from '../assets/sponsor-senoia-coffee.webp'
import vaultedVintageLogo from '../assets/sponsor-vaulted-vintage.webp'
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

// `url` is wherever that sponsor actually lives online — their own site where
// they have one, otherwise the social account they run (several of these
// businesses own a domain that is only a parked "Launching Soon" page, which is
// worse than no link). Every link here was opened and confirmed to be the right
// business, not just a name match (Aug 2026): a wrong link on a page thanking a
// paying sponsor is worse than no link, so a business that could not be pinned
// down keeps its name — and its logo, if we have one — but gets no anchor
// rather than a plausible guess.
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
      // Signed up as "Bella Medical"; the organizers confirmed this is Bella
      // Medical Aesthetics, PC (not the similarly named Ciao Bella Medical
      // Center and Spa in Newnan). They run two live sites for the same
      // practice — bellamedical.us (Fayetteville) and bellamedical.biz
      // (Peachtree City), same phone and same social accounts. Linking .us:
      // it is the better-maintained of the two, where .biz still carries a
      // (999) 999-9999 placeholder.
      //
      // Artwork is the wordmark from their printed porch sign, not the one on
      // their website: the web version carries a long tagline that makes it
      // ~4.4:1, which shrinks to near-unreadable inside a fixed-height cell.
      // The sign lockup is ~2:1 and renders about three times larger.
      {
        name: 'Bella Medical Aesthetics',
        logo: bellaMedicalLogo,
        w: 400,
        h: 199,
        url: 'https://bellamedical.us/',
      },
      // The six below were found in the printed porch signs
      // (~/Downloads/PorchFest_Sponsor_Signs, Aug 2026) rather than in any
      // Ticket Tailor row — every one of those signs reads "This Stage
      // Sponsored by:", which is the Porch tier by definition. Artwork is
      // lifted from the signs themselves, so it matches what stands at the
      // porch on the day.
      //
      // Three of them have no website to link, so they point at the social
      // account they actually run instead. Each was opened and confirmed to be
      // the right business, not just a name match:
      //   4 Rivers Antiques — @4riversantiques, the brand account (2.5k
      //     followers, bio address is their Fayetteville store). They also have
      //     a Senoia-location page at facebook.com/p/4-Rivers-Senoia-61576654692937
      //     if the organizers would rather point at the local shop.
      //   Knife & Stone — a managed Facebook Page, 4.7k followers, 30 Perry St.
      //     Their knifeandstone.com is a GoDaddy "Launching Soon" parking page.
      //   Vaulted Vintage — @vaulted_vtg; the bio's Wed–Sat 10–6 matches the
      //     28 Main St shop. vaultedvintage.com is also parked.
      {
        name: '4 Rivers Antiques',
        logo: fourRiversLogo,
        w: 400,
        h: 254,
        url: 'https://www.instagram.com/4riversantiques/',
      },
      {
        name: 'Knife & Stone',
        logo: knifeStoneLogo,
        w: 400,
        h: 229,
        url: 'https://www.facebook.com/knifeandstonenewnan/',
      },
      {
        name: 'Mahaffey Linkous Orthodontics',
        logo: mahaffeyLinkousLogo,
        w: 400,
        h: 55,
        url: 'https://peachtreecitybraces.com/',
      },
      // Sponsored under "Pollard Residential Waste Services" (the name on their
      // porch sign); the business trades online as Pollard Disposal. Their only
      // Facebook presence is an auto-generated "Unofficial Page" with zero
      // followers — that page is what surfaced the real site.
      {
        name: 'Pollard Residential Waste Services',
        logo: pollardLogo,
        w: 400,
        h: 174,
        url: 'https://www.pollarddisposal.com/',
      },
      {
        name: 'Senoia Coffee',
        logo: senoiaCoffeeLogo,
        w: 400,
        h: 400,
        url: 'https://senoiacoffeecafe.com/',
      },
      {
        name: 'Vaulted Vintage',
        logo: vaultedVintageLogo,
        w: 400,
        h: 399,
        url: 'https://www.instagram.com/vaulted_vtg/',
      },
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
