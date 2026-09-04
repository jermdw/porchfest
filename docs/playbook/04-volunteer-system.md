# 04 — Volunteer System

← [Playbook index](README.md)

The shift board at `/volunteer`, the organizer dashboard at `/admin`, and the
pipeline that fills them.

---

## How it fits together

```
data/shifts_<year>.csv  ──seed──▶  events/<year>/shifts/{id}   ──▶  /volunteer
                                            │                          │
                                            │                     signUp callable
                                            ▼                          ▼
                                   /admin  ◀──────────────────  signups/{id}
                                            │
                                            └──▶ scripts/generate_volunteer_roster.py ──▶ printed roster
```

Volunteers have **no login**. Every write goes through a Cloud Function
(`signUp`, `cancelSignup`) using the Admin SDK, which bypasses Firestore rules.
That is deliberate: it keeps volunteer personal information unreadable to the
public while still letting anyone sign up.

---

## The shift CSV

`data/shifts_<year>.csv`, **one row per slot** — three spots on a shift means
three identical rows.

| Column | Meaning |
| --- | --- |
| `What` | Role text, shown to volunteers |
| `When` | `9/6 - 7:00AM - 8:00AM` — the day token must exist in `DATE_MAP` |
| `Credits` | Unused |
| `Volunteer First Name`, `Volunteer Last Name`, `Email`, `Phone` | Optional pre-registration |

Fill the last four columns to seed someone who signed up on paper. Leave them
empty for an open slot.

> **Do not commit volunteer contact details.** This repository is public. See
> [08 — PII currently public](08-open-decisions.md#pii-currently-public); the
> current CSV already carries names that should be reconsidered.

### Seeding

```bash
# Emulator
node scripts/seed-shifts.mjs data/shifts_2026.csv

# Production
GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token --account <ops-account>) \
  node scripts/seed-shifts.mjs data/shifts_2026.csv --prod
```

The seed is **idempotent**: it updates shift text and `spotsTotal`, never
clobbers `spotsFilled`, and creates only pre-registered volunteers that do not
already exist. It is run **by hand, never by CI**.

---

## The trap that matters most: shift IDs hash the role text

A shift's Firestore document ID is:

```
sha1(`${role}|${time}`).hex.slice(0, 10)
```

**The role text is part of the identity.** So changing the wording of a role in
the CSV — even a pure copy-edit, even fixing a typo — does not rename anything.
The next production seed computes a *new* ID, creates a fresh shift with
`spotsFilled: 0`, and leaves the old document in place with all of its sign-ups
still pointing at it. `/volunteer` then shows **both**.

The damage is invisible until someone notices the duplicates.

Pre-registered volunteer IDs have the same property one level down —
``sha1(`${shiftId}|${first}|${last}`).hex.slice(0, 20)`` — so a role edit changes
those too, and the de-duplication lookup misses, duplicating the person.

### Renaming a role safely

Migrate **before** seeding, in this order. Create first: a sign-up pointing at a
missing shift is worse than a few seconds of duplicates on `/volunteer`.

1. **Create** the new shift document at `sha1(newRole|time)[:10]`, copying every
   field verbatim — especially `spotsFilled` and `sortOrder`.
2. **Repoint** `shiftId` on every sign-up, cancelled ones included.
3. **Delete** the old shift document.

> `batchWrite` is **non-atomic**: HTTP 200 can still carry per-write failures in
> `body.status[]`. Check it — a partial success leaves sign-ups half-repointed.
> Re-query the old IDs afterwards in case someone signed up mid-flight.

This was done successfully in 2026 for three shifts (11 sign-ups moved, spot
counts preserved) after a role gained a parenthetical.

### The check worth running after any CSV edit

Recompute all IDs from the CSV and diff them against production. This proves the
next seed is a no-op and catches any role text that drifted:

- **In CSV, not in production** → a seed would *create* these.
- **In production, not in CSV** → a seed would *orphan* these.

Because the seed is manual, a mismatch sits harmless until someone seeds. That
window is when to fix it.

---

## The `spotsFilled` invariant

> `spotsFilled` changes **only** inside a transaction that re-checks state —
> capacity on sign-up, `status === 'active'` on any cancel or remove.

Never write it with a bare update or batch. A double-click or a race corrupts
the count. The seed script's increments are the single exception, and they run
pre-launch only.

---

## Data model

| Collection | Contents |
| --- | --- |
| `events/<year>` | `signupOpen: false` closes sign-ups site-wide |
| `events/<year>/shifts/{id}` | `role, time, day, category, spotsTotal, spotsFilled, sortOrder` |
| `signups/{id}` | Volunteer details, `status`, `cancelToken`; seeded ones carry `seededFrom: 'organizer-sheet'` |
| `admins/{email}` | Full-access organizer allowlist; document ID is the lowercase email |
| `organizers/{email}` | Scoped, **read-only** allowlist; `categories: string[]` |

`category` on a shift does double duty: it groups shifts and it **scopes
organizer read access**. Set it per shift in `/admin`'s shift editor.

---

## Access control

- **Volunteer personal information is never publicly readable.** Public reads are
  limited to event and shift documents — counts, no personal data.
- **Admins** (`admins/{email}`) read sign-ups directly via Firestore rules, which
  check `email_verified`.
- **Scoped organizers** (`organizers/{email}`) get a category-limited subset
  through the `getOrganizerRoster` callable — read-only, with no rules grant.
  `/admin` tries the full admin listeners first and falls back to this callable
  on `permission-denied`.

Both allowlists are **data, not code**: add or remove a document in Firestore and
it takes effect immediately. No deploy needed.

### Why `getOrganizerRoster` is a Cloud Function

A rules-only version would need the organizer-to-shift mapping denormalized onto
every `signups` document, purely so a client query could mirror it. Firestore
list rules cannot filter per-document through a `get()` indirection — the whole
query fails unless the client's `where` clauses let Firestore prove every match
passes. The callable was the smaller change.

### Duplicate sign-up emails are allowed by design

Households share an email address. Do not "fix" this.

---

## Confirmation emails

Sent through **Resend**, and **best-effort by design** — an email failure must
never fail a sign-up.

`RESEND_API_KEY` is a Cloud Functions secret. **Sending is skipped entirely when
the value starts with `placeholder`.** To turn emails on:

1. Verify the sending domain in Resend.
2. ```bash
   npx firebase-tools functions:secrets:set RESEND_API_KEY --project senoiaporchfest
   ```
3. Run the deploy workflow by hand with **"Also deploy Cloud Functions"** ticked
   — rebinding the secret requires a functions deploy.

Confirmation emails carry the `/cancel?token=` link, so until this is done,
volunteers cannot self-cancel.

---

## Admin sign-in

Google popup or email magic link; both rely on `email_verified` in the rules.

**Before organizers need it**, confirm in the Firebase console:

1. Authentication → Sign-in method → **Google** and **Email link** are enabled.
   Until then *no admin can log in*.
2. Authentication → Settings → **Authorized domains** includes
   `senoiaporchfest.org`. Without it, Google sign-in from the custom domain fails
   with a generic error.

Organizers on non-Google addresses sign in via the email magic link.

---

## Printable roster

`scripts/generate_volunteer_roster.py` pulls shifts and active sign-ups live
from production Firestore and renders a printable PDF. Grouping and empty-slot
handling mirror `exportCsv` in `src/pages/Admin.jsx`.

```bash
TOKEN=$(gcloud auth print-access-token --account <ops-account>)
python3 scripts/generate_volunteer_roster.py --token "$TOKEN"
```

Two implementation notes worth keeping:

- It shells out to **`curl`, not `urllib`** — this Mac's python.org build has no
  local CA bundle, so `urllib`'s SSL verification fails while `curl` works.
- It embeds a real webfont for **all** text. See the base-14 font trap in
  [05 — Print & Signage](05-print-and-signage.md#the-base-14-font-trap), which
  was found building this script: live shift roles contain em dashes, and
  PyMuPDF's built-in Helvetica silently renders them as a stray dot.
