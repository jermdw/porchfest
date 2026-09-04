# 03 — Website Operations

← [Playbook index](README.md)

Everything about running senoiaporchfest.org. Architecture and code-level
invariants live in `CLAUDE.md`; this chapter covers the operational picture.

---

## What it is

A React 19 + Vite + Tailwind v4 single-page app on Firebase Hosting, project
`senoiaporchfest` (Blaze plan), with Firestore, Cloud Functions and Auth.

| Route | What it is | Public |
| --- | --- | --- |
| `/` | Landing | ✅ |
| `/schedule` | Full lineup | ✅ |
| `/map` | Interactive day-of map | ✅ |
| `/vip` | Ticket + sponsorship checkout | ✅ |
| `/sponsors`, `/vendors`, `/faq` | Rosters and FAQ | ✅ |
| `/volunteer` | Shift board | ✅ (no login) |
| `/cancel?token=` | Cancellation link from confirmation emails | ✅ |
| `/admin` | Organizer dashboard | 🔒 allowlisted |

> **Keep public pages free of any `src/firebase.js` import.** `/volunteer`,
> `/cancel` and `/admin` are behind `React.lazy` specifically so the Firebase SDK
> is not in the bundle that a visitor to `/` downloads. A stray import collapses
> that code split and every visitor pays for it — on cellular, on a crowded
> street, on event day.

Page content is deliberately hardcoded. There is no CMS, and adding one would
trade a two-minute pull request for a year-round subscription and an
authentication surface.

---

## Deploying

**Merging to `main` deploys.** `.github/workflows/deploy.yml` runs: lint →
build → Firestore rules (only when `firestore.rules` changed) → Hosting → a
smoke check of the live site.

Rules deploy **before** Hosting on purpose: a page whose reads depend on a new
rule must not reach users ahead of the rule. If the rules deploy fails the
release stops with the old site still serving.

Pushing a branch does **not** deploy. Only `main` does.

### Functions are different

Cloud Functions deploy **only** when the push touched `functions/` or
`firebase.json`, or when you trigger the workflow by hand with *"Also deploy
Cloud Functions"* ticked. A functions deploy is slow and rebinds secrets, so it
is not done for a copy change.

> This is why **setting the real `RESEND_API_KEY` requires a manual workflow
> run** — the secret value is only picked up by a functions deploy.

Authentication to GCP is keyless (Workload Identity Federation); no
service-account key lives in the repo. One-time setup is in
`scripts/setup-ci-deploy.sh`, which is idempotent — re-run it after adding a
role.

### Deploying by hand

```bash
npm run build
npx firebase-tools deploy --only hosting --project senoiaporchfest
```

`npm run build` is required before any hosting deploy — it deploys `dist/`.

---

## Local development

```bash
npm install
(cd functions && npm install)
npx firebase-tools emulators:start --only auth,functions,firestore --project senoiaporchfest
node scripts/seed-shifts.mjs data/shifts_2026.csv    # seed the emulator, idempotent
npm run dev                                           # http://localhost:5174
```

Dev builds auto-connect to the emulators.

**Always pass `--project senoiaporchfest`** when starting emulators, or the
functions register under whatever project the machine's application-default
credentials point at.

### Ports are offset from the Senoia Car Show

So both sites run side by side. The car show holds the defaults.

| Service | PorchFest | Car show |
| --- | --- | --- |
| Vite dev | 5174 | 5173 |
| Firestore | 8081 | 8080 |
| Functions | 5002 | 5001 |
| Auth | 9098 | 9099 |
| Hosting | 5055 | 5000 |
| Emulator UI | 4002 | 4000 |

Port 5000 is unusable on this Mac — AirPlay Receiver holds it.

---

## Caching

`firebase.json` `headers` rules, **in order** — the ordering is load-bearing:

| Rule | Applies to | Policy |
| --- | --- | --- |
| `/assets/**` | Vite's content-hashed bundles | `max-age=31536000, immutable` |
| `/*.@(webp\|png\|jpg\|jpeg\|gif\|svg\|pdf\|ico)` | Root-level artwork | `max-age=86400, stale-while-revalidate=604800` |
| `^/[^.]*$` (regex) | Routes — dot-free paths only | `no-cache` |
| `/index.html` | The app shell | `no-cache` |

Why each is what it is:

- Bundles under `/assets/` are content-hashed by Vite, so a changed file has a
  changed name. Safe to freeze forever.
- Root-level artwork keeps **stable filenames**, so it must not be `immutable` —
  a corrected file would be stranded in caches permanently.
- A single `*` never crosses a slash, so the artwork rule cannot reach
  `/assets`.
- `^/[^.]*$` matches only paths without a dot, which is how routes are
  distinguished from files.

### The rule that will catch you out

**Replacing artwork in place does not propagate quickly.** For the first day a
phone serves its cached copy without asking. For the seven days after that,
`stale-while-revalidate` lets it serve the stale copy *immediately* while
refreshing in the background — so a returning visitor sees the **old file once
more** before the new one appears. (Safari does not implement
`stale-while-revalidate`, so it revalidates once the day is up.)

> To publish corrected artwork immediately, **rename the file** and update the
> reference. That is the only way to bust it for everyone at once. This matters
> most in the last week, when corrections are most likely.

### Never put comment keys in `firebase.json`

The Firebase config schema sets `additionalProperties: false` on header entries,
so a `"//": "..."` key **fails validation at deploy time**. The hosting emulator
accepts it happily, so this passes local testing and then breaks CI. Explain
header rules in this playbook or in `CLAUDE.md` instead.

### Testing header rules

The hosting emulator is the only way to test `firebase.json` `headers` before
they reach production:

```bash
npx firebase-tools emulators:start --only hosting --project senoiaporchfest
```

Then `curl -sI` a route, a hashed asset, and a file with an extension, and check
all three.

---

## Domains and DNS

`senoiaporchfest.org` is claimed on the `senoiaporchfest` Firebase project with
correct DNS at Namecheap.

> **Any new Hosting domain must also be added to Firebase Auth → Settings →
> Authorized domains.** Otherwise Google sign-in fails from that domain with a
> generic, unhelpful error.

`www.senoiaporchfest.org` has no DNS record. Add one in Hosting + Namecheap if
wanted.

A stray Firebase project `porchfest-6e7dc` exists (created by mistake; the
domain was briefly claimed there). It is unused and safe to delete.

The old enjoysenoia.com PorchFest page now redirects here. Anything else it
hosted beyond tickets and sponsorships is gone.

---

## Analytics

Google Tag Manager with GA4 pageview tracking (`src/lib/gtm.js`), plus a
`volunteer_signup` GA4 event marked as a key event.

---

## App Check is NOT enforced

Unlike the car show. Enabling it is a **paired change** that must ship in one
deploy:

1. Register a reCAPTCHA Enterprise key,
2. set `APP_CHECK_SITE_KEY` in `src/firebase.js`,
3. flip `enforceAppCheck` in `functions/index.js`.

Enforcing before the client has a key **breaks every signup**.
