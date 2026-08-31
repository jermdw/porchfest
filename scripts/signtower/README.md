# Sign tower — four 48 × 96 in panels

The freestanding four-sided sign tower at the festival entrance. One HTML file
per side; headless Chrome prints each to a trim-size PDF.

| File | Panel |
| --- | --- |
| `side1-logo.html` | Identity — wordmark, guitar, tagline, QR |
| `side2-map.html` | Venue map + on-site legend |
| `side3-sponsors.html` | Sponsor wall, by tier |
| `side4-lineup.html` | Full 41-act lineup by hour |

```bash
./render.sh                 # all four -> ~/Downloads/PorchFest_SignTower
./render.sh side3-sponsors  # one panel
./measure.sh side3-sponsors # check for clipped overflow
OUT=/somewhere ./render.sh  # different output dir
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
- Sponsor logos are the site's 400 px web assets. At tower sizes the top tiers
  land around 25–40 dpi effective — acceptable for a sign read from 10 ft+, and
  precedent the DDA has already accepted, but real vector art always places
  better if a sponsor supplies it.
