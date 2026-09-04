# 01 — Annual Timeline

← [Playbook index](README.md)

## What actually happened in 2026

The entire digital and print operation was built in **three weeks and two days**.
First commit 2026-08-14; the event was Sunday 2026-09-06.

| Date | T-minus | What landed |
| --- | --- | --- |
| Aug 14 | T-23 | Site stood up (adapted from the Senoia Car Show), lineup, day-of map, brand inks, volunteer shifts |
| Aug 14–15 | T-23 | **First 13 stage-sponsor yard signs** generated and sent to print (from working notes — the generator itself was not committed until Aug 31) |
| Aug 15 | T-22 | SEO plumbing: robots, sitemap, per-route meta, Event JSON-LD, social cards |
| Aug 16 | T-21 | `/vip` ticketing live; mobile map overhaul; first printable lineup card |
| Aug 18 | T-19 | `/sponsors` page; CI auto-deploy on merge to `main`; day-of map PDF |
| Aug 20 | T-17 | Google Tag Manager + GA4 |
| Aug 21–26 | T-16 → T-11 | Nine PRs of sponsor/vendor roster churn as the roster kept changing |
| Aug 23–24 | T-14 | `/vendors`, `/faq` |
| Aug 28 | T-9 | Brand guide; **VIP/wayfinding signage generator**; personal data scrubbed from source comments |
| Aug 31 | T-6 | Sponsor-sign skill; **sign tower (4 × 48×96in panels)**; lineup changed twice; lineup card font fix |
| Sep 1–2 | T-5 → T-4 | Tower amenity icons; two late volunteer shifts; read-only organizer roster view |
| Sep 3 | T-3 | Two more yard signs; mobile + congested-network review |
| Sep 4 | T-2 | **Volunteer roster PDF**; two more yard signs (VIP Sold Out, Cooling Tent) |
| **Sep 6** | **0** | **Festival** |

### What that timeline cost

Read the right-hand column again. **Print artwork was still being generated two
days before the event**, and the lineup changed at T-6 — after the first sponsor
signs had already been printed and after tower panels had been laid out. Sponsor
roster churn consumed nine separate pull requests because the roster was still
moving while the pages were being built.

None of that was a mistake by the people doing it; it was the consequence of
starting at T-23. The single highest-leverage change for next year is **starting
the digital and print work earlier**, and specifically **locking the lineup
before any artwork is generated**.

---

## Recommended timeline for next year

Anchor everything to event day. The dates below assume a Sunday event in early
September; shift them wholesale if the date moves.

### T-6 months (March) — Foundations
- Confirm the date with the City of Senoia; confirm DDA budget.
- Decide whether the footprint changes (new streets, new porches). **If the venue
  boundary moves, the map base image and its bounding box must be regenerated
  together** — see [02 — Rollover](02-rollover-checklist.md#the-map-base-image).

### T-5 months (April) — Money in
- Open sponsorship sales. Create the year's Ticket Tailor events (a **new event
  per year**, so new IDs and new URLs — see
  [02](02-rollover-checklist.md#6-ticketing)).
- Start the sponsor roster as a spreadsheet the DDA owns. It will change all
  season; the website should read from it late, not early.

### T-4 to T-3 months (May–June) — Recruiting
- Recruit porch hosts and book bands. This is the long pole.
- Begin collecting sponsor logos **as sponsors sign**, not in August. Ask every
  sponsor for print-resolution or vector artwork at signing — one line in the
  sponsorship agreement removes most of the work in
  [06 — Logo Sourcing](06-logo-sourcing.md).

### T-2 months (July) — Roll the site over
- Run the whole of [02 — Rollover Checklist](02-rollover-checklist.md).
- Draft the volunteer shift CSV. Publish the site with the new date even if the
  lineup is still provisional.

### T-6 weeks — **Lineup lock**
- This is the deadline that matters most. Every piece of print artwork derives
  from the lineup, and each late change means re-generating the lineup card, the
  tower lineup panel, the tower map panel, and possibly reprinting.
- Communicate the lock date to the DDA and to band bookers explicitly, as a
  print deadline rather than a preference.

### T-4 weeks — Print
- Generate all artwork: stage-sponsor signs, wayfinding and VIP signs, the sign
  tower panels, the lineup card. See [05 — Print & Signage](05-print-and-signage.md).
- Send to the printer. Confirm the printer's own lead time and build backwards
  from it — this is the real constraint.
- After lineup lock, run the drift check in
  [08](08-open-decisions.md#the-four-hand-kept-copies-of-the-lineup) against every
  hand-kept copy.

### T-3 weeks — Open volunteer sign-ups
- Seed shifts to production, confirm confirmation emails actually send
  ([04](04-volunteer-system.md#confirmation-emails)), then publicise.
- Verify admin sign-in works for every organizer *before* they need it.

### T-1 week — Day-of readiness
- Print the volunteer roster ([04](04-volunteer-system.md#printable-roster)).
- Walk the site with the printed map; check every pin against reality.
- Test the live site on a phone on cellular data, not office wifi.

### Event day
- Keep one person able to deploy. Content changes to the SPA shell are served
  `no-cache`, so a corrected page appears immediately — but **replacing artwork
  in place does not propagate**; you must rename the file
  ([03](03-website-operations.md#caching)).

### T+1 week — Close the loop
- Update this playbook while it is fresh. Record what changed, what broke, and
  what you had to figure out.
- Archive the year's artwork somewhere durable, and note in
  [08](08-open-decisions.md) anything left unresolved.

---

## The one-line version

> Lock the lineup six weeks out. Everything painful in 2026 traces back to
> artwork being generated before the lineup stopped moving.
