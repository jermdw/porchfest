// Event photos shown on /photos.
//
// Files live in `public/photos/2026/` and are referenced here by plain path,
// not by a Vite import. Two reasons:
//
//   - Adding a photo is then "drop the file in, add a row" — no import list to
//     keep in sync with the data.
//   - `import.meta.glob` would remove the row as well, but its ordering comes
//     from the filesystem. Renaming one file would silently re-attach every
//     caption after it to the wrong photo. Captions are worth an explicit row.
//
// The trade is caching. Files under `public/` get
// `max-age=86400, stale-while-revalidate=604800` rather than `immutable`
// (see CLAUDE.md → Gotchas), which is fine for write-once event photos but
// means **never replace a photo in place**: a returning visitor would keep
// serving the old one for up to eight days. Publish a correction under a new
// filename and change the `src` here.
//
// ---------------------------------------------------------------------------
// Adding a photo
// ---------------------------------------------------------------------------
//
//   1. Export WebP, longest edge ~1600px, quality ~80. That lands around
//      150-350 kB — large enough to look right full-screen on a laptop, small
//      enough that twenty of them don't punish a phone on cellular data.
//   2. Name it for what it shows, not the camera's filename:
//      `porch-12-brain-fog.webp`, not `IMG_4821.webp`.
//   3. Drop it in `public/photos/2026/` and add a row below.
//
// Fields:
//   src      required. Path from the site root.
//   alt      required. What the picture shows, for someone who can't see it.
//   w, h     optional. Pixel dimensions of the exported file. The grid doesn't
//            need them (tiles are a fixed 4:3 crop, so there is no layout
//            shift either way) — they let the lightbox reserve the right shape
//            for the full-size image before it loads. Omit if unknown.
//   caption  optional. Shown to everyone, under the photo in the lightbox.
//   credit   optional. Photographer, e.g. 'Photo: A. Nother'.
//
// Order here is display order.

export const GALLERY_YEAR = '2026'

export const PHOTOS = [
  // {
  //   src: '/photos/2026/porch-12-brain-fog.webp',
  //   alt: 'Brain Fog playing to a full lawn on the 180 Seavy Street porch at dusk',
  //   w: 1600,
  //   h: 1067,
  //   caption: 'Brain Fog on the 180 Seavy Street porch',
  //   credit: 'Photo: ',
  // },
]
