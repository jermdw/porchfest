# CLAUDE.md

Website + volunteer sign-up system for **Senoia PorchFest** — Sunday, Sept 6,
2026, music 3–10pm on ~29 porches in historic Senoia, GA; free admission;
presented by the Senoia Downtown Development Authority (DDA). 5th annual.

Live at **https://senoiaporchfest.org** (Firebase project `senoiaporchfest`:
Hosting, Firestore, Cloud Functions, Auth; Blaze plan). Code:
https://github.com/jermdw/porchfest. Sister site to the Senoia Car Show
(`~/git/senoia-car-show`, project `senoiacar`, senoiacar.show) — same
architecture; fixes that apply to both should usually be ported across.

Event facts (date, lineup, porches, prices, tiers) come from the organizers or
the official cards/flyers in `public/` — never invent or extrapolate them.

## Status (as of 2026-08-15) — read this first after a break

Shipped and live: landing, `/schedule` (full 41-act lineup), `/map` (interactive
day-of map), `/vip` (ticket + sponsorship checkout), `/volunteer` (27 shifts /
51 spots, 10 pre-registered volunteers seeded), `/cancel`, `/admin`; functions
deployed; Firestore rules deployed; custom domain claimed on the right project
with correct DNS.

**Not yet done (console clicks, owner-only):**
1. Authentication → Sign-in method → enable **Google** and **Email link** — until
   then no admin can log in.
2. Once Hosting shows the domain "Connected": Authentication → Settings →
   **Authorized domains** → add `senoiaporchfest.org` (else Google sign-in fails
   from the custom domain with a generic error).
3. Confirmation emails: verify `senoiaporchfest.org` in Resend, then
   `npx firebase-tools functions:secrets:set RESEND_API_KEY --project senoiaporchfest`
   with the real key and redeploy functions. Until then the secret is a
   `placeholder-*` value and sends are skipped (signups still succeed).
4. Optional: `www.senoiaporchfest.org` has no DNS record — add in Hosting +
   Namecheap if wanted.

**Admins allowlist** (`admins/{email}` docs, live in prod): stacey211328@gmail.com,
buffalocreekmama@gmail.com (Melissa Quinn, DDA), georgiareeders@yahoo.com,
jermdw@gmail.com, jeremywarren@senoiahistory.com. Non-Google addresses sign in
via the email magic link.

**Open questions for the organizers** (assumptions currently baked in):
- Stage number at 57 Morgan St: the official card prints "15" for it AND for
  97 Lower Creek Trail; the printed map shows 26 on Morgan — site uses **26**.
- Clean-up crew read as 8:00–9:00pm; "Hoff Family" seeded VIP 7:30–Closing as
  Full; handwriting read as Baggarly/Johnson, Pylant & Gin.
- Ticket Tailor lists the VIP event window as 2:00–3:00 PM (their side, not
  ours) — likely just the kickoff hour; DDA may want to widen it.
- Five Lower Creek Trail porch pins are interpolated (±30 m) — worth an
  eyeball against the paper map.

## Yearly rollover checklist

`EVENT_ID` in `src/firebase.js` + `scripts/seed-shifts.mjs`; `SHOW_DATE` in
`src/lib/showTime.js`; `DATE_MAP` + CSV in `data/`; `DAY_LABELS` in
`Volunteer.jsx` + day `<select>` in `Admin.jsx`; `src/data/schedule.js` (whole
lineup); amenity POIs in `src/data/eventMap.js`; Ticket Tailor URLs in
`src/pages/Vip.jsx` (new events each year); `index.html` JSON-LD/social meta
+ `public/share-card-*.png`; `public/sitemap.xml` lastmods; posters in
`public/`; footer/landing dates. Consider whether the map base image still
covers the venue (`BBOX` in `venueGeo.js` must match the image exactly).

## Commands

```bash
npm run dev            # Vite on 5174 (auto-connects to emulators in DEV builds)
npx firebase-tools emulators:start --only auth,functions,firestore --project senoiaporchfest
node scripts/seed-shifts.mjs data/shifts_2026.csv          # seed emulator (idempotent)
npm run build          # required before any hosting deploy (deploys dist/)
npm run lint           # oxlint
npx firebase-tools deploy --only hosting --project senoiaporchfest
npx firebase-tools deploy --only functions,hosting --project senoiaporchfest
```

**There is no CI/CD here** (unlike the car show's GitHub Actions) — deploys are
manual with the commands above; `git push` does not deploy.

Prod seed (idempotent — updates shift text/spotsTotal, never clobbers
`spotsFilled`, creates only new pre-registered volunteers):
`GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token --account jermdw@gmail.com) node scripts/seed-shifts.mjs data/shifts_2026.csv --prod`

To change spots on a shift: edit the CSV (one row per slot) and re-seed prod;
or use Edit in `/admin`. To add a named pre-registered volunteer: fill columns
4–7 on their row and re-seed.

### Accounts

- Everything for this project uses **jermdw@gmail.com** — the Firebase CLI's
  other login (senoiahistory.com) has a broken gcloud token, and its default
  can silently flip back after re-auth. Pinned per directory via
  `npx firebase-tools login:use jermdw@gmail.com`; gcloud REST calls need
  `--account jermdw@gmail.com`; the Firebase Hosting REST API additionally
  needs an `x-goog-user-project: senoiaporchfest` header.
- A stray Firebase project **`porchfest-6e7dc`** exists (created by mistake;
  the domain was briefly claimed there). It is unused — safe to delete.
- Emulator REST writes need `Authorization: Bearer owner` to bypass rules.

## Architecture

- **SPA**: React 19 + Vite + Tailwind v4, routes in `src/AppRoutes.jsx`. Public
  pages (`/`, `/schedule`, `/map`, `/vip`) share `SiteHeader`/`SiteFooter`;
  `/volunteer` (shift board), `/cancel?token=` (from confirmation emails),
  `/admin` (organizer dashboard) are behind `React.lazy` — **keep public pages
  free of any `src/firebase.js` import** or that split collapses.
- **Schedule** (`/schedule`): `src/data/schedule.js` (source: the official 2026
  schedule card, `public/schedule-poster-2026.jpg`); every entry has a
  `confirmed` flag — unconfirmed entries are a working checklist and are never
  rendered. Each act links to its map pin (`/map?poi=porch-<stage>`; the VIP
  porch at 40 Travis links to `?poi=vip`).
- **Day-of map** (`/map`): base image is stitched OpenStreetMap tiles at a
  fixed bounding box (no Mapbox token; the page must show `© OpenStreetMap`);
  `src/lib/venueGeo.js` converts lat/lon to a position on it exactly. Porch
  pins are DERIVED from `schedule.js` (one numbered pin per address, listing
  its sets + genres) in `src/data/eventMap.js`; amenity POIs live there too.
  Coordinates are Nominatim/TIGER house-number interpolation, or OSM
  intersection nodes for street corners. Regenerating the base image and
  `BBOX` must happen together.
- **Tickets** (`/vip`): Ticket Tailor (DDA's account). VIP Luxury Lounge ($100,
  event `8805677`) is embedded inline via `TicketTailorWidget`; 2026
  Sponsorships (event `8121226`) is a link-out. Checkout happens on
  tickettailor.com — no payment code here. Widget gotcha: their `widget.js`
  only activates a `<script>` whose *parent* has class `tt-widget`.
- **Cloud Functions v2** (`functions/index.js`, us-central1): `signUp` and
  `cancelSignup` callables. All volunteer writes go through them (volunteers
  have no auth; Admin SDK bypasses rules). Resend confirmation emails are
  best-effort by design — email failure must never fail a signup.
- **Firestore**: `events/2026` (`signupOpen: false` closes sign-ups),
  `events/2026/shifts/{id}` (`role, time, day, category, spotsTotal,
  spotsFilled, sortOrder`), `signups/{id}` (volunteer PII + `status` +
  `cancelToken`; seeded ones carry `seededFrom: 'organizer-sheet'`),
  `admins/{email}` (organizer allowlist; doc ID = lowercase email; data-only,
  no deploy needed to change).

## Invariants

- `spotsFilled` changes only inside transactions that re-check state
  (capacity on signup, `status === 'active'` on any cancel/remove). Never write
  it with a bare update/batch — a double-click or race corrupts the count. (The
  seed script's increments are the one exception, run pre-launch only.)
- Volunteer PII (`signups`) is never publicly readable; only allowlisted admins
  (verified email matching an `admins/{email}` doc) read it. Public reads are
  limited to event + shift docs (counts, no PII).
- Duplicate signup emails are **allowed by design** (households share addresses).
- Admin sign-in: Google popup or email magic link. Both rely on
  `email_verified` in rules.

## Brand

The exact inks from the 2026 shirt-print design system
(`~/senoia_car_show/2026_porchfest_shirt_front/`): navy `#101D3A` (`ink`), red
`#B02A30` (`flag`), warm white `#F5F1E6` (`cream`). Use the `@theme` tokens in
`src/index.css`, not raw Tailwind palette colors: `flag`/`flag-deep` for
buttons/accents on light, `flag-bright` for red text ON navy (true flag red
fails contrast there), `pale` for secondary text on navy. Neutrals are warm
`stone-*`, never `slate`. Fonts: `font-display` (Oswald), `font-script`
(Yellowtail). Logo is the true-vector 2026 wordmark
`src/assets/porchfest-wordmark.svg` (same art as the printed shirts) — used in
the header and hero; don't substitute traced/raster versions.

## Gotchas

- **App Check is NOT enforced** (unlike the car show). Enabling it is a paired
  change: register a reCAPTCHA Enterprise key, set `APP_CHECK_SITE_KEY` in
  `src/firebase.js`, and flip `enforceAppCheck` in `functions/index.js` in the
  same deploy — enforcing before the client has a key breaks every signup.
- **New Hosting domains** must be added to Firebase Auth authorized domains.
- `RESEND_API_KEY` is a Functions secret; sending is skipped when the value
  starts with `placeholder`. Rebind requires a functions deploy.
- `html` background is `ink` on purpose — iOS overscroll must match the footer.
- Page content is deliberately hardcoded (no CMS).
- **SEO plumbing**: `public/robots.txt` + `public/sitemap.xml` must list any new
  public route (the SPA rewrite otherwise answers everything with the app
  shell). `index.html` carries the Event JSON-LD and social-card meta. Per-route
  titles/canonicals come from `src/lib/usePageMeta.js`; every new page must
  call it (`noindex: true` for anything private). senoiaporchfest.org is the
  canonical host — never link or promote the `.web.app`/`.firebaseapp.com`
  mirrors.
- **Ports are offset from the car show** so both run side by side: dev 5174,
  firestore 8081, functions 5002, auth 9098, emulator UI 4002 (car show holds
  the defaults). Start emulators with `--project senoiaporchfest` or functions
  register under the machine's ADC project. Port 5000 is unusable on this Mac
  (AirPlay).
- The old enjoysenoia.com PorchFest page now redirects here; anything else it
  used to host (beyond tickets/sponsorships, already recovered) is gone.
