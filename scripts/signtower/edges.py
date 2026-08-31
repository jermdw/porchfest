#!/usr/bin/env python3
"""Report how much clear trim each rendered panel leaves on all four edges.

    ./edges.py ~/Downloads/PorchFest_SignTower        # or any dir of panel PDFs
    ./edges.py --safe 2 <dir>                         # flag anything under 2in

This is the companion to measure.sh, and the two catch different bugs. Keep
both.

  * measure.sh re-renders the panel with `height:auto` to find its natural
    content height. That finds a block running off the end of the document.
  * It does NOT reproduce the real layout. `.banner` is a fixed-height flex
    column, so `margin-top:auto`, `flex:1 1 auto` and the fixed-height footer
    distribute space differently than natural flow does. A panel can measure
    93in of 96in and still have its footer pushed off the bottom and clipped by
    `overflow:hidden` -- which is exactly what happened to side 1's QR block
    once the lockup grew.

So: measure.sh proves nothing overflows the *document*, this proves nothing is
clipped at the *trim*, and only the pair is a real check.

What it measures, precisely: the distance from each trim edge to the nearest
pixel that differs from the panel's GROUND colour, which is sampled from the
corner. On these panels the ground is the full-bleed navy, and that navy is
meant to run off the trim -- so it is the thing being measured against, not a
finding. The number to read is "how far in does the content start".

Two consequences of that choice, both deliberate:
  * A 0.00 is not automatically a fault. Side 4's hour bands are full-bleed
    white by design, side 1 (alt) bleeds the guitar off the top, and the footer
    rule spans the full width. Read 0.00 as "something reaches this edge", then
    decide whether that something is meant to.
  * An element painted in the ground colour itself would not register. Nothing
    on these panels is, and a navy-on-navy element would be invisible anyway,
    but it is the blind spot of a ground-relative measurement.
"""
import sys
from pathlib import Path

try:
    import pymupdf
except ImportError:
    sys.exit('PyMuPDF is required: pip install pymupdf')

args = sys.argv[1:]
safe = None
if args and args[0] == '--safe':
    safe = float(args[1])
    args = args[2:]
target = Path(args[0]) if args else Path.home() / 'Downloads' / 'PorchFest_SignTower'

pdfs = sorted(target.glob('*.pdf'))
if not pdfs:
    sys.exit(f'no PDFs in {target}')

print(f'{"panel":<34}{"left":>7}{"right":>7}{"top":>7}{"bottom":>8}   (inches of clear trim)')
worst = None
for f in pdfs:
    page = pymupdf.open(f)[0]
    # 18 dpi is ample: we are locating the outermost ink, not reading it.
    pm = page.get_pixmap(matrix=pymupdf.Matrix(0.25, 0.25))
    W, H = pm.width, pm.height
    inches_per_px = (page.rect.width / 72) / W
    ground = pm.pixel(2, 2)

    def differs(x, y, _pm=pm, _ground=ground):
        px = _pm.pixel(x, y)
        return sum(abs(a - b) for a, b in zip(px, _ground, strict=True)) > 45

    cols = [x for x in range(W) if any(differs(x, y) for y in range(H))]
    rows = [y for y in range(H) if any(differs(x, y) for x in range(W))]
    if not cols:
        print(f'{f.name[:33]:<34}  (nothing differs from the ground colour)')
        continue
    left, right = min(cols) * inches_per_px, (W - 1 - max(cols)) * inches_per_px
    top, bottom = min(rows) * inches_per_px, (H - 1 - max(rows)) * inches_per_px
    closest = min(left, right, top, bottom)
    note = ''
    if safe is not None and closest < safe:
        note = f'   <-- content within {safe:g}in of trim'
        worst = closest if worst is None else min(worst, closest)
    print(f'{f.name[:33]:<34}{left:7.2f}{right:7.2f}{top:7.2f}{bottom:8.2f}{note}')

sys.exit(0)
