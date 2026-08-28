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
import hogLogo from '../assets/vendor-high-on-the-hog.webp'
import socialSugarLogo from '../assets/vendor-social-sugar.webp'
import theLocalLogo from '../assets/vendor-the-local-nutrition.webp'

// The 2026 food, drink and snack vendors, reconciled from the PorchFest
// food/drink/art registrations on 2026-08-23. Ordered by ticket type, then
// alphabetically.
//
// **This is the registered roster, not a closed list.** Unlike the car show, no
// coordinator list exists to check it against, and registrations are known to
// undercount — vendors who pay by check can miss the online export entirely.
// Treat a vendor missing from here as unconfirmed, not absent, and re-check
// with the food truck coordinator before calling the list complete.
//
// Working out which business each registration belongs to takes real effort:
// the checkout form collects contact details only — no business name, and not
// even the menu description the car show form collects. Where a registration
// could not be matched to a business with confidence, it is deliberately
// omitted rather than guessed at.
//
// Domain-guessing is a trap here and cost real time: `pinchosfactory.com` is a
// restaurant in Puerto Rico and `socialsugar.com` is an unrelated Substack, so
// neither is linked. A `url` appears only where the site was confirmed to be this
// vendor. `logo` and `url` are independent, exactly as on /sponsors.
//
// Three more logos (2026-08-23): Mr. Perro ATL and Senoia Pizza Company have
// only a Facebook page, so their logo is their profile picture and they stay
// unlinked; Oysters Co has a real site, confirmed against the registration.
// High on the Hog, Social Sugar and The Local turned up no confirmable match —
// several same-named businesses exist nationally, and guessing which one is
// this vendor isn't safe without asking the food truck coordinator.
//
// Lisa's Creperie pulled out of the event (2026-08-25) and is removed below.
//
// Serrano Fine Tacos (2026-08-25) belongs here rather than on /sponsors —
// they are a food vendor, not a sponsor. Reuses the sponsor-grid crop (same
// 2.4:1 crop, no `dark` flag needed) rather than the later emailed JPG.
//
// Pinchos Factory (2026-08-25): an earlier note here dismissed their Instagram
// avatar as "a personal photo, not a wordmark" and kept a placeholder. That
// was a different image — the business later supplied an actual circle badge
// logo, trimmed tight to the badge. No confirmed site or social handle, so it
// stays unlinked; `pinchosfactory.com` is unrelated (see above).
//
// High on the Hog, Social Sugar and The Local (2026-08-26): logos supplied
// directly, filling in the three placeholders the "no confirmable match" note
// above left blank. Still no confirmed site for any of the three, so all stay
// unlinked — same reasoning as before, just with artwork now.
//
// Pinchos Factory logo replaced the same day with a higher-resolution version
// of the identical badge (the emailed JPG was a tighter crop with less
// working resolution). It arrived on a solid black square like Nic & Norman's
// on /sponsors; flood-filled to transparent and trimmed to the badge rather
// than left with baked-in black corners on this page's white cell.
export const FOOD_VENDORS_2026 = [
  // ---- Food trucks ---------------------------------------------------------
  { name: 'High on the Hog', logo: hogLogo, w: 400, h: 220 },
  { name: 'Little Miss Juicy', logo: littleMissJuicyLogo, w: 290, h: 290, url: 'https://linktr.ee/littlemissjuicy' },
  { name: 'Mr. Perro ATL', logo: perroLogo, w: 400, h: 400 },
  { name: 'Oysters Co', logo: oystersLogo, w: 400, h: 89, url: 'http://www.oystersco.com/' },
  { name: 'Pinchos Factory', logo: pinchosLogo, w: 400, h: 400 },
  { name: 'Senoia Pizza Company', logo: senoiaPizzaLogo, w: 400, h: 400 },
  { name: 'Serrano Fine Tacos', logo: serranoLogo, w: 400, h: 166, url: 'https://www.instagram.com/serranofinetacos/' },
  { name: 'The Mad Greek', logo: madGreekLogo, w: 315, h: 315, url: 'https://www.themadgreekfood.com/' },

  // ---- Food & drink stands -------------------------------------------------
  { name: "Big Daddy's Peanuts", logo: bigDaddysLogo, w: 400, h: 273, url: 'https://bigdaddyspeanuts.com/' },
  // The Newnan, GA business — its logo prints "NEWNAN, GA / EST. 2015". A
  // same-named business trades in Alabama, and the registration points there
  // too, so don't "correct" this one either way without asking the organizers.
  { name: 'Kettleworks', logo: kettleworksLogo, w: 400, h: 363 },
  { name: 'Social Sugar', logo: socialSugarLogo, w: 397, h: 400 },
  // `dark`: the artwork is white type on a baked-in navy square, so it needs the
  // ink cell the sponsor grid uses for the same problem — on white it reads as a
  // floating block rather than a logo.
  { name: 'Southern Local Nuts', logo: southernLocalNutsLogo, w: 250, h: 250, url: 'https://southernlocalnuts.com/', dark: true },
  { name: 'The Local', logo: theLocalLogo, w: 400, h: 262 },
]
