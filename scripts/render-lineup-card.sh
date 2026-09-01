#!/bin/bash
# Render the public lineup card: lineup_card_template.html -> the PDF linked
# from /schedule and /map.
#
# This script exists because the deployed card had no renderer in the repo. The
# PDF was produced by hand with headless Chrome, while scripts/generate_lineup_pdf.py
# (ReportLab) sat next to it writing the SAME output path from its own hardcoded
# copy of the schedule. Running the obvious-looking script overwrote a good card
# with a broken one -- the ReportLab layout draws the act columns over the VIP /
# closing-act banner. That script is gone; this is the only way to build the card.
#
# The trim size lives in the template's @page rule (11in x 8.5in landscape), so
# no page flags here -- passing any would silently override it.
set -euo pipefail
cd "$(dirname "$0")"

CHROME=$(. ./signtower/chrome.sh)
OUT="${OUT:-../public/senoia-porchfest-2026-lineup-card.pdf}"

# Checked BEFORE rendering, so a template that fails never reaches $OUT -- that
# path is the live download, and the whole reason this script exists is that a
# bad card once landed there and shipped.
#
# The template carries its own hardcoded copy of the lineup (it is not built from
# src/data/schedule.js), so it has drifted twice already -- once when Flint River
# Rev'lers pulled out, once when David Pippin moved to stage 5. Any lineup change
# means editing this template by hand, including the per-hour "N Acts" pills,
# which are separate literals from the act lists and drift on their own.
python3 - <<'PY'
import re, sys
h = open('lineup_card_template.html').read()
parts = re.split(r'<span>(\d+) Acts</span>', h)
bad = 0
for i in range(1, len(parts), 2):
    claimed, body = int(parts[i]), parts[i + 1]
    actual = len(re.findall(r'class="stage-badge"', body))
    hour = re.findall(r'>(\d{1,2}:00 (?:PM|AM))<', parts[i - 1])
    if claimed != actual:
        print(f"  MISMATCH {hour[-1] if hour else '?'}: pill says {claimed}, "
              f"{actual} acts listed", file=sys.stderr)
        bad += 1
sys.exit(1 if bad else 0)
PY
echo "per-hour act counts check out"

# --virtual-time-budget lets the webfonts finish loading; without it Chrome
# prints the card in a fallback face.
"$CHROME" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf-no-header \
  --print-to-pdf="$OUT" \
  --virtual-time-budget=20000 \
  "file://$PWD/lineup_card_template.html" 2>/dev/null

echo "wrote $OUT"
