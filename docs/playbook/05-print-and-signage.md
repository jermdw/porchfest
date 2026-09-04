# 05 — Print & Signage

← [Playbook index](README.md)

Every piece of physical artwork is **generated from code** in this repository —
PyMuPDF scripts for signs, headless Chrome for HTML-laid-out panels. Nothing is
made in a design app, which is why it can all be regenerated next year without
anyone owning a licence or remembering where a file went.

None of these tools are website dependencies. Nothing here is bundled or
deployed.

---

## The sign families at a glance

| Artwork | Size | Tool | Ink |
| --- | --- | --- | --- |
| Stage-sponsor yard signs | 24 × 18 in | `.claude/skills/porchfest-sponsor-signs/` | Royal blue `#002FA7` |
| Area signs (Kids' Area, etc.) | 36 × 24 in | same skill, `gen_area_sign.py` | Royal blue `#002FA7` |
| VIP / wayfinding yard signs | 24 × 18 in | `scripts/generate_signage.py` | Royal blue `#002FA7` |
| VIP Luxury Lounge banner | 96 × 18 in | `scripts/generate_signage.py` | Brand navy `#101D3A` |
| One-off yard signs | 24 × 18 in | `scripts/generate_more_signage.py` | Royal blue `#002FA7` |
| Sign tower | 4 × (48 × 96 in) | `scripts/signtower/` | Brand navy `#101D3A` |
| Public lineup card | PDF | `scripts/render-lineup-card.sh` | Brand palette |
| Volunteer roster | PDF | `scripts/generate_volunteer_roster.py` | — |

---

## The two blues — do not unify them

PorchFest print signage deliberately runs **two different blues**. This looks
like an inconsistency and is not. Do not "fix" it.

- **Yard signs** — white ground, Oswald Bold in **royal blue `#002FA7`**,
  mirrored dove bottom-right. That royal blue was chosen off **physical ink
  samples**, not from the brand tokens. Roughly 24 signs were printed in it for
  2026, so a new yard sign in brand navy would visibly mismatch the batch
  standing beside it, in the same venue, on the same day.
- **Banners and sign towers** — the brand guide proper: navy `#101D3A` ground,
  cream `#F5F1E6` type, the true-vector wordmark.

Flag red `#B02A30` is the one brand token used on **both**. It is legible on
white and on navy, so it carries section rules and arrows everywhere.

> "Use the brand guidelines" on a print job means Oswald, the layout, the voice
> and the house sign system. It does **not** override a print-calibrated ink.

Yard sign PDFs carry **no white background fill**, matching the files the printer
has already run successfully. Contact sheets must therefore supply their own
white.

---

## Stage-sponsor signs

Fully documented, step by step, in
**`.claude/skills/porchfest-sponsor-signs/SKILL.md`** — read that when you
actually need to build signs. It covers sourcing, logo preparation, the JSON
spec, and verification.

Everything it needs is committed: `gen_sponsor_signs.py`, `gen_area_sign.py`,
`build_signs.py`, `assets/Oswald-Bold.ttf`, `assets/dove.png`.

The short version:

```bash
python3 -m venv /tmp/porchfest-signs-venv
/tmp/porchfest-signs-venv/bin/pip install -q pymupdf pillow
/tmp/porchfest-signs-venv/bin/python \
  .claude/skills/porchfest-sponsor-signs/scripts/build_signs.py spec.json <outdir>
```

It writes one PDF per sponsor, a `proof.png` contact sheet, and a delivery zip.

**Read the placed-logo sizes it prints.** Anything under about 3 in will look
like an afterthought on a 24 × 18 in sign — go back to sourcing
([06](06-logo-sourcing.md)) rather than shipping it small. Then actually look at
`proof.png` before delivering.

---

## VIP, wayfinding and one-off signs

Two scripts in `scripts/`, and the relationship between them is the pattern to
follow:

- **`scripts/generate_signage.py`** — VIP and wayfinding yard signs plus the
  96 × 18 in VIP Luxury Lounge banner. Self-contained: it derives the Oswald TTF
  from `node_modules/@fontsource/oswald` at run time (walking up parent
  directories, so it works from a git worktree), keeps its dove and
  print-resolution logos in `scripts/assets/`, and writes to
  `~/Downloads/PorchFest_VIP_Signage/` with a `_proof.png` contact sheet.

  ```bash
  pip install pymupdf
  python3 scripts/generate_signage.py
  ```

- **`scripts/generate_more_signage.py`** — one-off signs. It does
  `import generate_signage as base` and **reuses** that script's fonts, palette
  and layout helpers rather than duplicating them.

> **The pattern: import, don't fork.** For any future one-off sign that is not
> part of the VIP batch or the stage-sponsor roster, add a function to
> `generate_more_signage.py` (or write a small new script) that imports the
> closest existing generator as a module. Copying helpers is how a sign family
> stops looking like a family.
>
> Copy the *closest* structure, not the most convenient one. The "Cooling Tent"
> sign was kept as its own function rather than parameterising the "Food Truck
> Alley" one, because that sign has a deliberate eyebrow/headline inversion
> requested as a one-off — reusing it directly would have silently applied that
> reasoning to a sign nobody asked to invert.

---

## The sign tower

Four 48 × 96 in panels at the festival entrance, one HTML file per side,
printed to trim-size PDF by headless Chrome.

**`scripts/signtower/README.md` is the authority.** It documents each panel, the
render and measure commands, and its own set of traps. Do not duplicate it here.

The two that will cost you a reprint if you forget them:

- **`.banner` is fixed-height with `overflow: hidden`.** Content past the bottom
  is silently *clipped*, and the PDF still reports one page. Any edit that
  changes block heights needs `./measure.sh <panel>` afterwards — that probe is
  the only thing that catches it.
- **It must be Chrome or Chromium.** The panels use flexbox and
  percentage-positioned pins, and Chrome's `--print-to-pdf` is the only engine
  that lays them out the way the preview did.

Fonts are **self-hosted** in `scripts/signtower/fonts/`. They used to come from a
Google Fonts `@import`; on a slow or offline render that silently fell back to
Arial Narrow — which you would not notice until the 48-inch proof.

---

## The public lineup card

```bash
./scripts/render-lineup-card.sh
```

Headless Chrome over `scripts/lineup_card_template.html`, writing
`public/senoia-porchfest-2026-lineup-card.pdf`, which `/schedule` and `/map` link
to. It also asserts that the per-hour "N Acts" pills match the act counts.

### Sanity-check every card you generate

A correct card reports **`Producer: Skia/PDF`** and is roughly **470–550 KB**.

A ReportLab producer, or a file around 11 KB, means something has overwritten it
with a broken generator. `scripts/generate_lineup_pdf.py` was **deleted in 2026
because it was exactly that trap** — a second generator with its own third copy
of the schedule, writing the same output path, whose layout drew act columns
straight over the VIP and closing-act banner. Running it silently replaced the
good card with a broken one. Do not reintroduce it.

---

## Type and layout rules

### Centre on cap height, not the metric box

Every headline is all-caps. Centre it on **cap height** — Oswald's is 0.81 em,
unusually tall — not on the ascender/descender box the font reports. Centring on
the metric box leaves signs visibly top-heavy, because the accent space above
and the descender space below sit outside the letterforms.

`generate_signage.py` does this correctly. The older stage-sponsor generator does
not.

### The effective-dpi floor

Every generator caps a raster logo at an effective-dpi floor, so a low-resolution
mark places at an honest size instead of being blown up to mush:

| Artwork | Floor |
| --- | --- |
| Yard signs (`generate_signage.py`) | 52 dpi |
| The 96-inch banner | 30 dpi |
| Stage-sponsor signs (older generator) | 60 dpi |

A logo needs roughly **800 px of height or more** to fill a yard sign. Below
about 400 px, use a name-only layout instead.

### The base-14 font trap

PyMuPDF's built-in Helvetica aliases — `fontname='helv'` / `'hebo'`, used with no
`insert_font` call — **silently substitute a stray dot glyph** for any character
outside their limited built-in encoding. There is no error, so it is easy to
ship without noticing.

The em dash (—) is one such character, and live shift roles in Firestore contain
them. So text pulled from a database, not just hardcoded strings, is at risk.

> **The fix: embed a real webfont for _all_ text in the document**, not just
> headlines — rather than auditing every string for characters the base-14 fonts
> might lack. `generate_volunteer_roster.py` does this.

---

## The 2026 lockup

The DDA's ad banners use a flat **SENOIA'S 5ᵗʰ ANNUAL / PORCHFEST** lockup, not
the arched `src/assets/porchfest-wordmark.svg`. The typeface is **League Gothic**
(SIL Open Font Licence, on Google Fonts, bundled in `scripts/signtower/fonts/`),
identified by rendering candidates at the sample's cap height and comparing the
letterforms one for one.

> **Their PORCHFEST is that same face horizontally squashed to about 71%.** Two
> different widths in one lockup is not something a real font does — it is a text
> box dragged narrow to survive a 90-pixel-tall ad slot. **Do not reproduce the
> squash on large-format work.**

Two traps if this comes up again:

- **Do not try to lift the mark from the artwork.** The largest ad banner puts
  PORCHFEST at 165 × 56 px — about 7 dpi on a 48-inch panel.
- **Aggregate width and ink metrics pick the wrong font.** Scoring whole words
  ranked a different face first by a factor of five, and it is visibly far too
  light and 23% too narrow. Per-glyph measurement (the `O` width and stem width
  against cap height) plus an actual side-by-side render is what settles it.

Note that `--lockup-cap` in the tower panels is a **font-size, not a cap
height**: rendered PORCHFEST comes out 4.49× that value.

The ad banners also carry pure red `#c00000` and pure white on the unchanged
brand navy. Sample the **interior** of a stroke when picking colour off artwork —
edge pixels blend toward the background.

---

## The dove

The dove mascot exists **only fused into the flag-guitar illustration**. Two
prepared copies are committed:

- `scripts/assets/porchfest-dove-flip.png`
- `.claude/skills/porchfest-sponsor-signs/assets/dove.png`

The flag-guitar-with-dove illustration itself is
`scripts/signtower/assets/guitar-bird-final.png` (2040 × 4752) — **the only
high-resolution copy that exists anywhere.** It is in version control. Do not
regenerate it from a smaller source.

<details>
<summary>Rebuilding the dove from scratch, if every copy is ever lost</summary>

Extract the 3600 × 2700 raster embedded in any band yard-sign PDF, crop
`(700, 780, 1250, 1330)`, white out `[0, 400, 550, 550]` and `[0, 0, 30, 550]`,
threshold-trim at v < 215 with 6 px padding, upscale 3× to 1035 × 900. The belly
line is occluded by the guitar in the source art and must be redrawn as a
quadratic bezier — p0 `(80, 868)`, p1 `(400, 1005)`, p2 `(660, 855)` — width 26,
colour `(20, 18, 20)`, on a canvas extended to 1000 px tall with
`[150, 852, 595, 1000]` erased first. Trim again to about 1020 × 950.

This is fiddly. Only do it if the asset is genuinely gone, not to "improve" the
existing one.
</details>

Note the dove is **mirrored to face into the sign** on the bottom-right corner
where it sits.
