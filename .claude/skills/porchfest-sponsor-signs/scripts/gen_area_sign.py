"""Generate an AREA sign -- a named festival area with the sponsors who back it.

Different object from the 24x18in stage-sponsor signs in gen_sponsor_signs.py:
that one is landscape, always says "This Stage Sponsored by:", and carries
exactly one sponsor. This names an area in large type and takes however many
sponsors back it. Everything else is deliberately shared with the stage signs so
the two read as one family on the ground -- same royal blue ink, same Oswald
Bold, same mirrored dove in the bottom-right corner.

    python gen_area_sign.py SPEC.json OUTDIR

    {
      "area": "Kid's Area",
      "eyebrow": "Sponsored by:",
      "orientation": "landscape",
      "sponsors": [
        {"logo": "logos/bragassa.png", "name": "Bragassa Orthodontics"},
        {"logo": "logos/coweta.png",   "name": "Coweta Charter Academy"}
      ]
    }

Landscape (36x24in) is the default and puts the sponsors in a ROW, which is what
makes their logos big -- two sponsors get ~15in of width each instead of sharing
one narrow column. Portrait (24x36in) stacks them instead; use it when there are
enough sponsors that a row would squeeze them thinner than a stack would.

A sponsor with no usable logo can pass "logo": null and set its name in type
instead, the same way the stage signs fall back.
"""
import json
import os
import sys

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_sponsor_signs as g

SIZES = {'landscape': (36 * 72, 24 * 72), 'portrait': (24 * 72, 36 * 72)}

TITLE_MAX = 320
EYEBROW_SIZE = 140
RULE_TH = 14
MARGIN = 130                     # side margin; matches the stage signs' band
TOP = 150
DOVE_MARGIN = 40
NAME_GAP = 34                    # between a logo and the name under it
MIN_LOGO = 110                   # a logo shorter than this is not worth printing
MIN_CELL = 340                   # ...and a column narrower than this is not
                                 # either. Separate from MIN_LOGO because a
                                 # 1.5in-tall logo can still read across a wide
                                 # cell, while a 1.5in-WIDE column cannot hold
                                 # a logo and a name at all. Caps a landscape
                                 # row at five sponsors on a 36in sign.


def _fit(px_w, px_h, max_w, max_h, min_dpi=60):
    """Scale to fit the slot, never past `min_dpi` effective."""
    s = min(max_w / px_w, max_h / px_h, 72.0 / min_dpi)
    return px_w * s, px_h * s


def _fit_lines(text, avail, max_size, max_lines):
    """Largest size for `text` inside `avail` points of width, choosing the line
    break that wins at THIS width.

    Not g.best_layout: that one measures against its own MAX_W (1500pt, the
    stage sign's band) and returns the break that wins there. On a 36in area
    sign the band is 2332pt, so it was returning "KID'S / AREA" stacked when
    KID'S AREA fits on one line with room to spare -- and the two-line title
    then ate the height the sponsor logos needed.
    """
    words = g.tokens(text)
    best = None
    for n in range(1, min(max_lines, len(words)) + 1):
        for part in g.partitions(words, n):
            lines = [' '.join(p) for p in part]
            unit = max(g.font.text_length(line, fontsize=1) for line in lines)
            size = min(max_size, avail / unit)
            if best is None or size > best[0]:
                best = (size, lines)
    return best[0], best[1], g.block_height(best[0], best[1])


def _name_block(text, avail):
    """Largest name that fits `avail` wide, plus its lines and height."""
    return _fit_lines(text, avail, 96, 2)


def _draw_centered(page, size, lines, y_top, cx):
    """g.draw_lines_at centres on the page; a row cell needs its own centre."""
    y = y_top + size * g.font.ascender
    for line in lines:
        lw = g.font.text_length(line, fontsize=size)
        page.insert_text((cx - lw / 2, y), line, fontname='OswB',
                         fontsize=size, color=g.NAVY)
        y += size * g.LEAD


def build(spec, outdir):
    area = spec['area']
    eyebrow = spec.get('eyebrow', 'Sponsored by:')
    sponsors = spec['sponsors']
    orientation = spec.get('orientation', 'landscape')
    if orientation not in SIZES:
        raise SystemExit(f'orientation must be one of {sorted(SIZES)}')
    if not sponsors:
        raise SystemExit('an area sign needs at least one sponsor')
    W, H = SIZES[orientation]

    doc = pymupdf.open()
    page = doc.new_page(width=W, height=H)
    page.insert_font(fontname='OswB', fontfile=g.FONTFILE)
    avail = W - 2 * MARGIN

    # --- title: the area name is the thing read from across the street ---
    size, lines, title_h = _fit_lines(area, avail, TITLE_MAX, 2)
    _draw_centered(page, size, lines, TOP, W / 2)
    y = TOP + title_h + 46

    shape = page.new_shape()
    shape.draw_rect(pymupdf.Rect(W / 2 - 300, y, W / 2 + 300, y + RULE_TH))
    shape.finish(fill=g.NAVY, color=None)
    shape.commit()
    y += RULE_TH + 56

    ew = g.font.text_length(eyebrow, fontsize=EYEBROW_SIZE)
    page.insert_text(((W - ew) / 2, y + EYEBROW_SIZE * g.font.ascender), eyebrow,
                     fontname='OswB', fontsize=EYEBROW_SIZE, color=g.NAVY)
    y += EYEBROW_SIZE * (g.font.ascender - g.font.descender) + 44

    dove_h = 100
    bottom = H - DOVE_MARGIN - dove_h - 40
    band_h = bottom - y
    n = len(sponsors)

    # Landscape splits the width between sponsors and gives each the full
    # remaining height; portrait splits the height and gives each the full width.
    if orientation == 'landscape':
        gap = 110
        cell_w = (avail - gap * (n - 1)) / n
        cell_h = band_h
    else:
        gap = 0
        cell_w = avail
        cell_h = band_h / n

    # Measure every sponsor BEFORE drawing anything, so an over-capacity list
    # fails with a clear message instead of writing a PDF with a logo placed at
    # a negative height. _fit() would otherwise happily return a non-positive
    # size and the rect would be inverted.
    #
    # The two orientations run out of room in different directions, so both are
    # checked: landscape divides the WIDTH between sponsors and keeps full
    # height, portrait divides the HEIGHT and keeps full width. Checking only
    # height would let eight sponsors through a landscape sign at 2.7in a column.
    if cell_w < MIN_CELL:
        raise SystemExit(
            f'{area!r} cannot fit {n} sponsors in {orientation}: each gets only '
            f'{cell_w / 72:.1f}in of width (minimum {MIN_CELL / 72:.1f}in). '
            f'Use the other orientation, or split these across two signs.')
    measured = []
    for s in sponsors:
        name_size, name_lines, name_h = _name_block(s['name'], cell_w)
        logo_h = cell_h - name_h - NAME_GAP
        if s.get('logo') and logo_h < MIN_LOGO:
            raise SystemExit(
                f"{area!r} cannot fit {n} sponsors in {orientation}: "
                f"{s['name']!r} is left {logo_h / 72:.1f}in for its logo "
                f"(minimum {MIN_LOGO / 72:.1f}in). Use the other orientation, "
                f"or split these across two signs.")
        measured.append((s, name_size, name_lines, name_h, logo_h))

    for i, (s, name_size, name_lines, name_h, logo_h) in enumerate(measured):
        if orientation == 'landscape':
            cx = MARGIN + i * (cell_w + gap) + cell_w / 2
            cell_top = y
        else:
            cx = W / 2
            cell_top = y + i * cell_h

        if s.get('logo'):
            prepped, pw, ph = g.prep_logo(s['logo'])
            lw, lh = _fit(pw, ph, cell_w, logo_h)
            group_h = lh + NAME_GAP + name_h
            top = cell_top + (cell_h - group_h) / 2
            page.insert_image(
                pymupdf.Rect(cx - lw / 2, top, cx + lw / 2, top + lh),
                filename=prepped)
            _draw_centered(page, name_size, name_lines, top + lh + NAME_GAP, cx)
        else:
            _draw_centered(page, name_size, name_lines,
                           cell_top + (cell_h - name_h) / 2, cx)

    bw = dove_h * g.BIRD_ASPECT
    page.insert_image(
        pymupdf.Rect(W - DOVE_MARGIN - bw, H - DOVE_MARGIN - dove_h,
                     W - DOVE_MARGIN, H - DOVE_MARGIN),
        filename=g._bird_flip_path())

    os.makedirs(outdir, exist_ok=True)
    inches = f'{W // 72}x{H // 72}'
    out = os.path.join(outdir, f'{area.replace("/", "-")} Sign {inches}.pdf')
    doc.save(out, deflate=True)
    doc.close()
    return out


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    spec_path, outdir = sys.argv[1], sys.argv[2]
    spec_dir = os.path.dirname(os.path.abspath(spec_path))
    spec = json.load(open(spec_path))
    for s in spec['sponsors']:
        if s.get('logo'):
            s['logo'] = os.path.join(spec_dir, s['logo'])
    out = build(spec, outdir)
    print('wrote', out)


if __name__ == '__main__':
    main()
