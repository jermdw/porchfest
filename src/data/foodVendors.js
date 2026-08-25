import kettleworksLogo from '../assets/vendor-kettleworks.webp'
import madGreekLogo from '../assets/vendor-mad-greek.webp'
import littleMissJuicyLogo from '../assets/vendor-little-miss-juicy.webp'
import bigDaddysLogo from '../assets/vendor-big-daddys-peanuts.webp'
import southernLocalNutsLogo from '../assets/vendor-southern-local-nuts.webp'
import perroLogo from '../assets/vendor-mr-perro-atl.webp'
import oystersLogo from '../assets/vendor-oysters-co.webp'
import senoiaPizzaLogo from '../assets/vendor-senoia-pizza-co.webp'
import serranoLogo from '../assets/vendor-serrano-fine-tacos.webp'
import pinchosLogo from '../assets/vendor-pinchos-factory.webp'

// The 2026 food, drink and snack vendors, reconciled from the "Senoia PorchFest
// Food/Drink/Art 2026" registrations in Ticket Tailor (`ev_8472588`) on
// 2026-08-23. Ordered by ticket type, then alphabetically.
//
// **This is the registered roster, not a closed list.** Unlike the car show, no
// coordinator list exists to check it against, and we already know registrations
// undercount: three car show vendors paid by check and never appeared in Ticket
// Tailor at all. Treat a vendor missing from here as unconfirmed, not absent, and
// re-check with the food truck coordinator before calling the list complete.
//
// Identifying who each buyer *is* takes work: the PorchFest checkout form asks
// only for contact details and a text-message opt-in — no business name, and not
// even the menu description the car show form collects. Every name below is read
// off the buyer's own email address (e.g. `themadgreekfood@` → The Mad Greek). One
// 2026 registrant, a Food Truck buyer whose address carries no business name, could
// not be identified and is deliberately omitted rather than guessed — see the PR.
//
// Domain-guessing is a trap here and cost real time: `pinchosfactory.com` is a
// restaurant in Puerto Rico and `socialsugar.com` is an unrelated Substack, so
// neither is linked. A `url` appears only where the site was confirmed to be this
// vendor. `logo` and `url` are independent, exactly as on /sponsors.
//
// Three more logos (2026-08-23): Mr. Perro ATL and Senoia Pizza Company have
// only a Facebook page, so their logo is their profile picture and they stay
// unlinked; Oysters Co has a real site and Executive Chef Christopher Murphy
// matches the registrant exactly (`cmurphy@oystersco.com`). High on the Hog,
// Social Sugar and The Local turned up no confirmable match — several
// same-named businesses exist nationally and guessing which one is this vendor
// isn't safe without asking the food truck coordinator.
//
// Lisa's Creperie pulled out of the event (2026-08-25) and is removed below.
//
// Serrano Fine Tacos (2026-08-25): paid for a Porch Sponsorship by mistake —
// they're a food vendor, not a sponsor (see /sponsors) — so they move here
// instead. Not in the ev_8472588 export above; the food truck coordinator
// (Valerie Kinney) emailed the logo directly asking for it on the site. Reuses
// the sponsor-grid crop (same 2.4:1 crop, no `dark` flag needed) rather than
// the freshly emailed JPG.
//
// Pinchos Factory (2026-08-25): an earlier note here dismissed their Instagram
// avatar as "a personal photo, not a wordmark" and kept a placeholder. That
// was a different image — Javier Torres (owner) then emailed an actual circle
// badge logo via Valerie, trimmed tight to the badge. No confirmed site or
// social handle, so it stays unlinked; `pinchosfactory.com` is unrelated (see
// above).
export const FOOD_VENDORS_2026 = [
  // ---- Food trucks ---------------------------------------------------------
  { name: 'High on the Hog' },
  { name: 'Little Miss Juicy', logo: littleMissJuicyLogo, w: 290, h: 290, url: 'https://linktr.ee/littlemissjuicy' },
  { name: 'Mr. Perro ATL', logo: perroLogo, w: 400, h: 400 },
  { name: 'Oysters Co', logo: oystersLogo, w: 400, h: 89, url: 'http://www.oystersco.com/' },
  { name: 'Pinchos Factory', logo: pinchosLogo, w: 400, h: 402 },
  { name: 'Senoia Pizza Company', logo: senoiaPizzaLogo, w: 400, h: 400 },
  { name: 'Serrano Fine Tacos', logo: serranoLogo, w: 400, h: 166, url: 'https://www.instagram.com/serranofinetacos/' },
  { name: 'The Mad Greek', logo: madGreekLogo, w: 315, h: 315, url: 'https://www.themadgreekfood.com/' },

  // ---- Food & drink stands -------------------------------------------------
  { name: "Big Daddy's Peanuts", logo: bigDaddysLogo, w: 400, h: 273, url: 'https://bigdaddyspeanuts.com/' },
  // The Newnan, GA business — its logo prints "NEWNAN, GA / EST. 2015". A
  // same-named business trades in Brent, AL and the registrant's address reads
  // `kettleworksal@`, so don't "correct" this to the Alabama one without asking.
  { name: 'Kettleworks', logo: kettleworksLogo, w: 400, h: 363 },
  { name: 'Social Sugar' },
  // `dark`: the artwork is white type on a baked-in navy square, so it needs the
  // ink cell the sponsor grid uses for the same problem — on white it reads as a
  // floating block rather than a logo.
  { name: 'Southern Local Nuts', logo: southernLocalNutsLogo, w: 250, h: 250, url: 'https://southernlocalnuts.com/', dark: true },
  { name: 'The Local' },
]
