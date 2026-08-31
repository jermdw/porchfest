"""Generate a 24x36in portrait AREA sign -- a named festival area with the
sponsors who back it, stacked one per row.

Different object from the 24x18in stage-sponsor signs in gen_sponsor_signs.py:
that one is landscape, always says "This Stage Sponsored by:", and carries
exactly one sponsor. This is portrait, names the area in large type, and takes
however many sponsors back it. Everything else is deliberately shared with the
stage signs so the two read as one family on the ground -- same royal blue ink,
same Oswald Bold, same mirrored dove in the bottom-right corner.

    python gen_area_sign.py SPEC.json OUTDIR

    {
      "area": "Kid's Area",
      "eyebrow": "Sponsored by:",
      "sponsors": [
        {"logo": "logos/bragassa.png", "name": "Bragassa Orthodontics"},
        {"logo": "logos/coweta.png",   "name": "Coweta Charter Academy"}
      ]
    }

A sponsor with no usable logo can pass "logo": null and set its name in type
instead, the same way the stage signs fall back.
"""
import json
import os
import sys

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_sponsor_signs as g

W, H = 24 * 72, 36 * 72          # 1728 x 2592 pt

TITLE_MAX = 300
EYEBROW_SIZE = 78
RULE_TH = 14
MARGIN = 130                     # side margin; matches the stage signs' band
TOP = 150
DOVE_MARGIN = 40


def _fit(px_w, px_h, max_w, max_h, min_dpi=60):
    """Scale to fit the slot, never past `min_dpi` effective."""
    s = min(max_w / px_w, max_h / px_h, 72.0 / min_dpi)
    return px_w * s, px_h * s


def build(spec, outdir):
    area = spec['area']
    eyebrow = spec.get('eyebrow', 'Sponsored by:')
    sponsors = spec['sponsors']

    doc = pymupdf.open()
    page = doc.new_page(width=W, height=H)
    page.insert_font(fontname='OswB', fontfile=g.FONTFILE)
    avail = W - 2 * MARGIN

    # --- title: the area name is the thing read from across the street ---
    size, lines = g.best_layout(area, 0, 900, TITLE_MAX, max_lines=2)
    # best_layout measures against its own MAX_W; re-fit to this sign's width.
    unit = max(g.font.text_length(l, fontsize=1) for l in lines)
    size = min(size, avail / unit)
    title_h = g.block_height(size, lines)
    g.draw_lines_at(page, size, lines, TOP)
    y = TOP + title_h + 46

    shape = page.new_shape()
    shape.draw_rect(pymupdf.Rect(W / 2 - 300, y, W / 2 + 300, y + RULE_TH))
    shape.finish(fill=g.NAVY, color=None)
    shape.commit()
    y += RULE_TH + 60

    ew = g.font.text_length(eyebrow, fontsize=EYEBROW_SIZE)
    page.insert_text(((W - ew) / 2, y + EYEBROW_SIZE * g.font.ascender), eyebrow,
                     fontname='OswB', fontsize=EYEBROW_SIZE, color=g.NAVY)
    y += EYEBROW_SIZE * (g.font.ascender - g.font.descender) + 40

    # --- sponsors share what is left, evenly, one row each ---
    dove_h = 100
    bottom = H - DOVE_MARGIN - dove_h - 50
    slot = (bottom - y) / len(sponsors)
    for s in sponsors:
        name_size, name_lines = g.best_layout(s['name'], 0, 200, 96, max_lines=2)
        nunit = max(g.font.text_length(l, fontsize=1) for l in name_lines)
        name_size = min(name_size, avail / nunit)
        name_h = g.block_height(name_size, name_lines)

        if s.get('logo'):
            prepped, pw, ph = g.prep_logo(s['logo'])
            lw, lh = _fit(pw, ph, avail, slot - name_h - 70)
            top = y + (slot - (lh + 34 + name_h)) / 2
            page.insert_image(pymupdf.Rect(W / 2 - lw / 2, top, W / 2 + lw / 2, top + lh),
                              filename=prepped)
            g.draw_lines_at(page, name_size, name_lines, top + lh + 34)
        else:
            g.draw_lines_at(page, name_size, name_lines, y + (slot - name_h) / 2)
        y += slot

    bw = dove_h * g.BIRD_ASPECT
    page.insert_image(
        pymupdf.Rect(W - DOVE_MARGIN - bw, H - DOVE_MARGIN - dove_h,
                     W - DOVE_MARGIN, H - DOVE_MARGIN),
        filename=g._bird_flip_path())

    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, area.replace('/', '-') + ' Sign 24x36.pdf')
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
