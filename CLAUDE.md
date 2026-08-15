# CLAUDE.md

Website + volunteer sign-up system for Senoia PorchFest (Sunday, Sept 6, 2026,
music starts 3pm; free admission; presented by the Senoia Downtown Development
Authority). Firebase project `senoiaporchfest` (Hosting, Firestore, Cloud
Functions, Auth); domain senoiaporchfest.org. Sister site to the Senoia Car Show repo
(`~/git/senoia-car-show`, project `senoiacar`) — same architecture, and fixes
that apply to both should usually be ported across.

Event facts (date, lineup, porches, times) come from the organizers or
https://www.enjoysenoia.com/events/senoia-porchfest-2026 — never invent or
extrapolate them.

## Commands

```bash
npm run dev            # Vite dev server on 5174 (auto-connects to emulators in DEV builds)
npx firebase-tools emulators:start --only auth,functions,firestore
node scripts/seed-shifts.mjs data/shifts_2026.csv                        # seed emulator
npm run build          # required before any hosting deploy (deploys dist/)
npm run lint           # oxlint
npx firebase-tools deploy --only hosting --project senoiaporchfest
npx firebase-tools deploy --only functions,hosting --project senoiaporchfest
```

Prod seed (idempotent, preserves `spotsFilled`):
`GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token --account jermdw@gmail.com) node scripts/seed-shifts.mjs <csv> --prod`

gcloud work for this project uses `--account jermdw@gmail.com` (the CLI's
default senoiahistory.com account has a broken token).

## Architecture

- **SPA**: React 19 + Vite + Tailwind v4, routes in `src/AppRoutes.jsx`: public
  pages (`/` landing, `/schedule`) share `SiteHeader`/`SiteFooter`; `/volunteer`
  (shift board), `/cancel?token=` (from confirmation emails), `/admin`
  (organizer dashboard). The three Firebase-touching routes are behind
  `React.lazy` — **keep public pages free of any `src/firebase.js` import** or
  that split collapses.
- **Schedule** (`/schedule`): content lives in `src/data/schedule.js` (source:
  the official 2026 schedule card PDF); every entry carries a `confirmed` flag —
  unconfirmed entries are a working checklist and are never rendered. Each act
  links to its map pin (`/map?poi=porch-<stage>`).
- **Day-of guide** (`/map`): base map is stitched OpenStreetMap tiles at a fixed
  bounding box (no Mapbox token needed; requires the `© OpenStreetMap`
  attribution the page displays); `src/lib/venueGeo.js` converts lat/lon to a
  position on it exactly. Porch pins are DERIVED from `schedule.js` (one
  numbered pin per address) in `src/data/eventMap.js`; amenity POIs live there
  too. Porch coordinates are Nominatim/TIGER interpolated; the five Lower Creek
  Trail porches are proportional interpolations along the OSM street geometry
  (approximate ±30 m). Stage 26 vs the card's duplicate "15" at 57 Morgan St is
  an unresolved organizer discrepancy — see the comment in schedule.js.
- **Cloud Functions v2** (`functions/index.js`): `signUp` and `cancelSignup`
  callables. All volunteer writes go through them (volunteers have no auth; the
  Admin SDK bypasses rules). Resend confirmation emails are best-effort by
  design — email failure must never fail a signup.
- **Firestore**: `events/2026` (`signupOpen: false` closes sign-ups),
  `events/2026/shifts/{id}` (`role, time, day, category, spotsTotal,
  spotsFilled, sortOrder`), `signups/{autoId}` (volunteer PII + `status` +
  `cancelToken`), `admins/{email}` (organizer allowlist; doc ID = lowercase
  email; data-only, no deploy needed to change).

## Invariants

- `spotsFilled` changes only inside transactions that re-check state
  (capacity on signup, `status === 'active'` on any cancel/remove). Never write
  it with a bare update/batch — a double-click or race corrupts the count.
- Volunteer PII (`signups`) is never publicly readable; only allowlisted admins
  (verified email matching an `admins/{email}` doc) read it. Public reads are
  limited to shift docs (counts, no PII).
- Duplicate signup emails are **allowed by design** (households share addresses).
- Admin sign-in: Google popup or email magic link. Both rely on
  `email_verified` in rules.

## Brand

Use the theme tokens in `src/index.css` (`@theme`), not raw Tailwind palette
colors: `cream` (page bg), `porch`/`porch-deep` (haint blue, buttons/accents),
`porch-pale`, `ink` (near-black surfaces). Neutrals are warm `stone-*`, never
`slate`. Fonts: `font-display` (Oswald) and `font-script` (Yellowtail). There
is no logo art yet — the header/hero wordmarks are text; if real PorchFest art
arrives, follow the car show's WebP-per-slot pattern.

## Gotchas

- **App Check is NOT enforced yet** (unlike the car show). Enabling it is a
  paired change: register a reCAPTCHA Enterprise key, set `APP_CHECK_SITE_KEY`
  in `src/firebase.js`, and flip `enforceAppCheck` in `functions/index.js` in
  the same deploy.
- **New Hosting domains** must be manually added to Firebase Auth authorized
  domains or Google sign-in fails from them with a generic error.
- `RESEND_API_KEY` is a Functions secret; sending is skipped when the value
  starts with `placeholder`. Rebind requires a functions deploy. Resend must
  verify senoiaporchfest.org (DNS records) before `FROM` works.
- `html` background is `ink` on purpose — iOS overscroll must match the footer.
- Page content is deliberately hardcoded in components (no CMS).
- **SEO plumbing**: `public/robots.txt` + `public/sitemap.xml` must list any new
  public route (the SPA rewrite otherwise answers everything, even robots.txt,
  with the app shell). `index.html` carries the Event JSON-LD and social-card
  meta — update dates/status and `share-card-2026.png` each year. Per-route
  titles/canonicals come from `src/lib/usePageMeta.js`; every new page should
  call it (`noindex: true` for anything private). senoiaporchfest.org is the
  canonical host — the `.web.app`/`.firebaseapp.com` mirrors must never be
  linked or promoted.
- Dev server port is 5174 so it can run beside the car show repo (5173), and
  the emulators are offset for the same reason: firestore 8081, functions 5002,
  auth 9098, UI 4002 (car show holds the defaults). Port 5000 is unusable on
  this Mac (AirPlay).
