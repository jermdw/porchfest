# Sign tower — four 48 × 96 in panels

The freestanding four-sided sign tower at the festival entrance. One HTML file
per side; headless Chrome prints each to a trim-size PDF.

| File | Panel |
| --- | --- |
| `side1-logo.html` | Identity — lockup, guitar, tagline, QR |
| `side1-logo-alt.html` | Same content, guitar-led (after the 160×600 ad banner) — an alternative for side 1, not a fifth face |
| `side2-map.html` | Venue map + on-site legend |
| `side3-sponsors.html` | Sponsor wall, by tier |
| `side4-lineup.html` | Full 41-act lineup by hour |

```bash
./render.sh                    # the four panels -> ~/Downloads/PorchFest_SignTower
./render.sh side1-logo-alt     # the alternative side 1 (not in the default set)
./measure.sh side3-sponsors    # check for clipped overflow
OUT=/somewhere ./render.sh     # different output dir
```

Like `scripts/generate_signage.py`, this is a **print tool** — nothing here is a
repo dependency and nothing is bundled or deployed. It only needs Google Chrome
plus poppler (`pdftoppm`, `pdfinfo`) and Pillow for the measure probe.

## Things that will bite you

- **`.banner` is fixed-height with `overflow:hidden`.** Content past the bottom
  is silently *clipped*, and `pdfinfo` still reports one page. Any edit that
  changes block heights needs `./measure.sh <panel>` afterwards — that is the
  only thing that catches it. (Sides 2 and 3 measure well *under* 96 in because
  their `.main` is `flex:1 1 auto`; the probe collapses that growth. Only an
  `OVERFLOW` verdict is a failure.)
- **Fonts are self-hosted** in `fonts/`, copied from `@fontsource`. They used to
  come from a Google Fonts `@import`; on a slow or offline render that silently
  fell back to Arial Narrow, which you would not notice until the 48-inch proof.
- **Asset paths are relative** and must stay that way. Sponsor logos point at the
  site's own `../../src/assets/sponsor-*.webp`, so the sponsor wall tracks the
  site. Everything else lives in `assets/` and `qr/`.
- `assets/guitar-bird-final.png` (2040 × 4752) is the **only high-resolution copy
  of the flag-guitar-with-dove illustration that exists anywhere.** Do not
  regenerate it from a smaller source.
- **The lockup is live type in League Gothic** (`fonts/`, SIL OFL), sized by one
  `--lockup-cap` per panel. That is the face the 2026 ad banners use — matched
  letterform-for-letterform, within 5% on SENOIA'S at equal cap height. Note
  that `--lockup-cap` is a *font-size*, not a cap height: rendered PORCHFEST
  comes out 4.49× that value, so 8.6in fills 38.6in of the 40in column. Push it
  past ~8.9in on a 4in-padded panel and the word runs into the trim.
- Sponsor logos are the site's 400 px web assets. At tower sizes the top tiers
  land around 25–40 dpi effective — acceptable for a sign read from 10 ft+, and
  precedent the DDA has already accepted, but real vector art always places
  better if a sponsor supplies it.
