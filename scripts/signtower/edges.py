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

A 0.00 reading is not automatically a fault -- side 4's hour bands are
full-bleed white by design, and side 1 (alt) bleeds the guitar off the top on
purpose. Read it as "ink reaches this edge", then decide whether that edge is
meant to bleed.
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
    bg = pm.pixel(2, 2)
    ink = lambda x, y: sum(abs(a - b) for a, b in zip(pm.pixel(x, y), bg)) > 45

    cols = [x for x in range(W) if any(ink(x, y) for y in range(H))]
    rows = [y for y in range(H) if any(ink(x, y) for x in range(W))]
    if not cols:
        print(f'{f.name[:33]:<34}  (no ink found)')
        continue
    l, r = min(cols) * inches_per_px, (W - 1 - max(cols)) * inches_per_px
    t, b = min(rows) * inches_per_px, (H - 1 - max(rows)) * inches_per_px
    note = ''
    if safe is not None and min(l, r, t, b) < safe:
        note = f'   <-- ink within {safe:g}in of trim'
        worst = min(worst, min(l, r, t, b)) if worst is not None else min(l, r, t, b)
    print(f'{f.name[:33]:<34}{l:7.2f}{r:7.2f}{t:7.2f}{b:8.2f}{note}')

sys.exit(0)
