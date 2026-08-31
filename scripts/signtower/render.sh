#!/bin/bash
# Render the 48x96in sign-tower panels to print PDFs (plus a low-DPI proof PNG).
#
#   ./render.sh                 # all four panels
#   ./render.sh side2-map       # just one
#
# Headless Chrome is the renderer rather than WeasyPrint/wkhtmltopdf because
# these panels lean on flexbox and percentage-positioned map pins, and Chrome is
# the only engine here that lays those out the same way the browser preview did.
# The @page rule inside each file carries the trim size, so nothing about the
# dimensions lives in this script.
set -euo pipefail
cd "$(dirname "$0")"

CHROME=$(. ./chrome.sh)
OUT="${OUT:-$HOME/Downloads/PorchFest_SignTower}"
mkdir -p "$OUT"

panels=("$@")
[ ${#panels[@]} -eq 0 ] && panels=(side1-logo side2-map side3-sponsors side4-lineup)

for p in "${panels[@]}"; do
  [ -f "$p.html" ] || { echo "no such panel: $p.html" >&2; exit 1; }
  # Chrome numbers nothing for us, so the friendly output name is derived here.
  case "$p" in
    side1-logo)     name="PorchFest-SignTower-1-Logo" ;;
    side1-logo-alt) name="PorchFest-SignTower-1-Logo-Alt" ;;
    side2-map)      name="PorchFest-SignTower-2-Map" ;;
    side3-sponsors) name="PorchFest-SignTower-3-Sponsors" ;;
    side4-lineup)   name="PorchFest-SignTower-4-Lineup" ;;
    *)              name="$p" ;;
  esac

  # --virtual-time-budget lets the self-hosted @font-face files and the 3.8MB
  # map raster finish decoding; without it Chrome prints a half-loaded page.
  "$CHROME" --headless --disable-gpu \
    --no-pdf-header-footer --print-to-pdf-no-header \
    --print-to-pdf="$OUT/$name.pdf" \
    --virtual-time-budget=20000 \
    "file://$PWD/$p.html" 2>/dev/null

  # 14 dpi on a 48in panel is a ~672px proof - big enough to read the layout,
  # small enough to open instantly. The print PDF beside it is the deliverable.
  pdftoppm -r 14 -png -singlefile "$OUT/$name.pdf" "$OUT/$name"
  echo "wrote $OUT/$name.pdf"
done
