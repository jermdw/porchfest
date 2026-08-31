// Converts real coordinates to a position on the base map image.
//
// `public/venue-base-2026-web.webp` was stitched from OpenStreetMap raster tiles
// (zoom 18) and cropped to exactly the bounding box below, so this transform is
// exact — not a calibration. Regenerate the image and update BBOX together and
// every pin moves correctly. (The car show's map used a Mapbox Static export;
// this one is plain OSM because no Mapbox token was on hand — the projection
// math is identical. OSM's tile usage policy requires the attribution below
// wherever the image is shown.)
//
// The frame covers the walkable festival (~760 x 670 m): Main Street from
// Johnson to Broad, west through the Pylant / Morgan / Lower Creek Trail
// porches. Remote parking (Senoia Library) is outside this frame on purpose —
// it gets directions rather than a pin.

export const BBOX = { west: -84.5595526, south: 33.2972713, east: -84.5516224, north: 33.303274 }

// "contributors" is not decoration — OSM's attribution guidance asks for the
// project name plus the contributors who own the data. The printed sign-tower
// map (scripts/signtower/side2-map.html) additionally spells out the ODbL,
// which a web map can leave to a link but a PDF cannot.
export const ATTRIBUTION = '© OpenStreetMap contributors'

// Web Mercator: longitude is linear, latitude is not. Using raw latitude here would
// skew pins vertically — a few metres at this scale, but enough to put a pin on the
// wrong side of a street.
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2))

const yNorth = mercY(BBOX.north)
const ySouth = mercY(BBOX.south)

/** Position of a coordinate as percentages of the base image, or null if unplaced. */
export function toPercent(lat, lon) {
  // Number.isFinite, not typeof: NaN and Infinity are both typeof 'number' and would
  // otherwise produce a truthy result with a NaN coordinate, rendering `top: NaN%`.
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return {
    x: ((lon - BBOX.west) / (BBOX.east - BBOX.west)) * 100,
    y: ((yNorth - mercY(lat)) / (yNorth - ySouth)) * 100,
  }
}

/** False for anything outside the exported image — a pin that would render off-map. */
export function isWithinMap(lat, lon) {
  const p = toPercent(lat, lon)
  return !!p && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100
}
