#!/bin/bash
# Measure a panel's TRUE rendered content height:  ./measure.sh side3-sponsors
#
# Why this exists: .banner has a fixed height + overflow:hidden, so content that
# runs past the bottom is silently CLIPPED rather than paginated. `pdfinfo` will
# happily report "Pages: 1" on a sign whose last block is cut in half. Run this
# after ANY edit that changes block heights.
#
# Rather than pattern-matching the source (brittle - it silently no-ops the
# moment a dimension changes, reporting a false pass), this appends an override
# <style> block just before </head>. Later CSS + !important wins regardless of
# how the original is formatted, so this works at any banner size.
set -euo pipefail
cd "$(dirname "$0")"

f="$1.html"
[ -f "$f" ] || { echo "no such panel: $f" >&2; exit 1; }
mkdir -p .measure

# Target height declared by the file itself, so this never drifts from the source.
TARGET=$(perl -ne 'if (/\@page\s*\{\s*size:\s*[\d.]+in\s+([\d.]+)in/) { print $1; exit }' "$f")
[ -n "$TARGET" ] || { echo "could not parse @page height from $f" >&2; exit 1; }

perl -0pe 's{</style>\s*</head>}{</style>
<style>
  \@page { size: 48in 400in; margin: 0; }
  html, body { height: 400in !important; background: #ff00ff !important; }
  .banner   { height: auto !important; overflow: visible !important; }
</style>
</head>}s' "$f" > .measure/probe.html

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf-no-header \
  --print-to-pdf=".measure/probe.pdf" \
  --virtual-time-budget=20000 "file://$PWD/.measure/probe.html" 2>/dev/null

# Guard: if the override @page didn't take, content spills onto page 2 and the
# raster below would measure only page 1 - a false pass of exactly the kind this
# script exists to prevent.
PAGES=$(pdfinfo .measure/probe.pdf | awk '/^Pages:/{print $2}')
[ "$PAGES" = "1" ] || { echo "MEASURE FAILED: probe rendered $PAGES pages, expected 1" >&2; exit 1; }

pdftoppm -r 20 -png -singlefile .measure/probe.pdf .measure/probe 2>/dev/null
TARGET="$TARGET" PANEL="$1" python3 - <<'PY'
import os
from PIL import Image
im = Image.open('.measure/probe.png').convert('RGB'); w, h = im.size; px = im.load()
target = float(os.environ['TARGET'])
last = 0
for y in range(h - 1, -1, -1):
    if px[5, y] != (255, 0, 255) or px[w // 2, y] != (255, 0, 255):
        last = y; break
ch = (last + 1) / 20
verdict = (f"OVERFLOW {ch - target:.2f}in" if ch > target
           else f"bottom margin {target - ch:.2f}in")
print(f"{os.environ['PANEL']:16s} content {ch:7.2f}in / {target:.0f}in  ->  {verdict}")
PY
