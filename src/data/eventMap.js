// Day-of map data. Porch stage pins are DERIVED from src/data/schedule.js —
// one pin per address, numbered with the official stage number, listing that
// porch's sets — so the schedule stays the single source of truth.
//
// `lat`/`lon` are real coordinates; position on the base map is derived by
// src/lib/venueGeo.js, which is exact because the image was stitched at a known
// bounding box. Sources:
//  - "TIGER" = Nominatim house-number interpolation (good to a lot or two)
//  - "interp" = proportional interpolation along the OSM street geometry —
//    Lower Creek Trail has no house-number data, so those five pins are
//    approximate (±30 m); the address text is the precise guidance.
//  - "node" = an exact OSM intersection node shared by the two named streets.
// Amenity positions come from the organizers' printed venue map, snapped to
// the nearest real intersection — same convention the car show site used.
//
// `confirmed: false` entries are a working checklist and are NOT rendered.

import { PERFORMANCES } from './schedule.js'
import { formatTime } from '../lib/showTime.js'

export const CATEGORIES = [
  { id: 'porch', label: 'Porch Stages' },
  { id: 'stage', label: 'Main Stage' },
  { id: 'vip', label: 'VIP' },
  { id: 'food', label: 'Food Trucks' },
  { id: 'drinks', label: 'Beverages' },
  { id: 'kids', label: "Kid's Area" },
  { id: 'merch', label: 'Merch Tent' },
  { id: 'restroom', label: 'Restrooms' },
  { id: 'parking', label: 'Parking' },
  { id: 'aid', label: 'First Aid' },
]

// Porch coordinates keyed by street address.
const PORCH_COORDS = {
  '1 Main Street': [33.299983, -84.553967], // TIGER (Senoia Coffee block)
  '18 Main Street': [33.300426, -84.55434], // TIGER
  '22 Main Street': [33.300522, -84.554329], // TIGER
  '30 Main Street': [33.300714, -84.554307], // TIGER
  '42 Main Street': [33.301001, -84.554273], // TIGER
  '48 Main Street': [33.301341, -84.554238], // TIGER
  '60 Main Street': [33.301517, -84.554361], // OSM: Olivia James Apparel
  '70 Main Street': [33.301827, -84.5542], // TIGER
  '74 Main Street': [33.301915, -84.554193], // TIGER
  '30 Barnes Street': [33.300334, -84.55368], // TIGER
  '180 Seavy Street': [33.30137, -84.555105], // TIGER
  '252 Seavy Street': [33.301223, -84.552624], // TIGER
  '271 Seavy Street': [33.301046, -84.552409], // TIGER
  '274 Seavy Street': [33.301207, -84.552322], // TIGER
  '230 Pylant Street': [33.299144, -84.558816], // TIGER
  '239 Pylant Street': [33.298931, -84.558853], // TIGER
  '258 Pylant Street': [33.299594, -84.557919], // TIGER
  '270 Pylant Street': [33.299762, -84.557609], // TIGER
  '352 Pylant Street': [33.301277, -84.556455], // TIGER
  '371 Pylant Street': [33.302229, -84.556115], // TIGER
  '25 Lower Creek Trail': [33.299482, -84.556096], // interp — approximate
  '55 Lower Creek Trail': [33.298799, -84.556163], // interp — approximate
  '77 Lower Creek Trail': [33.29837, -84.556492], // interp — approximate
  '89 Lower Creek Trail': [33.298137, -84.556672], // interp — approximate
  '97 Lower Creek Trail': [33.297976, -84.556777], // interp — approximate
  '31 Morgan Street': [33.298746, -84.557331], // TIGER
  '41 Morgan Street': [33.298611, -84.557034], // TIGER
  '57 Morgan Street': [33.298308, -84.556355], // TIGER
  '40 Travis Street': [33.300254, -84.555167], // TIGER (Senoia Farmers' Market)
}

// One pin per porch address; the VIP lounge and Main Stage get their own
// richer entries below, so their schedule rows are excluded here.
const porchPois = (() => {
  const byAddress = new Map()
  for (const p of PERFORMANCES) {
    if (!p.confirmed || p.stage == null || !PORCH_COORDS[p.address]) continue
    if (p.address === '40 Travis Street') continue // rendered as the VIP pin
    if (!byAddress.has(p.address)) byAddress.set(p.address, [])
    byAddress.get(p.address).push(p)
  }
  return [...byAddress.entries()].map(([address, sets]) => {
    const sorted = [...sets].sort((a, b) => a.start.localeCompare(b.start))
    return {
      id: `porch-${sorted[0].stage}`,
      category: 'porch',
      stage: sorted[0].stage,
      name: `Stage ${sorted[0].stage} — ${address}`,
      where: sorted[0].venue,
      blurb: sorted.map((s) => `${formatTime(s.start)} ${s.act}`).join(' · '),
      lat: PORCH_COORDS[address][0],
      lon: PORCH_COORDS[address][1],
      confirmed: true,
    }
  })
})()

export const POIS = [
  ...porchPois,

  {
    id: 'stage-main',
    category: 'stage',
    name: 'Main Stage',
    where: 'Bottom of Main Street, at Travis & Gin',
    blurb: 'Closing act at 8:00pm — Chuck X Nick.',
    lat: 33.299966, // node: Main & Travis/Gin junction
    lon: -84.554216,
    confirmed: true,
  },
  {
    id: 'vip',
    category: 'vip',
    name: 'VIP Luxury Lounge',
    where: "40 Travis Street — Senoia Farmers' Market",
    blurb:
      'Presented by BMW of South Atlanta. Doors at 2:00pm with Kellar McCoy; porch sets here at 4:00 (Tim McGee) and 7:00 (Ashton Dooley Band). VIP ticket required — $100, limited.',
    lat: 33.300254, // TIGER: 40 Travis St
    lon: -84.555167,
    confirmed: true,
  },
  {
    id: 'merch-tent',
    category: 'merch',
    name: 'Merch Tent & Sponsors',
    where: 'Pylant Street at Gin Street',
    blurb: 'Official PorchFest merchandise — and come meet our sponsors.',
    lat: 33.3002934, // node: Pylant & Gin
    lon: -84.5565306,
    confirmed: true,
  },
  {
    id: 'first-aid',
    category: 'aid',
    name: 'First Aid',
    where: 'Pylant Street at Gin Street, by the merch tent',
    blurb: null,
    lat: 33.3002934, // node: Pylant & Gin (fans out beside the merch pin)
    lon: -84.5565306,
    confirmed: true,
  },
  {
    id: 'food-trucks',
    category: 'food',
    name: 'Food Truck Alley',
    where: 'Gin Street',
    blurb: 'Food trucks line Gin Street between Main and Pylant.',
    lat: 33.30011, // midpoint of Gin Street between its end junctions
    lon: -84.5554,
    confirmed: true,
  },
  {
    id: 'kids-area',
    category: 'kids',
    name: "Kid's Area",
    where: 'Pylant Street at Travis Street',
    blurb: null,
    lat: 33.3005299, // node: Pylant & Travis
    lon: -84.556418,
    confirmed: true,
  },
  {
    id: 'cooling-tent',
    category: 'aid',
    name: 'Cooling Tent',
    where: 'Lower Creek Trail',
    blurb: 'Courtesy of Progressive Heating & Air.',
    lat: 33.299069, // OSM: Lower Creek Trail (position approximate)
    lon: -84.556098,
    confirmed: true,
  },
  {
    id: 'drinks-stations',
    category: 'drinks',
    name: 'Beverage Stations',
    where: 'Five stations around the festival',
    blurb:
      'Look for the beverage markers along Main Street, Lower Creek Trail, Pylant Street and Seavy Street.',
    lat: null, // marked on the printed map only — exact spots not yet confirmed
    lon: null,
    confirmed: true,
  },
  {
    id: 'restrooms',
    category: 'restroom',
    name: 'Restrooms',
    where: 'Around the festival perimeter',
    blurb:
      'Marked locations including the Senoia Housing Authority & Seavy Street Park. Maps of porches and amenities are posted at most intersections.',
    lat: null, // exact placements pending the organizers' final site plan
    lon: null,
    confirmed: true,
  },

  // ---- Parking -------------------------------------------------------------
  {
    id: 'parking-vip-maguires',
    category: 'parking',
    name: "VIP Parking — Maguire's Lot",
    where: 'Off Travis Street; enter at Johnson & Baggarly',
    blurb: 'Reserved for VIP ticket holders.',
    lat: 33.300077, // OSM: Maguires lot (shared with the car show site's data)
    lon: -84.554879,
    confirmed: true,
  },
  {
    id: 'parking-handicap-post-office',
    category: 'parking',
    name: 'Accessible Parking — Post Office',
    where: 'Post Office, and behind 36 Broad Street',
    blurb: 'Marked accessible spaces. A volunteer is on site 2:00–4:00pm.',
    lat: 33.299087, // OSM: Senoia Post Office
    lon: -84.554315,
    confirmed: true,
  },
  {
    id: 'parking-123-morgan',
    category: 'parking',
    name: 'Public Parking — 123 Morgan Street',
    where: '123 Morgan Street',
    blurb: null,
    lat: 33.297971, // TIGER: 123 Morgan St
    lon: -84.554861,
    confirmed: true,
  },
  {
    id: 'parking-library',
    category: 'parking',
    name: 'Public Parking — Senoia Library',
    where: 'Northwest of the festival, off Pylant Street',
    blurb: 'Free public parking a short walk in.',
    directions: 'Senoia Public Library, Senoia, GA 30276',
    lat: null, // outside the base map's frame on purpose
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-seavy-east',
    category: 'parking',
    name: 'Public Parking — Housing Authority & Seavy Street Park',
    where: 'East of Main Street, off Seavy Street',
    blurb:
      'Also: Historical Society lot. Free public parking; limited golf-cart shuttles roam the perimeter.',
    directions: 'Seavy Street Park, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'shuttles',
    category: 'parking',
    name: 'Golf Cart Shuttles',
    where: 'Roaming the festival perimeter',
    blurb: 'Limited golf-cart shuttles bring you to the PorchFest perimeter — flag one down.',
    lat: null, // a roaming service, not a point
    lon: null,
    confirmed: true,
  },
]

// Times are 24h "HH:MM" local. PorchFest is Sunday, September 6, 2026.
export const SCHEDULE = [
  {
    time: '14:00',
    label: 'VIP Luxury Lounge opens — Kellar McCoy',
    poiId: 'vip',
    detail:
      "Presented by BMW of South Atlanta at the Senoia Farmers' Market. VIP ticket required ($100, limited).",
    confirmed: true,
  },
  {
    time: '15:00',
    label: 'First porch sets begin',
    poiId: null,
    detail: 'New sets start every hour through 7:00pm on porches across town — see the Schedule page for who plays where.',
    confirmed: true,
  },
  {
    time: '20:00',
    label: 'Closing act — Chuck X Nick',
    poiId: 'stage-main',
    detail: 'Main Stage at the bottom of Main Street.',
    confirmed: true,
  },
]

export const publishedPois = () => POIS.filter((p) => p.confirmed)

export const publishedSchedule = () =>
  SCHEDULE.filter((s) => s.confirmed).sort((a, b) => a.time.localeCompare(b.time))
