# 08 — Open Decisions & Known Issues

← [Playbook index](README.md)

Things that look like bugs and are not, decisions still owed an answer, and
issues handed forward. **Read this before "fixing" anything that seems wrong.**

---

## The four hand-kept copies of the lineup

`src/data/schedule.js` is the source of truth — but **only `/schedule` and
`/map` read it.** Four other places carry their own hardcoded copy and must be
edited by hand on every lineup change:

| Copy | Extra hazard |
| --- | --- |
| `scripts/lineup_card_template.html` | Also carries per-hour **"N Acts" pills** as separate literals from the act lists — they can disagree with the list beside them |
| `scripts/signtower/side4-lineup.html` | Tower lineup panel |
| `scripts/signtower/side2-map.html` | Tower map pins are **baked percentages**, not derived — a retired stage's pin survives and must be deleted by hand |
| `public/lineup-poster-2026.png` | A raster with **no source file in the repo** — see [below](#stale-artwork-with-no-source) |

### The check to run after every lineup edit

**Set-compare each copy against `schedule.js` on `(hour, stage) → act`.** Do not
read them side by side; compare them as sets. A 2026 lineup move left one hour's
pill claiming eight acts while listing seven, and that is exactly the class of
error reading catches too late.

Expect only these benign differences:

- Curly quotes on the tower panel.
- Column-fitting abbreviations on the lineup card (a long band name shortened to
  fit).

Anything else is drift.

> The tower panels are **print**. Settle every lineup question before the tower
> goes to the printer.

### The tower map uses a different bounding box

`scripts/signtower/side2-map.html` uses a z19 crop, whose bounding box differs
from `BBOX` in `src/lib/venueGeo.js`. To identify an unlabelled pin on it, fit
the bounding box from two known pins and compare the X percentage — that method
matched to within 0.1%.

---

## Deliberate decisions that look like defects

### Two blues on the print signage
Yard signs are royal blue `#002FA7`; banners and towers are brand navy
`#101D3A`. This is intentional and calibrated to physical ink samples. Full
reasoning in [05](05-print-and-signage.md#the-two-blues--do-not-unify-them).

### The grey squares on the map are OpenStreetMap parking lots
Pale grey fill with a dashed outline, baked into the base image; the solid tan
shapes are buildings. They sit behind amenity pins because the beverage stations,
restrooms and kids' area really are in those lots.

Verified in 2026: present in both the PNG proof and the PDF, rendered identically
by two engines, and unaffected by washing the base image toward white.

Removing them means re-stitching the base from a fill-free tile style — and
`BBOX` must be regenerated in the same pass or **every pin moves**, on the live
`/map` as well as the tower. Left as-is deliberately.

### Duplicate volunteer sign-up emails are allowed
Households share an address. Not a validation gap.

### `html` background is navy on purpose
So iOS overscroll matches the footer.

### There is no CMS
Page content is hardcoded by choice.

---

## Open questions for the organizers

These are assumptions currently baked into the site and the artwork. Each needs a
real answer, and each will otherwise be re-guessed next year.

1. **Stage number at 57 Morgan St.** The official 2026 card prints "15" for this
   address *and* for another; the printed map shows 26 on Morgan. The site uses
   **26**. Confirm which is correct and fix the card.
2. **The published act and porch counts.** The marketing copy states counts that
   the schedule data does not currently support, after a mid-season act
   withdrawal and a stage retirement. The organizers chose to leave the copy
   unchanged in the expectation of refilling the vacancy. **Reconcile the copy
   against `src/data/schedule.js` before publishing next year's numbers.**
   The counts appear in `src/pages/Landing.jsx`, `src/pages/Schedule.jsx` (both
   the SEO description *and* the body), `src/pages/Bands.jsx`,
   `scripts/lineup_card_template.html`, and both tower `side1-logo*.html` files.
3. **The VIP event window on Ticket Tailor** is listed as 2:00–3:00 PM. That is
   on their side, not ours, and is likely just the kickoff hour. The DDA may want
   to widen it.
4. **Five Lower Creek Trail porch pins are interpolated** to within about ±30 m
   from house-number data. Worth an eyeball against the paper map, and worth
   correcting permanently in `src/data/eventMap.js` if they are off.
5. **Clean-up crew timing** was read from a handwritten sheet as 8:00–9:00 PM.
   Confirm.

---

## Stale artwork with no source

**`public/lineup-poster-2026.png`** — the alphabetical "Featured Performers"
graphic — still lists an act that withdrew. It is referenced in `index.html`'s
Event JSON-LD `image` array.

It reads as a design-tool export with a hand-illustrated guitar and **has no
generator in this repository**. Fixing it means obtaining the original source
file from whoever made it, or redrawing it; editing the raster in place would
mean reflowing every row below the deleted one.

> **Action for next year:** either get the source file into the DDA's Drive, or
> replace this poster with something generated from `schedule.js` like everything
> else. This is the last piece of artwork that cannot be rebuilt from code.

---

## PII: resolved, and what remains

The repository is public. Two exposures were found while writing this playbook
and **both were fixed** in the same pull request:

1. **`CLAUDE.md` listed five organizers' personal email addresses** (the admin
   allowlist), plus the operations account throughout its commands. The allowlist
   is *data in Firestore*, so the file never needed to name anyone: it now
   describes the roster and points at
   [07 — Accounts & Access](07-accounts-and-access.md), and commands use an
   `<ops-account>` placeholder named only in the DDA's private Drive companion.

2. **`data/shifts_<year>.csv` contained ten volunteers' full names**, each paired
   with a location and time on a specific date. The committed CSV now carries
   open slots only; the working sheet lives at `data/shifts_<year>.local.csv`,
   gitignored. See
   [04 — The shift CSV](04-volunteer-system.md#the-shift-csv).

> **Git history still holds both.** Scrubbing the files removes them from the
> current tree and from everything published going forward, but the old commits
> remain reachable to anyone who looks. Erasing those would mean rewriting the
> history of a public repository and force-pushing it — destructive, and it
> breaks every existing clone and PR. **That was deliberately not done.** If the
> DDA decides the history must be purged too, that is a separate, considered
> operation to plan on its own.

Keep it that way: the checklist in [the index](README.md#2-this-is-a-public-document)
is the standing rule for anything added here.

An earlier 2026 pull request removed personal and payment details from source
comments, so this repository has now been scrubbed twice.

## Console-only setup that must be verified each year

These cannot be done from code and are easy to forget:

- [ ] **Authentication → Sign-in method** — enable **Google** and **Email link**.
      Until this is done, *no admin can log in*.
- [ ] **Authentication → Settings → Authorized domains** — add
      `senoiaporchfest.org` once Hosting shows the domain as Connected.
      Otherwise Google sign-in fails from the custom domain with a generic error.
- [ ] **Resend** — verify the sending domain, set the real `RESEND_API_KEY`, then
      run the deploy workflow **by hand with "Also deploy Cloud Functions"
      ticked**. Until then the secret is a `placeholder-*` value, sends are
      skipped, and volunteers cannot self-cancel.
- [ ] Optional: add a DNS record for `www.senoiaporchfest.org` — it currently has
      none.
- [ ] Optional: delete the unused stray Firebase project created by mistake in
      2026.
