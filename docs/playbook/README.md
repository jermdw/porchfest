# Senoia PorchFest — Organizer's Playbook

How this festival gets built each year: the website, the volunteer system, the
ticketing, and every piece of print artwork — written so that next year's
planners can pick it up cold, a full year later, without re-deriving any of it.

**Start here, then read [01 — Annual Timeline](01-annual-timeline.md).**

| # | Chapter | Read it when |
| --- | --- | --- |
| 01 | [Annual Timeline](01-annual-timeline.md) | Planning the year. What happens when, and what 2026 got wrong. |
| 02 | [Rollover Checklist](02-rollover-checklist.md) | Turning last year's site into this year's. |
| 03 | [Website Operations](03-website-operations.md) | Editing, deploying, or debugging senoiaporchfest.org. |
| 04 | [Volunteer System](04-volunteer-system.md) | Shifts, sign-ups, the roster, admin access. |
| 05 | [Print & Signage](05-print-and-signage.md) | Yard signs, banners, the sign tower, the lineup card. |
| 06 | [Logo Sourcing](06-logo-sourcing.md) | You need a sponsor's logo at print resolution. |
| 07 | [Accounts & Access](07-accounts-and-access.md) | You need to get into something. |
| 08 | [Open Decisions & Known Issues](08-open-decisions.md) | Before you "fix" something that was decided deliberately. |

---

## Two rules that keep this document alive

### 1. This playbook does not restate event facts

No act counts, porch counts, prices, dates, lineups, or rosters live in these
pages. Those change, and a copy of them here would be a **fifth** hand-maintained
copy of data that already drifts (see
[08 — the four hand-kept lineup copies](08-open-decisions.md#the-four-hand-kept-copies-of-the-lineup)).

This playbook records **process, decisions, and traps**. When you need a fact, it
tells you which file owns it. If you find yourself pasting a lineup or a sponsor
list in here, stop — put it in the file that owns it and link to that instead.

### 2. This is a public document

The repository is public, so everything here is world-readable. Keep it that way
by keeping personal information out:

- **No porch host names, and never a host name next to a home address.** Porch
  hosts are private individuals lending their houses.
- **No volunteer or organizer personal names**, and no email addresses or phone
  numbers. Refer to roles: "the DDA coordinator," "the co-chairs."
- **Sponsor and vendor businesses are fine** — they are publicly listed on the
  site already. Their *contact people* are not.
- Names, emails, the admin roster and vendor contacts belong in the **private
  companion document** kept in the DDA's Google Drive, not here. See
  [07 — Accounts & Access](07-accounts-and-access.md).

> Two PII exposures found while writing this playbook — organizer emails in
> `CLAUDE.md`, and volunteer names in the shift CSV — were **fixed**. See
> [08 — PII: resolved, and what remains](08-open-decisions.md#pii-resolved-and-what-remains),
> which also explains why git history was deliberately left alone.

---

## How to keep this current

This playbook is version-controlled next to the code it describes, which is the
whole point: a change to the site and the change to its documentation go in the
**same pull request**, get reviewed together, and cannot drift apart the way a
Google Doc or a wiki page silently does.

So the maintenance rule is simply:

> **If you learn something the hard way, the fix and the write-up ship together.**

Practically, that means when you finish a piece of work, ask whether the next
person would have needed twenty minutes to rediscover something you now know. If
so, add it to the relevant chapter in the same PR. Most of this document was
written that way.

### Where each kind of knowledge goes

| Kind of thing | Where it belongs |
| --- | --- |
| How to do a recurring job | This playbook |
| Why the code is shaped the way it is | `CLAUDE.md` (architecture, invariants, gotchas) |
| The brand's colours, type, logo rules | `docs/brand-guide.html` |
| How to build stage-sponsor signs, step by step | `.claude/skills/porchfest-sponsor-signs/SKILL.md` |
| Sign tower panel specifics | `scripts/signtower/README.md` |
| Event facts (lineup, map, sponsors, vendors, FAQ) | `src/data/*.js` |
| Names, emails, phone numbers, contracts | The DDA's private Drive — **never this repo** |
