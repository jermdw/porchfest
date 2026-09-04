"""Generate more 24x18in PorchFest yard signs, joining the VIP/wayfinding
batch already printed (`generate_signage.py`, imported here as `base` for its
palette, fonts, and layout helpers -- same relationship gen_area_sign.py has
to gen_sponsor_signs.py in the sponsor-sign skill).

1. **Strike a Chord, Strike a Pose** -- a social/photo-op sign carrying the
   flag-guitar-and-dove mark already used on the sign tower
   (`scripts/signtower/assets/guitar-bird-final.png`) and the
   #SenoiaPorchFest26 hashtag, in flag red the way the other signs' rules and
   arrows are.
2. **Parking** -- type-only, same treatment as the existing type-only "VIP
   Parking Only" sign, just the single word so it sets as large as possible.
3. **VIP Sold Out** -- type-only announcement, same treatment as the existing
   "VIP Management Only" sign (stacked caps + a flag-red rule underneath).
4. **Cooling Tent** -- sponsor-led, same structural family as
   `generate_signage.py`'s "Food Truck Alley" sign: PROVIDED BY / [logo] /
   rule / COOLING TENT. Logo is Progressive Heating, Air & Plumbing's mark,
   `scripts/assets/logo-progressive.png` (their own site's header logo --
   clean vector-quality edges beat the higher-pixel-count photo of a physical
   decal found on their enjoysenoia.com partner page).

    python3 scripts/generate_more_signage.py [--outdir DIR]
"""

import argparse
import os
import sys

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_signage as base

GUITAR = os.path.join(base.REPO, 'scripts', 'signtower', 'assets',
                       'guitar-bird-final.png')
GUITAR_ASPECT = 2040 / 4752   # width / height -- a tall, narrow mark

PROGRESSIVE_LOGO = os.path.join(base.ASSETS, 'logo-progressive.png')


def sign_strike_a_pose(doc):
    """STRIKE A CHORD / STRIKE A POSE over the guitar-and-dove mark, with the
    hashtag as a flag-red call to action underneath.

    The mark is nearly 2.3x taller than it is wide, so height (not width) is
    what runs out first in the live band -- unlike the sponsor-logo signs,
    which are always width-bound. The image is sized off whatever height is
    left after the headline and hashtag claim theirs, not the other way
    around, so the composition never fights itself for room.
    """
    page = base.new_yard(doc)
    line1, line2 = 'STRIKE A CHORD', 'STRIKE A POSE'
    tag = '#SenoiaPorchFest26'
    aw = base.BAND[2] - base.BAND[0]

    # One size across both headline lines so they read as a matched pair,
    # not a bigger word over a smaller one.
    h_size = min(base.best_layout(t, aw, 460, 300, 1, glue=False)[0]
                 for t in (line1, line2))
    head_h = base.block_height(h_size, [line1, line2])

    tag_size, tag_lines = base.best_layout(tag, aw, 220, 115, 1, glue=False)
    tag_h = base.block_height(tag_size, tag_lines)

    g1, rule_th, g2, g3 = 40, 12, 34, 32
    band_h = base.BAND[3] - base.BAND[1]
    img_h = band_h - head_h - g1 - g2 - rule_th - g3 - tag_h
    img_w = img_h * GUITAR_ASPECT
    if img_w > aw:
        img_w = aw
        img_h = img_w / GUITAR_ASPECT

    group_h = head_h + g1 + img_h + g2 + rule_th + g3 + tag_h
    top = base._band_top(group_h)
    cx = base.YARD_W / 2

    base.draw_lines(page, [line1, line2], h_size, top, base.ROYAL, cx)
    y = top + head_h + g1
    page.insert_image(
        pymupdf.Rect(cx - img_w / 2, y, cx + img_w / 2, y + img_h),
        filename=GUITAR)
    y += img_h + g2
    base.draw_rule(page, cx, y, 460, base.FLAG, rule_th)
    y += rule_th + g3
    base.draw_lines(page, tag_lines, tag_size, y, base.FLAG, cx)
    base.place_dove(page, base.YARD_W, base.YARD_H)


def sign_parking(doc):
    """PARKING, type-only, as large as the sign allows -- same treatment as
    the existing type-only "VIP Parking Only" sign, just the one word so it
    can run bigger still and read from further down the street.
    """
    page = base.new_yard(doc)
    band_w = base.BAND[2] - base.BAND[0]
    band_h = base.BAND[3] - base.BAND[1]

    size, lines = base.best_layout('PARKING', band_w, band_h, 900, 1, glue=False)
    th = base.block_height(size, lines)
    base.draw_lines(page, lines, size, base._band_top(th), base.ROYAL, base.YARD_W / 2)
    base.place_dove(page, base.YARD_W, base.YARD_H)


def sign_vip_sold_out(doc):
    """VIP SOLD OUT, type-only with the flag-red rule accent -- copies the
    existing "VIP Management Only" sign's structure exactly (stacked caps,
    then a short centered rule), just with different words. An announcement
    rather than a direction, so it keeps that sign's rule for a more
    finished look instead of the plainer type-only "VIP Parking Only"
    treatment (no rule, dropped by request when that sign lost its arrows).
    """
    page = base.new_yard(doc)
    text = 'VIP SOLD OUT'
    gap, rule_th = 78, 14
    size, lines = base.best_layout(text, base.BAND[2] - base.BAND[0], 860, 400, 3, glue=False)
    th = base.block_height(size, lines)
    top = base._band_top(th + gap + rule_th)
    base.draw_lines(page, lines, size, top, base.ROYAL, base.YARD_W / 2)
    base.draw_rule(page, base.YARD_W / 2, top + th + gap, 620, base.FLAG, rule_th)
    base.place_dove(page, base.YARD_W, base.YARD_H)


def sign_cooling_tent(doc):
    """PROVIDED BY / [Progressive logo] / rule / COOLING TENT -- the same
    eyebrow-logo-rule-headline stack as `base.sign_food_truck_alley`, just
    with different words and a different sponsor. Kept as its own function
    (rather than calling that one with swapped strings) because that one is
    documented as a one-off inversion done at the DDA's specific request;
    duplicating its ~25 lines here keeps that reasoning from silently
    applying to a sign nobody asked to invert.
    """
    page = base.new_yard(doc)
    g1, g2, rule_th, g3 = 54, 62, 13, 48

    sb_size = 80
    sb_h = sb_size * base.CAP

    prepped, pw, ph = base.prep_logo(PROGRESSIVE_LOGO, cache_key='_progressive')
    lw, lh = base.fit_logo(pw, ph, base.BAND[2] - base.BAND[0], 560, min_dpi=52)

    size, lines = base.best_layout('COOLING TENT', lw, 420, 200, 1)
    th = base.block_height(size, lines)

    top = base._band_top(sb_h + g1 + lh + g2 + rule_th + g3 + th)
    cx = base.YARD_W / 2
    base.draw_tracked(page, 'PROVIDED BY', sb_size, cx, top, base.ROYAL)
    y = top + sb_h + g1
    page.insert_image(
        pymupdf.Rect(cx - lw / 2, y, cx + lw / 2, y + lh),
        filename=prepped)
    y += lh + g2
    base.draw_rule(page, cx, y, 720, base.FLAG, rule_th)
    y += rule_th + g3
    base.draw_lines(page, lines, size, y, base.ROYAL, cx)
    base.place_dove(page, base.YARD_W, base.YARD_H)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--outdir',
                    default=os.path.expanduser('~/Downloads/PorchFest_More_Signage'))
    args = ap.parse_args()
    os.makedirs(args.outdir, exist_ok=True)

    made = []

    def emit(name, build):
        doc = pymupdf.open()
        build(doc)
        path = os.path.join(args.outdir, name + '.pdf')
        doc.save(path, deflate=True)
        doc.close()
        made.append(path)

    emit('01 Strike a Chord Strike a Pose', sign_strike_a_pose)
    emit('02 Parking', sign_parking)
    emit('03 VIP Sold Out', sign_vip_sold_out)
    emit('04 Cooling Tent', sign_cooling_tent)

    base.proof_sheet(made, os.path.join(args.outdir, '_proof.png'))
    for p in made:
        print('wrote', p)


if __name__ == '__main__':
    main()
