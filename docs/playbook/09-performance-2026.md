# 09 — 2026 Website Performance Report

Source: Google Analytics 4, property `senoiaporchfest` (550721672), pulled
2026-10-11. Window: Sun Aug 30 – Wed Sep 9, 2026 (show day = Sun Sep 6, so this
is show day −7 through +3, the same relative window as the car show's report).
Times are the property's timezone.

GA4 tracking began 2026-08-20, so **2026 is the first year with data — this is
the baseline** future years compare against.

Metric definitions (use the same ones next year): **Views** = `page_view` events;
**Active users** = GA4 active users (daily figures do not sum to the range
total); **Sessions** = GA4 sessions; **Engagement** = average engagement time per
active user.

> This chapter is a dated snapshot of results, not a statement of event facts —
> the README's "no event facts" rule is about lineups, prices and rosters, which
> still live in `src/data/*.js`.

## Headline numbers (Aug 30 – Sep 9)

| Metric | Value |
|---|---|
| Page views | 42,835 |
| Active users (unique, whole window) | 4,104 |
| Sessions | 6,527 |
| Engaged sessions / engagement rate | 4,164 / 63.8% |
| Avg engagement time per active user | 1m 33s |
| Views per active user | 10.44 |
| Events | 58,910 |
| Key events (conversions) | 0 — see Gaps |

## Day by day

| Date | | Views | Active users |
|---|---|---|---|
| Sun 8/30 | | 677 | 109 |
| Mon 8/31 | | 2,299 | 339 |
| Tue 9/1 | | 2,420 | 325 |
| Wed 9/2 | | 1,898 | 283 |
| Thu 9/3 | | 2,282 | 331 |
| Fri 9/4 | | 3,124 | 484 |
| Sat 9/5 | day before | 5,257 | 658 |
| **Sun 9/6** | **SHOW DAY** | **23,937** | **1,805** |
| Mon 9/7 | | 620 | 119 |
| Tue 9/8 | | 196 | 53 |
| Wed 9/9 | | 125 | 19 |

The daily views sum exactly to the window total (42,835).

Show day alone was 55.9% of all views in the window — 10.8x the 8/31–9/3 average
(~2,225 views/day), 4.6x the day before, and 35x the Aug 30 low. Show day plus
the day before is 68% of the window. The day after (620) was 2.6% of show day:
**the site is a day-of tool, and demand falls off a cliff at close.**

## Show day (Sep 6) by page

| Page | Views | Active users | Avg engagement |
|---|---|---|---|
| `/map` | 15,207 | 1,033 | 2m 04s |
| `/schedule` | 3,696 | 853 | 51s |
| `/` | 3,201 | 1,517 | 9s |
| `/vendors` | 732 | 223 | 35s |
| `/faq` | 542 | 152 | 31s |
| `/vip` | 281 | 90 | 29s |
| `/sponsors` | 131 | 40 | 47s |
| `/volunteer` | 119 | 35 | 17s |
| `/admin` | 28 | 6 | 28s |

`/map` was **63.5% of show-day views** at 14.7 views per user. Together `/map` and
`/schedule` carried 79% of the day.

## Whole window by page

| Page | Views | Active users | Avg engagement |
|---|---|---|---|
| `/map` | 23,186 | 1,862 | 1m 47s |
| `/schedule` | 7,371 | 1,720 | 56s |
| `/` | 7,335 | 3,431 | 10s |
| `/vendors` | 1,548 | 505 | 31s |
| `/faq` | 1,233 | 332 | 34s |
| `/vip` | 1,073 | 321 | 34s |
| `/volunteer` | 525 | 175 | 30s |
| `/sponsors` | 396 | 109 | 55s |
| `/admin` | 156 | 21 | 57s |
| `/bands` | 5 | 0 | 0s |

(15 paths in all; the five not shown account for 7 views between them.)

`/map` is 54% of every view in the window, with 12.45 views per user and the
longest engagement of any public page. The home page reached 84% of all active
users but held them for 10 seconds — it works as a router to `/map` and
`/schedule`, not a destination.

## Traffic sources (Aug 30 – Sep 9 sessions)

| Channel | Sessions | Share | Engagement rate |
|---|---|---|---|
| Organic Search | 2,661 | 40.8% | 64.7% |
| Organic Social | 1,769 | 27.1% | 72.9% |
| Direct | 1,500 | 23.0% | 47.7% |
| Referral | 678 | 10.4% | 66.8% |
| Unassigned | 4 | 0.1% | — |
| AI Assistant | 2 | <0.1% | — |

Social was the most engaged big channel (72.9%); Direct the least (47.7%).
Direct is plausibly QR-code scans from the printed signage — that is a guess,
not a measurement, and there is no UTM tagging to confirm it (see Gaps).

## Audience

- **Browser (active users):** Safari 2,727 (66%), Chrome 1,172 (29%), Edge 78,
  Safari in-app 51, Firefox 26, Samsung Internet 25. Two-thirds Safari matches
  attendees using the map from iPhones — keep `/map` and `/schedule`
  mobile-first and test on iOS Safari first.

## Volunteers (shift fill, read 2026-10-11)

Source: the public `events/2026/shifts` documents (`spotsFilled` / `spotsTotal`),
which hold counts only — no volunteer details. `spotsFilled` is spots currently
held by active sign-ups, so cancelled spots are already removed. It counts
**spots, not people**, and it includes the pre-registered volunteers seeded from
the organizer sheet as well as self-serve sign-ups.

**54 of 55 spots filled (98%) across 31 shifts.** 30 shifts filled completely, 1
partly, none empty. The one gap: **Golf Cart Roadie, 6–8 PM, 2 of 3** (the role
requires a volunteer's own golf cart, which narrows the pool).

Not available here: sign-ups per day, how many distinct people volunteered, or
how many were pre-registered vs. self-serve. Those need the private `signups`
records; pull them as aggregate counts only.

## Email

**Nothing to report — PorchFest sent no email in 2026.** The Resend account has
one verified domain, `senoiacar.show`; `senoiaporchfest.org` was never added, so
no PorchFest delivery data exists. This confirms the open item from the spring
status block: `RESEND_API_KEY` stayed `placeholder`, so every volunteer
confirmation was skipped (see
[04 — Confirmation emails](04-volunteer-system.md#confirmation-emails)).
Sign-ups were unaffected — they succeed regardless — but no volunteer received
their `/cancel` link by email.

If email is turned on next year, do it **with tracking from the start**: the car
show's report found open and click tracking were off in Resend's domain settings,
so its zeros were missing data rather than lack of engagement.

## Ticket Tailor (as of 2026-10-11)

Read from the DDA box office event summaries. Sales are for each event's whole
selling period, not just show week. These are aggregate counts; admission to
PorchFest is free, so there is no attendee ticket — only the three events below.
The VIP and food/vendor events are published as separate Ticket Tailor events.

**Combined across the three 2026 events: $30,500** (2025: $23,400).

**VIP Luxury Lounge** (`ev_8805677`): **67 tickets, $6,700 — sold out** (0
remaining of 67). Event page views: 1,160. Ticket Tailor shows 0 checked in, so
the check-in app was not used and lounge attendance is unmeasured.

**Sponsorships** (`ev_8121226`): **29 sold, $21,500**, 45% of the 64 available.
Event page views: 1,632.

| Tier | Sold | Available | Left |
|---|---|---|---|
| Presenting | 1 | 1 | 0 — sold out |
| Title | 3 | 3 | 0 — sold out |
| Gold | 5 | 10 | 5 |
| Silver | 5 | 10 | 5 |
| Porch | 13 | 30 | 17 |
| Kid's Corner | 2 | 10 | 8 |

**Food / Drink / Art registration** (`ev_8472588`): **14 registered, $2,300**, 20%
of the 70 spots. Event page views: 525.

| Type | Registered | Spots | Left |
|---|---|---|---|
| Food truck | 9 | 15 | 6 |
| Food stand | 4 | 15 | 11 |
| Drink stand | 1 | 15 | 14 |
| Artists Alley | 0 | 25 | 25 |

### Against 2025

| Event | 2025 | 2026 |
|---|---|---|
| VIP | 72 tickets, $7,200 | 67 tickets, $6,700 |
| Sponsorships | 24 sold, $13,500 | 29 sold, $21,500 |
| Food / Drink / Art | 29 registered, $2,700 | 14 registered, $2,300 |
| **Combined** | **$23,400** | **$30,500** (+30%) |

Sponsorship revenue rose 59% on five more sponsors and carried the year. The
tiers moved up as well as out: Presenting and Title both sold out. Registration
for food and art went the other way, roughly halving. The 2025 figures are the
totals Ticket Tailor shows for last year's events today; their tiers and
capacities were not re-read.

## Takeaways

1. **One day carries the whole site.** 56% of views landed on show day and 68%
   across the final two days; the Monday after was 2.6% of show day. Anything
   needed on show day should be live by Thursday, and nothing after the event
   needs the same hosting headroom.
2. **`/map` is the product.** 54% of all views, 63.5% on show day, and the
   deepest engagement. Spend polish time here first, and keep it mobile-first.
3. **Mobile Safari is the audience** (66% Safari). Check iOS before anything
   ships.
4. **Social over-delivered on quality.** 27% of sessions at the highest
   engagement rate of the three large channels — worth the same care as search.
5. **Volunteer shifts were effectively full** (98%). The system met demand; the
   work for next year is the email path, not capacity.
6. **Sponsorships drove the money.** $21,500 of the $30,500 (70%), up from $13,500
   in 2025, with the top two tiers sold out. The VIP lounge sold out too, so its
   ceiling — not demand — set that number. The soft spot is food and art
   registration, down from 29 to 14, with Artists Alley at zero of 25.

## Against the sister site

Same relative window (show day −7 through +3), same GA4 definitions.

| Metric | PorchFest 2026 | Car Show 2026 |
|---|---|---|
| Page views | 42,835 | 21,185 |
| Active users | 4,104 | 3,275 |
| Sessions | 6,527 | 5,008 |
| Engagement rate | 63.8% | 57.7% |
| Show day views | 23,937 | 6,825 |
| Show day vs. Mon–Thu average before it | 10.8x | 4.3x |
| Show day share of window | 55.9% | 32.2% |
| Safari share of active users | 66% | 60% |

PorchFest is the spikier site: a single-day, walk-around event where the map is
the whole experience, against the car show's two-day build-up (poker run Friday,
registration close). Different events — compare shape, not size.

## Gaps — not captured in this report

- **No conversions.** GA4 shows 0 key events across the window, including on
  `/volunteer`, even though the playbook says `volunteer_signup` is marked as a
  key event. Either the event did not fire, is not actually marked, or the
  Events report (which would not load for this pull) shows otherwise. Check the
  Events and Key events admin screens before next year. Outbound clicks to Ticket
  Tailor are not tracked either, so site traffic cannot be tied to ticket sales.
- **Sessions per day** and the **show-day channel split** — only whole-window
  channels were pulled.
- **Hourly show-day curve** (the map's peak hour) — grab it from GA4 Realtime or
  Explore *during* the next event.
- **Internal traffic is included.** `/admin` shows 156 views / 21 users in the
  window, which is organizers, not visitors. No internal-traffic filter is set.
- **Email and distinct volunteers** — see their sections above.
- **Ticket sales over time.** Only end-of-period totals were read from Ticket
  Tailor; a sales-by-day curve (and when sales followed site traffic) needs the
  Ticket Tailor sales report exported. Check-in was not used, so VIP attendance
  is unknown. The VIP lounge sold out at 67, so demand beyond that is unmeasured.
- **No UTM tagging** on signage QR codes or social posts, so Direct cannot be
  split into "scanned a sign" vs. "typed it in".
- **Ad-blocker / privacy undercount.** GA4 misses blocked users; treat the
  numbers as a floor, and compare only against future GA4 numbers.
- **Server-side metrics** (Hosting bandwidth, Functions errors) — not pulled.
- **No prior-year comparison exists** for the site (new in 2026; the legacy
  enjoysenoia.com page had no shared analytics).
- GA4's AI insights flagged traffic falling on Sep 12–13 (e.g. `/` to 28 views
  against an expected 437). That is the post-event cliff plus the site's
  switch to post-event copy, not an outage.

## Reproducing this next year

GA4 report URLs accept a custom range:
`.../a403948353p550721672/reports/explorer?r=all-pages-and-screens&params=_u.date00%3DYYYYMMDD%26_u.date01%3DYYYYMMDD`
(also `r=lifecycle-traffic-acquisition-v2` and `r=user-technology-detail`).
Pull show day −7 through +3, plus each single day for the daily table (the
all-pages report's Total row gives that day's views and active users).
