// 2026 sponsorship data — tiers, benefits, and the confirmed sponsor roster.
//
// Tiers and their benefits come from the DDA's official sponsorship sheet (the
// same one printed on the enjoysenoia.com event page); never invent a perk or a
// price here. Order is the ranking, richest first — the page renders tiers in
// array order and the roster is grouped the same way.
//
// **Consent gate.** A sponsor appears here only if they opted in to having
// their business info shared on the event website — that is the whole reason
// the sign-up asks. A sponsor who declines is omitted entirely rather than
// listed without a link, so don't add a name from some other source without
// checking that opt-in first.
//
// **Not every sponsor came through the online roster.** Several here are
// recorded only on the printed porch signs, or came straight from the
// organizers. A name missing from the online export is NOT evidence that it is
// stale — check with the DDA before removing anyone.
//
// Serrano Fine Tacos is a food vendor rather than a sponsor and is listed in
// `foodVendors.js` instead.
//
// This file is public. Sponsor payment records, order references and buyer
// contact details belong in the DDA's own systems, not in these comments —
// keep the notes here to what the page renders and why.
import bmwLogo from '../assets/sponsor-bmw-south-atlanta.webp'
import progressiveLogo from '../assets/sponsor-progressive-heating-air.webp'
import trunorthLogo from '../assets/sponsor-trunorth-pest.webp'
import peachtreeLogo from '../assets/sponsor-peachtree-omfs.webp'
import anytimeLogo from '../assets/sponsor-anytime-fitness.webp'
import inspiredLogo from '../assets/sponsor-inspired-wealth-planning.webp'
import turinLogo from '../assets/sponsor-turin-pest.webp'
import roofKingLogo from '../assets/sponsor-roof-king-exteriors.webp'
import rbaLogo from '../assets/sponsor-renewal-by-andersen.webp'
import kimPeacockLogo from '../assets/sponsor-kimberly-peacock.webp'
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
import guidingLightLogo from '../assets/sponsor-guiding-light-hospice.webp'
import missDottiesLogo from '../assets/sponsor-miss-dotties.webp'
import cowetaCharterLogo from '../assets/sponsor-coweta-charter-academy.webp'
import filmoresGarageLogo from '../assets/sponsor-filmores-garage.webp'
import crustCraftLogo from '../assets/sponsor-crust-and-craft.webp'
import maguiresLogo from '../assets/sponsor-maguires-irish-pub.webp'
import nicNormansLogo from '../assets/sponsor-nic-and-normans.webp'

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
//
// `cell` heights bumped one Tailwind step per tier (2026-08-26): several
// circular/seal-style logos (Roof King, Senoia Family Dentistry, Crust &
// Craft) ring a bold central mark with thin arc text, and `object-contain`
// bounds a square logo by the cell's *height* on both axes regardless of
// column width — so that ring text was shrinking well past legible. A uniform
// per-tier bump keeps the existing scale hierarchy intact (each tier is still
// strictly bigger than the one below it) while giving every logo more room,
// rather than special-casing box size for a few sponsors within one tier.
export const SPONSORS_2026 = [
  {
    tier: 'Presenting Sponsor',
    cell: 'h-48',
    cols: 'grid-cols-1 sm:grid-cols-2',
    heading: 'text-3xl',
    rule: 'border-flag',
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
  // Pulled out of Title Sponsors on its own (2026-08-26, per the organizers):
  // BMW
  // already carries naming rights on the VIP Luxury Lounge itself — see the
  // "sponsored by BMW of South Atlanta" copy on /vip and the landing page —
  // so this section header says so explicitly instead of leaving BMW to read
  // as one of three interchangeable Title Sponsors. Sits directly below the
  // true Presenting Sponsor (Peachtree) rather than at that same size/weight:
  // same cell/heading scale as Title Sponsors, just promoted to its own row.
  {
    tier: 'Presenting Sponsor of the VIP Luxury Lounge',
    cell: 'h-36',
    cols: 'grid-cols-1 sm:grid-cols-2',
    heading: 'text-2xl',
    rule: 'border-flag',
    sponsors: [
      {
        name: 'BMW of South Atlanta',
        logo: bmwLogo,
        w: 400,
        h: 168,
        url: 'https://www.bmwofsouthatlanta.com/',
      },
    ],
  },
  // Down to two sponsors now that BMW has its own section above — cols
  // dropped from a 3-up grid to match, same as every other 2-item group here.
  {
    tier: 'Title Sponsors',
    cell: 'h-36',
    cols: 'grid-cols-1 sm:grid-cols-2',
    heading: 'text-2xl',
    rule: 'border-flag',
    sponsors: [
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
    cell: 'h-32',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    heading: 'text-xl',
    rule: 'border-flag/50',
    sponsors: [
      // Added from the organizers, not a Ticket Tailor row. Unlike DoTerra
      // below, a franchise trades under the national brand mark, so the
      // corporate logo is the correct representation here — taken from Anytime
      // Fitness's own CDN (the SVG their site serves), not a logo-aggregator
      // site. The URL is the Senoia club specifically, confirmed by the DDA as
      // the sponsor; it read "Opening Soon" as of 2026-08-28.
      {
        name: 'Anytime Fitness',
        logo: anytimeLogo,
        w: 400,
        h: 107,
        url: 'https://www.anytimefitness.com/locations/senoia-georgia-5654',
      },
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
    cell: 'h-32',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    heading: 'text-lg',
    rule: 'border-flag/40',
    sponsors: [
      {
        name: 'Renewal by Andersen',
        logo: rbaLogo,
        w: 400,
        h: 137,
        url: 'https://www.renewalbyandersen.com/locations/atlanta-ga',
      },
      // Bragassa hold BOTH tiers; this was never an upgrade. They took the
      // Kid's Corner and Silver sponsorships separately, and the DDA confirmed
      // both (2026-08-22), so they appear twice — once under each tier. An
      // earlier version of this file listed them at Silver only, on the theory
      // that Silver superseded the Kid's Corner purchase. That was wrong; don't
      // collapse them back to one entry.
      {
        name: 'Bragassa Orthodontics',
        logo: bragassaLogo,
        w: 400,
        h: 117,
        url: 'https://www.bragassaorthodontics.com/',
      },
      // Signed up as "Kim Peacock"; the sponsor's own page and artwork both
      // brand her as Kimberly Peacock. The sponsor is the individual agent
      // rather than her brokerage, so this links her own page, not theirs —
      // don't "correct" it to the brokerage.
      //
      // Logo replaced 2026-08-25 with a wordmark supplied directly, trimmed to
      // content with a small border restored. It supersedes the original
      // artwork, which was a low-resolution crop.
      {
        name: 'Kimberly Peacock',
        logo: kimPeacockLogo,
        w: 400,
        h: 172,
        url: 'https://www.facebook.com/KimberlyPeacockRealtor/',
      },
      // The sponsor is the Newnan (Coweta County) office, and
      // guidinglighthospicega.com is confirmed to be theirs. An earlier note
      // here dismissed that domain as an unrelated Stockbridge practice and
      // left the entry unlinked — that was wrong, so don't unlink it again.
      // The site's service-area list omits Coweta, but that is a stale
      // marketing page rather than counter-evidence (it lists adjacent Fayette).
      //
      // Artwork is the horizontal transparent lockup from their own site
      // header, in preference to the stacked one the DDA holds on
      // enjoysenoia.com. At 3.1:1 it fills the full width of the cell, where
      // the 1.2:1 stacked version was held to 95px by its height — so the
      // wordmark reads at nearly twice the size, and the yellow "Hospice"
      // script (the weakest part of the mark against white) comes with it.
      {
        name: 'Guiding Light Hospice',
        logo: guidingLightLogo,
        w: 400,
        h: 130,
        url: 'https://www.guidinglighthospicega.com/',
      },
    ],
  },
  {
    tier: 'Porch Sponsors',
    cell: 'h-32',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    heading: 'text-lg',
    rule: 'border-flag/30',
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
      // The six below come from the printed porch signs rather than the online
      // roster — every one of those signs reads "This Stage Sponsored by:",
      // which is the Porch tier by definition. Artwork is lifted from the signs
      // themselves, so it matches what stands at the porch on the day.
      //
      // Three of them have no usable website of their own, so they link the
      // social account the business actually runs instead. Each was opened and
      // confirmed to be the right business, not just a name match. 4 Rivers
      // also runs a separate Senoia-location page, if the organizers would
      // rather point at the local shop than the brand account.
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
      // porch sign); the business trades online as Pollard Disposal, which is
      // why the name and the link don't match.
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
      // Signed up as "Miss Dottie's" with no website supplied. The only
      // "Miss Dottie's" findable online is a gift shop ~90 miles away, almost
      // certainly a different business, so this keeps its name and logo but
      // gets no anchor until the organizers confirm the right page.
      //
      // The artwork arrived as a Facebook profile picture: a white scalloped
      // circle sitting on that avatar's near-black backing. Dropped into a
      // white cell as supplied it would have rendered as a black square, so
      // the backing is flood-filled out to transparency from the corners and
      // the result trimmed to the circle. Only the surround is removed — the
      // black scallop outline and lettering inside the circle are untouched.
      {
        name: "Miss Dottie's",
        logo: missDottiesLogo,
        w: 383,
        h: 384,
      },
      // The sponsor is an independent doTERRA distributor, not doTERRA the
      // corporation — no website or logo of their own, so this stays name-only
      // rather than linking or bearing the corporate wordmark, which would
      // misattribute a global brand to a local seller.
      { name: 'DoTerra' },
      // Three Senoia restaurants added straight from the organizers, not from
      // a Ticket Tailor row — same gap-in-the-record situation as the six
      // porch-sign sponsors above.
      //
      // Crust & Craft and Nic & Norman's logos were supplied directly (their
      // own circular/oval badge art). Nic & Norman's arrived as a light mark
      // on a solid black square; the black is flood-filled to transparent
      // and trimmed to the oval so it sits on the white cell like every other
      // logo here, rather than carrying a black backing plate no other
      // sponsor has.
      {
        name: 'Crust & Craft',
        logo: crustCraftLogo,
        w: 400,
        h: 400,
        url: 'https://www.crustandcraftpizza.com/senoia',
      },
      {
        name: "Nic & Norman's",
        logo: nicNormansLogo,
        w: 400,
        h: 258,
        url: 'https://www.nicandnormans.com/senoia-ga',
      },
      // No logo was supplied for Maguire's, so this is pulled from their own
      // site (maguiresirishpub.com) rather than a submitted asset — a small
      // (200x83) source image, upscaled 2x rather than left native-size like
      // every other logo here.
      {
        name: "Maguire's Irish Pub",
        logo: maguiresLogo,
        w: 400,
        h: 166,
        url: 'https://maguiresirishpub.com/',
      },
      // Logo supplied directly, on a solid black square like the others above
      // — but here the black isn't packaging around a self-contained badge,
      // it's the design's actual background (no black in the artwork itself,
      // so a plain flood-fill-to-transparent was safe). `dark: true` because,
      // unlike Crust & Craft/Nic & Norman's/Maguire's, the remaining marks
      // (white wordmark, grey subtext) only read against a dark cell — same
      // treatment as Borgo Italia and Senoia Bicycle above.
      {
        name: "Filmore's Garage",
        logo: filmoresGarageLogo,
        w: 400,
        h: 212,
        url: 'https://www.filmoresgarage.com/',
        dark: true,
      },
    ],
  },
  // Kid's Corner sells for $200, the same as a Porch sponsorship, so it carries
  // exactly the same scale tokens. This page ranks tiers by how large the logo
  // renders, and equal price has to mean equal size or the ranking lies.
  {
    tier: "Kid's Corner Sponsors",
    cell: 'h-32',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    heading: 'text-lg',
    rule: 'border-flag/30',
    sponsors: [
      // Also listed under Silver above — see the note there for why both. React
      // keys are scoped to each group's own `sponsors.map`, so the repeated
      // name is not a key collision.
      {
        name: 'Bragassa Orthodontics',
        logo: bragassaLogo,
        w: 400,
        h: 117,
        url: 'https://www.bragassaorthodontics.com/',
      },
      // Added after the DDA flagged it as missing (2026-08-22) and confirmed
      // the Kid's Corner sponsorship. The link is the school's own domain,
      // confirmed with the organizers rather than assumed from a name match.
      //
      // Two lockups were supplied: this horizontal one and a circular seal.
      // The horizontal wins on the same grounds as everything else here — at
      // 1.9:1 trimmed it renders about 149px wide against the seal's 80px, and
      // the seal sets its wordmark in a curve that would be illegible at that
      // size. Their website carries only a third mark, a 256px round crest,
      // which is both too small and a different lockup again.
      {
        name: 'Coweta Charter Academy',
        logo: cowetaCharterLogo,
        w: 400,
        h: 215,
        url: 'https://www.cowetacharteracademy.org/',
      },
    ],
  },
]
