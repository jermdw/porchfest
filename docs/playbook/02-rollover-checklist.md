# 02 — Rollover Checklist

← [Playbook index](README.md)

Turning last year's site into this year's. Work top to bottom; the ordering
matters where noted. Do this at **T-2 months**, before the lineup is final —
the site can go live with the new date and a provisional lineup.

Everything here is a code change, so it goes through a pull request and deploys
on merge to `main`. See [03 — Website Operations](03-website-operations.md).

---

## 1. The event identifier

`EVENT_ID` is the Firestore document under `events/` that holds the year's
shifts. It appears in **two** files and they must agree, or the website and the
seed script will read and write different years:

- `src/firebase.js` — `export const EVENT_ID = '2026'`
- `scripts/seed-shifts.mjs` — `const EVENT_ID = '2026'`

Changing it creates a fresh, empty event. Last year's shifts and sign-ups stay
where they are, which is what you want: the previous year becomes an archive
rather than being overwritten.

## 2. The show date

`src/lib/showTime.js`:

```js
export const SHOW_DATE = { year: 2026, month: 8, day: 6 } // month is 0-indexed: Sept 6
```

> **Trap:** `month` is **zero-indexed**. September is `8`, not `9`. Get this
> wrong and the "now playing" logic on `/map` silently never activates, which
> you will not notice until event day.

This drives the live "now playing" filters and the day-of behaviour. The
timezone is fixed at `America/New_York`.

## 3. Volunteer days

Two places hardcode the three event dates, and both must match the CSV:

- `scripts/seed-shifts.mjs` — `DATE_MAP`, which maps the CSV's short day tokens
  to ISO dates:
  ```js
  const DATE_MAP = { '9/5': '2026-09-05', '9/6': '2026-09-06', '9/7': '2026-09-07' }
  ```
- `src/pages/Volunteer.jsx` — `DAY_LABELS`, the headings volunteers see
  (`'2026-09-06': 'Sunday, Sept 6 — PorchFest'`).
- `src/pages/Admin.jsx` — the day `<select>` options.

Rename `data/shifts_2026.csv` to the new year and update the day tokens inside.

## 4. The lineup

`src/data/schedule.js` is the source of truth for `/schedule` and `/map` — and
**only** those two. Every entry carries a `confirmed` flag; unconfirmed entries
are a working checklist and are never rendered, so you can stage the lineup
publicly-safely as bookings firm up.

Four other copies of the lineup are maintained **by hand** and do not read this
file. After any lineup edit, reconcile all of them — see
[08 — the four hand-kept copies](08-open-decisions.md#the-four-hand-kept-copies-of-the-lineup).

## 5. The map

`src/data/eventMap.js`:

- **Porch pins are derived** from `schedule.js` — one numbered pin per address,
  listing its sets and genres. You do not hand-edit these.
- **Amenity points of interest** (restrooms, beverage stations, kids' area,
  parking, first aid, merch) *are* hand-maintained here. Re-check each against
  the current year's plan.

Coordinates come from Nominatim / TIGER house-number interpolation, or from OSM
intersection nodes for street corners.

### The map base image

`src/lib/venueGeo.js` holds `BBOX`, the exact bounding box of the base image:

```js
export const BBOX = { west: -84.5595526, south: 33.2972713, east: -84.5516224, north: 33.303274 }
```

The base image (`public/venue-base-2026-web.webp`) is stitched OpenStreetMap
tiles. `BBOX` is **exact, not a calibration** — the projection math converts
latitude/longitude to a position on that image directly.

> **Regenerating the base image and updating `BBOX` must happen in the same
> change.** Change one without the other and *every pin moves*, on the live
> `/map` and on the printed tower map alike.

Only regenerate if the festival footprint outgrows the current frame (~760 × 670 m:
Main Street from Johnson to Broad, west through the Pylant / Morgan / Lower Creek
Trail porches). Remote parking at the library sits outside the frame on purpose
and gets directions rather than a pin.

**Attribution is a licence obligation, not decoration.** The web map must show
`© OpenStreetMap contributors` as a link to the licence. The printed tower map
spells the ODbL out in words, because a PDF has nothing to click.

## 6. Ticketing

Ticket Tailor is the DDA's account, and **each year is a new event with new IDs
and new URLs**. Update `src/pages/Vip.jsx`.

- The VIP Luxury Lounge checkout is embedded inline via `TicketTailorWidget`.
- Sponsorships are a link-out.
- Checkout happens on tickettailor.com — there is no payment code in this repo,
  and there should never be.

> **Widget gotcha:** Ticket Tailor's `widget.js` only activates a `<script>`
> whose **parent element** carries the class `tt-widget`. Restructure the markup
> around it and the widget silently fails to render.

## 7. Content pages

Hand-edited data files, all under `src/data/`:

| File | Page |
| --- | --- |
| `sponsors.js` | `/sponsors` |
| `foodVendors.js` | `/vendors` |
| `faq.js` | `/faq` |
| `bands.js` | `/bands` (currently unpublished) |

Reconcile the sponsor roster against the Ticket Tailor export rather than
against email threads — that is how 2026 finally settled it.

Also update the dates in the site footer and on the landing page.

## 8. SEO and social

- `index.html` — the Event JSON-LD block (dates, location, offers) and the
  social-card meta tags.
- `public/sitemap.xml` — update `lastmod` on every page, and **add any new
  route**. The SPA rewrite answers unknown paths with the app shell, so a route
  missing from the sitemap is invisible to search engines.
- `public/robots.txt` — same: list new public routes.
- `src/lib/usePageMeta.js` — every new page must call this for its title and
  canonical URL. Use `noindex: true` for anything private.
- `public/share-card-*.png` — regenerate for the new year.

> senoiaporchfest.org is the canonical host. Never link or promote the
> `.web.app` / `.firebaseapp.com` mirrors.

## 9. Print artwork

Regenerate everything in [05 — Print & Signage](05-print-and-signage.md), and
replace the posters in `public/`.

> **Renaming beats replacing.** Artwork at root level keeps stable filenames and
> is cached for a day, then served stale-while-revalidate for a week. To publish
> corrected artwork immediately you must **rename the file** and update the
> reference. See [03 — Caching](03-website-operations.md#caching).

---

## Final sweep

Search the repo for the outgoing year as a literal string and read every hit:

```bash
grep -rn "2026" src/ public/ scripts/ index.html data/ --exclude-dir=node_modules
```

Some hits are correct history (an archived poster filename); most are things you
have missed. Do this last, after working the list above.
