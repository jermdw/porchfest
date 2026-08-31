"""Generate PorchFest VIP / wayfinding signage: four 24x18in yard signs and one
96x18in vinyl banner.

Two deliberate house styles, because these are two different objects:

* **Yard signs** join the batch of ~24 stage-sponsor signs already printed for
  2026 (see `gen_sponsor_signs.py` in the session memory dir): white ground,
  Oswald Bold in royal blue `#002FA7`, mirrored dove bottom-right. That royal
  blue was picked off physical ink samples rather than from the brand tokens —
  it is a *print* value, and matching the signs already on the ground beats
  matching the screen palette.
* **Banner** is sponsor recognition on vinyl, so it follows the brand guide
  proper (`docs/brand-guide.html`): navy `#101D3A` ground, cream type, flag-red
  rules.

Flag red `#B02A30` carries the section rules on both — the one brand token that
is legible on white and navy alike.

NOTE — this banner and the sign towers no longer match. `scripts/signtower/`
was moved onto the 2026 ad-banner inks (pure red `#C00000`, pure white) at the
DDA's request; this file still uses the brand tokens (`#B02A30`, cream
`#F5F1E6`). Both hang at the same event on the same navy, so side by side the
difference is visible. That may well be fine — the yard signs above already
diverge from the brand palette on purpose — but it is a live inconsistency, not
a settled decision, and it needs an answer from the DDA before print.

Fonts are derived from the repo's own `@fontsource/oswald` webfont at run time,
so nothing here can drift out of sync with the site.

Outputs print PDFs plus a `_proof.png` contact sheet. None of these are repo
dependencies — this is a print tool, not part of the site build. PyMuPDF
declares no dependencies of its own, so Pillow (logo prep) and fontTools
(woff -> ttf) have to be installed alongside it:

    pip install pymupdf pillow fonttools
    python3 scripts/generate_signage.py [--outdir DIR]
"""

import argparse
import os

import pymupdf
from PIL import Image, ImageChops
from fontTools.ttLib import TTFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(REPO, 'scripts', 'assets')

# ---------------------------------------------------------------- palette ---
# Yard-sign ink: print-calibrated, NOT the brand navy. See module docstring.
ROYAL = (0x00 / 255, 0x2F / 255, 0xA7 / 255)   # #002FA7
INK = (0x10 / 255, 0x1D / 255, 0x3A / 255)     # #101D3A  brand navy
FLAG = (0xB0 / 255, 0x2A / 255, 0x30 / 255)    # #B02A30  brand flag red
CREAM = (0xF5 / 255, 0xF1 / 255, 0xE6 / 255)   # #F5F1E6  brand warm white
PALE = (0xCD / 255, 0xD3 / 255, 0xE8 / 255)    # #CDD3E8  brand muted-on-navy
CREAM_RGB = (0xF5, 0xF1, 0xE6)

# ------------------------------------------------------------- geometry -----
YARD_W, YARD_H = 24 * 72, 18 * 72        # 1728 x 1296 pt
BANNER_W, BANNER_H = 96 * 72, 18 * 72    # 6912 x 1296 pt
BANNER_SAFE = 2 * 72                     # hem/grommet allowance per side

LEAD = 1.06                              # line leading, matches sponsor signs
DOVE_H = 90                              # dove height on yard signs
DOVE_ASPECT = 1020 / 950
DOVE_MARGIN = 34


# ---------------------------------------------------------------- fonts -----
def _oswald(weight, out_name):
    """Convert the repo's woff webfont to a ttf PyMuPDF can embed.

    The .woff (zlib) is used rather than the .woff2 (brotli) so this needs no
    compiled extension beyond fontTools itself.
    """
    os.makedirs(ASSETS, exist_ok=True)
    out = os.path.join(ASSETS, out_name)
    if not os.path.exists(out):
        # Walk up from the repo so this also works from a git worktree, which
        # has no node_modules of its own but sits under the main checkout.
        src = None
        root = REPO
        while True:
            cand = os.path.join(
                root, 'node_modules', '@fontsource', 'oswald', 'files',
                f'oswald-latin-{weight}-normal.woff')
            if os.path.exists(cand):
                src = cand
                break
            parent = os.path.dirname(root)
            if parent == root:
                break
            root = parent
        if src is None:
            raise SystemExit(
                f'Oswald {weight} not found — run `npm install` so '
                'node_modules/@fontsource/oswald exists.')
        f = TTFont(src)
        f.flavor = None
        f.save(out)
    return out


BOLD_TTF = _oswald(700, 'Oswald-Bold.ttf')
MED_TTF = _oswald(500, 'Oswald-Medium.ttf')
bold = pymupdf.Font(fontfile=BOLD_TTF)
med = pymupdf.Font(fontfile=MED_TTF)
DOVE = os.path.join(ASSETS, 'porchfest-dove-flip.png')


def _cap_ratio(ttf):
    """Cap height as a fraction of em.

    Every headline here is all-caps, so the visible ink runs from the baseline
    to the cap line — not the ascender-to-descender box the font metrics
    report. Centering on the metric box leaves a sign looking top-heavy,
    because all the slack (accent space above, descender space below) sits
    outside the letterforms.
    """
    f = TTFont(ttf)
    upem = f['head'].unitsPerEm
    cap = getattr(f['OS/2'], 'sCapHeight', 0) or round(0.73 * upem)
    return cap / upem


CAP = _cap_ratio(BOLD_TTF)


# ------------------------------------------------------------ type layout ---
def tokens(text, glue=True):
    """Split into words, keeping tiny words ('VIP', '&') glued to a neighbour
    so line-breaking never strands them on a line of their own.

    `glue=False` releases that, which is what you want when a short leading
    word on its own line is the point — a stack like VIP / MANAGEMENT / ONLY
    fills a sign far better than two width-limited lines.
    """
    out = []
    for w in text.upper().split():
        if not glue:
            out.append(w)
        elif w == '&' and out:
            out[-1] += ' &'
        elif out and len(out[-1].replace(' &', '')) <= 3 and not out[-1].endswith('&'):
            out[-1] += ' ' + w
        else:
            out.append(w)
    return out


def partitions(words, n):
    if n == 1:
        yield [words]
        return
    for i in range(1, len(words) - n + 2):
        for rest in partitions(words[i:], n - 1):
            yield [words[:i]] + rest


def _unit_h(n, caps, font):
    """Height of an n-line block at size 1."""
    return LEAD * (n - 1) + (CAP if caps else font.ascender - font.descender)


def best_layout(text, max_w, max_h, max_size, max_lines=3, font=None, caps=True,
                glue=True):
    """Largest type size that fits `text` into max_w x max_h, trying every way
    of breaking it across 1..max_lines lines."""
    font = font or bold
    words = tokens(text, glue)
    best = None
    for n in range(1, min(max_lines, len(words)) + 1):
        for part in partitions(words, n):
            lines = [' '.join(p) for p in part]
            unit = max(font.text_length(ln, fontsize=1) for ln in lines)
            size = min(max_size, max_w / unit, max_h / _unit_h(n, caps, font))
            # Prefer the biggest size; tie-break toward the tighter block.
            if best is None or size > best[0] + 0.5 or (
                    abs(size - best[0]) <= 0.5 and unit < best[2]):
                best = (size, lines, unit)
    return best[0], best[1]


def block_height(size, lines, font=None, caps=True):
    return size * _unit_h(len(lines), caps, font or bold)


def draw_lines(page, lines, size, y_top, color, cx, fontname='OswB', font=None,
               caps=True):
    """Draw centered lines with the block's top edge at y_top."""
    font = font or bold
    y = y_top + size * (CAP if caps else font.ascender)
    for ln in lines:
        w = font.text_length(ln, fontsize=size)
        page.insert_text((cx - w / 2, y), ln, fontname=fontname,
                         fontsize=size, color=color)
        y += size * LEAD


def draw_tracked(page, text, size, cx, y_top, color, tracking=0.13,
                 fontname='OswM', font=None):
    """Centered, letter-spaced caps — the brand's eyebrow/meta treatment.

    PyMuPDF has no tracking, so glyphs are placed one at a time.
    """
    font = font or med
    widths = [font.text_length(ch, fontsize=size) for ch in text]
    extra = tracking * size
    total = sum(widths) + extra * (len(text) - 1)
    x = cx - total / 2
    y = y_top + size * CAP
    for ch, w in zip(text, widths):
        page.insert_text((x, y), ch, fontname=fontname, fontsize=size,
                         color=color)
        x += w + extra
    return size * CAP


# --------------------------------------------------------------- shapes -----
def draw_rule(page, cx, y, width, color, thickness=10):
    """The brand's section rule — a short centered flag-red bar."""
    shape = page.new_shape()
    shape.draw_rect(pymupdf.Rect(cx - width / 2, y, cx + width / 2, y + thickness))
    shape.finish(fill=color, color=None)
    shape.commit()


def draw_block_arrow(page, box, direction, color):
    """Solid block arrow filling box=(x0,y0,x1,y1).

    Shaft weight is ~40% of the cross-axis so it reads at the same visual
    weight as Oswald Bold beside it rather than looking like a hairline.
    """
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

    if direction in ('left', 'right'):
        head = min(0.55 * w, 0.62 * h)
        sh = 0.40 * h / 2
        if direction == 'right':
            pts = [(x1, cy), (x1 - head, y0), (x1 - head, cy - sh), (x0, cy - sh),
                   (x0, cy + sh), (x1 - head, cy + sh), (x1 - head, y1)]
        else:
            pts = [(x0, cy), (x0 + head, y0), (x0 + head, cy - sh), (x1, cy - sh),
                   (x1, cy + sh), (x0 + head, cy + sh), (x0 + head, y1)]
    else:  # up
        head = min(0.55 * h, 0.62 * w)
        sw = 0.40 * w / 2
        pts = [(cx, y0), (x1, y0 + head), (cx + sw, y0 + head), (cx + sw, y1),
               (cx - sw, y1), (cx - sw, y0 + head), (x0, y0 + head)]

    shape = page.new_shape()
    shape.draw_polyline([pymupdf.Point(*p) for p in pts])
    shape.finish(fill=color, color=None, closePath=True)
    shape.commit()


def place_dove(page, w, h):
    bw = DOVE_H * DOVE_ASPECT
    page.insert_image(
        pymupdf.Rect(w - DOVE_MARGIN - bw, h - DOVE_MARGIN - DOVE_H,
                     w - DOVE_MARGIN, h - DOVE_MARGIN),
        filename=DOVE)


# ---------------------------------------------------------------- logos -----
def prep_logo(path, bg=(255, 255, 255), cache_key=''):
    """Flatten onto `bg`, remap near-white to `bg`, trim to content.

    Remapping (rather than just compositing) matters for the banner: the BMW
    file is opaque RGB on white, so on a cream plaque the raw white ground
    would show as a visible rectangle.
    """
    im = Image.open(path).convert('RGBA')
    ground = Image.new('RGBA', im.size, tuple(bg) + (255,))
    flat = Image.alpha_composite(ground, im).convert('RGB')

    if tuple(bg) != (255, 255, 255):
        # Per-pixel min(r,g,b) > 238 -> repaint as ground. Done through
        # ImageChops so it stays C-speed; a print-res logo would be millions
        # of pixels, and the same loop in Python would crawl.
        r, g, b = flat.split()
        near_white = ImageChops.darker(ImageChops.darker(r, g), b).point(
            lambda v: 255 if v > 238 else 0).convert('1')
        flat = Image.composite(
            Image.new('RGB', flat.size, tuple(bg)), flat, near_white)

    alpha_bbox = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    thresh_bbox = flat.convert('L').point(
        lambda v: 255 if v < 238 else 0).getbbox()
    bbox = alpha_bbox if (alpha_bbox and alpha_bbox != (0, 0, im.width, im.height)) \
        else thresh_bbox
    if bbox:
        pad = max(2, int(0.01 * max(im.size)))
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
        flat = flat.crop(bbox)

    os.makedirs(ASSETS, exist_ok=True)
    out = os.path.join(ASSETS, f'_prepped{cache_key}.png')
    flat.save(out)
    return out, flat.width, flat.height


def fit_logo(px_w, px_h, max_w, max_h, min_dpi):
    """Scale to fit, but never blow a raster past `min_dpi` effective — a
    low-res mark stays honest-sized instead of turning to mush."""
    scale = min(max_w / px_w, max_h / px_h, 72.0 / min_dpi)
    return px_w * scale, px_h * scale


# ------------------------------------------------------------- yard signs ---
def new_yard(doc):
    page = doc.new_page(width=YARD_W, height=YARD_H)
    page.insert_font(fontname='OswB', fontfile=BOLD_TTF)
    page.insert_font(fontname='OswM', fontfile=MED_TTF)
    return page


# Live area. The bottom stops short of the dove's corner so nothing collides
# with it, and every sign centers its content group inside this band.
BAND = (130, 110, YARD_W - 130, 1150)


def _band_top(group_h):
    """Top edge that centers a group of height `group_h` in the live band."""
    return BAND[1] + (BAND[3] - BAND[1] - group_h) / 2


def sign_vip_management(doc):
    page = new_yard(doc)
    text = 'VIP MANAGEMENT ONLY'
    gap, rule_th = 78, 14
    size, lines = best_layout(text, BAND[2] - BAND[0], 860, 400, 3, glue=False)
    th = block_height(size, lines)

    top = _band_top(th + gap + rule_th)
    draw_lines(page, lines, size, top, ROYAL, YARD_W / 2)
    draw_rule(page, YARD_W / 2, top + th + gap, 620, FLAG, rule_th)
    place_dove(page, YARD_W, YARD_H)


def sign_food_truck_alley(doc, logo):
    """Sponsor-led: SPONSORED BY / [Peachtree] / rule / FOOD TRUCK ALLEY.

    Inverted from the usual name-first order at the DDA's request — the logo is
    the hero here and the place name labels it. That costs resolution: the
    Peachtree source is only 511x174 (nothing larger exists publicly, see the
    sourcing notes in session memory), so `min_dpi` is what governs how big it
    can honestly go. At 30 it places ~17in wide — 3x the area of the previous
    9.8in, and soft only if you walk right up to it.
    """
    page = new_yard(doc)
    g1, g2, rule_th, g3 = 54, 62, 13, 48

    sb_size = 80
    sb_h = sb_size * CAP

    prepped, pw, ph = prep_logo(logo, cache_key='_peachtree')
    lw, lh = fit_logo(pw, ph, BAND[2] - BAND[0], 560, min_dpi=30)

    # Headline is subordinate to the logo now, so it is measured against the
    # logo's width rather than the full band and held to one line. Letting it
    # run the full band width would set it *wider* than the logo it labels,
    # which puts the hierarchy back the way it was.
    size, lines = best_layout('FOOD TRUCK ALLEY', lw, 420, 200, 1)
    th = block_height(size, lines)

    top = _band_top(sb_h + g1 + lh + g2 + rule_th + g3 + th)
    draw_tracked(page, 'SPONSORED BY', sb_size, YARD_W / 2, top, ROYAL)
    y = top + sb_h + g1
    page.insert_image(
        pymupdf.Rect(YARD_W / 2 - lw / 2, y, YARD_W / 2 + lw / 2, y + lh),
        filename=prepped)
    y += lh + g2
    draw_rule(page, YARD_W / 2, y, 720, FLAG, rule_th)
    y += rule_th + g3
    draw_lines(page, lines, size, y, ROYAL, YARD_W / 2)
    place_dove(page, YARD_W, YARD_H)


def sign_vip_parking(doc):
    """Type-only parking sign: VIP / PARKING / ONLY, as large as the sign allows.

    This carried a block arrow at each edge until the arrows were dropped —
    they were pointing both ways at once, which told a driver nothing the sign
    was actually placed to say. Losing them hands back the ~570pt of width they
    ate, so the same three-line stack now sets at ~355pt instead of ~224.

    `glue=False` is what allows the three-line break: with it on, VIP would be
    glued to PARKING and the block would be width-limited by the longer line.
    """
    page = new_yard(doc)
    size, lines = best_layout('VIP PARKING ONLY', BAND[2] - BAND[0],
                              BAND[3] - BAND[1], 420, 3, glue=False)
    th = block_height(size, lines)
    draw_lines(page, lines, size, _band_top(th), ROYAL, YARD_W / 2)
    place_dove(page, YARD_W, YARD_H)


def sign_employees_vip(doc):
    """Two-tier directional: EMPLOYEES ONLY (straight on) over VIP PARKING
    (to the right), split by the brand's flag-red rule."""
    page = new_yard(doc)
    tiers = [('EMPLOYEES ONLY', 'up'), ('VIP PARKING', 'right')]
    aw, gap = 235, 66
    tier_h, rule_gap, rule_th = 372, 62, 12

    # One type size and one arrow column across both tiers, so the sign reads
    # as a single stacked unit rather than two unrelated signs.
    avail_w = (BAND[2] - BAND[0]) - aw - gap
    size = min(best_layout(t, avail_w, tier_h, 210, 1)[0] for t, _ in tiers)
    tw = max(bold.text_length(t.upper(), fontsize=size) for t, _ in tiers)
    gx = (YARD_W - (tw + gap + aw)) / 2

    group_h = 2 * tier_h + 2 * rule_gap + rule_th
    top = _band_top(group_h)

    for i, (text, direction) in enumerate(tiers):
        y0 = top + i * (tier_h + 2 * rule_gap + rule_th)
        cy = y0 + tier_h / 2
        th = block_height(size, [text.upper()])
        draw_lines(page, [text.upper()], size, cy - th / 2, ROYAL, gx + tw / 2)
        ah = min(aw, tier_h * 0.92)
        draw_block_arrow(page, (gx + tw + gap, cy - ah / 2,
                                gx + tw + gap + aw, cy + ah / 2), direction, FLAG)
        if i == 0:
            draw_rule(page, YARD_W / 2, y0 + tier_h + rule_gap, 940, FLAG, rule_th)
    place_dove(page, YARD_W, YARD_H)


# ----------------------------------------------------------------- banner ---
def build_banner(path):
    """96 x 18in vinyl: VIP LUXURY LOUNGE PRESENTED BY, over the BMW mark.

    One line of type, then the sponsor's mark filling everything beneath it.
    The 2026 wordmark that used to open this banner came out at the DDA's
    request — the banner hangs on the VIP lounge itself, so the festival
    identity is already all around it — and the hero/plaque split that replaced
    it went too: at 96in it read as two competing signs rather than one.
    """
    doc = pymupdf.open()
    page = doc.new_page(width=BANNER_W, height=BANNER_H)
    page.insert_font(fontname='OswB', fontfile=BOLD_TTF)
    page.insert_font(fontname='OswM', fontfile=MED_TTF)

    # Full-bleed navy — anything short of the trim would show white at the hem.
    shape = page.new_shape()
    shape.draw_rect(pymupdf.Rect(0, 0, BANNER_W, BANNER_H))
    shape.finish(fill=INK, color=None)
    shape.commit()

    left = BANNER_SAFE
    right = BANNER_W - BANNER_SAFE
    mid = BANNER_H / 2

    # One stacked composition, not a hero on the left and a sponsor plaque on
    # the right. The split read as two competing signs at 96in; this is a
    # sponsor-recognition banner, so the line introduces the mark and then gets
    # out of its way.
    #
    # The roundel is true vector (assets/bmw-roundel.pdf, the flat modern mark
    # matching the dealer's own artwork) and the dealer name is live Oswald.
    # That split is what let this get big at all: the dealer's 400x168 web asset
    # bakes mark and name into one raster whose *lettering* sets the resolution
    # ceiling, and it was placing at 17dpi and looking it.
    roundel = pymupdf.open(os.path.join(ASSETS, 'bmw-roundel.pdf'))
    rd = roundel[0].rect

    # --- the line, across the top ---
    lead = 'VIP LUXURY LOUNGE PRESENTED BY'
    lead_size = min(225, (right - left) / bold.text_length(lead, fontsize=1))
    lead_cap = lead_size * CAP
    lw_ = bold.text_length(lead, fontsize=lead_size)
    # +10pt because insert_text places the BASELINE: rounds overshoot the cap
    # line, so sitting the cap exactly on the safe margin puts ink outside it.
    page.insert_text(((BANNER_W - lw_) / 2, BANNER_SAFE + 10 + lead_cap), lead,
                     fontname='OswB', fontsize=lead_size, color=CREAM)

    # --- the mark, filling everything under it ---
    # Roundel and dealer name sit on ONE line so the lockup runs wide: this
    # banner is 96in across and 18in tall, so height is the scarce dimension and
    # anything stacked wastes the abundant one. Sized to whichever of the two
    # runs out first -- the height left under the line, or the width available.
    top = BANNER_SAFE + 10 + lead_cap + 62
    avail_h = (BANNER_H - BANNER_SAFE) - top
    avail_w = right - left

    name = 'BMW of South Atlanta'
    gap_ratio = 0.10          # gap between mark and name, as a fraction of mark height
    name_ratio = 0.46         # name cap height, as a fraction of mark height
    # Width of the whole group when the roundel is 1pt tall, so it can be solved
    # for directly rather than guessed at.
    unit_w = (rd.width / rd.height) + gap_ratio \
        + bold.text_length(name, fontsize=1) * name_ratio / CAP
    mark_h = min(avail_h, avail_w / unit_w)
    mark_w = mark_h * (rd.width / rd.height)
    name_size = mark_h * name_ratio / CAP
    group_w = mark_h * unit_w

    gx = (BANNER_W - group_w) / 2
    gy = top + (avail_h - mark_h) / 2
    page.show_pdf_page(pymupdf.Rect(gx, gy, gx + mark_w, gy + mark_h), roundel, 0)
    page.insert_text((gx + mark_w + mark_h * gap_ratio,
                      gy + mark_h / 2 + name_size * CAP / 2),
                     name, fontname='OswB', fontsize=name_size, color=CREAM)

    doc.save(path, deflate=True)
    doc.close()


# ------------------------------------------------------------------ proof ---
def proof_sheet(pdfs, png_out, cols=2, cw=576, ch=432):
    yard = [p for p in pdfs if 'Banner' not in os.path.basename(p)]
    banner = [p for p in pdfs if 'Banner' in os.path.basename(p)]
    rows = (len(yard) + cols - 1) // cols
    bh = int(cols * cw * (BANNER_H / BANNER_W))
    sheet = pymupdf.open()
    sp = sheet.new_page(width=cols * cw, height=rows * ch + (bh + 16 if banner else 0))
    shape = sp.new_shape()
    shape.draw_rect(sp.rect)
    shape.finish(fill=(0.88, 0.88, 0.88), color=None)
    shape.commit()
    for i, f in enumerate(yard):
        src = pymupdf.open(f)
        r, c = divmod(i, cols)
        cell = pymupdf.Rect(c * cw + 8, r * ch + 8,
                            (c + 1) * cw - 8, (r + 1) * ch - 8)
        # The sign PDFs carry no white fill (matching the sponsor-sign batch
        # already printed), so the proof supplies the white stock itself.
        shape = sp.new_shape()
        shape.draw_rect(cell)
        shape.finish(fill=(1, 1, 1), color=None)
        shape.commit()
        sp.show_pdf_page(cell, src, 0)
        src.close()
    for i, f in enumerate(banner):
        src = pymupdf.open(f)
        y = rows * ch + 8
        sp.show_pdf_page(pymupdf.Rect(8, y, cols * cw - 8, y + bh), src, 0)
        src.close()
    sp.get_pixmap(dpi=110).save(png_out)


# ------------------------------------------------------------------- main ---
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--outdir',
                    default=os.path.expanduser('~/Downloads/PorchFest_VIP_Signage'))
    ap.add_argument('--peachtree', default=os.path.join(ASSETS, 'logo-peachtree.png'))
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

    emit('01 VIP Management Only', sign_vip_management)
    emit('02 Food Truck Alley', lambda d: sign_food_truck_alley(d, args.peachtree))
    emit('03 VIP Parking Only', sign_vip_parking)
    emit('04 Employees Only + VIP Parking', sign_employees_vip)

    banner = os.path.join(args.outdir, '05 VIP Luxury Lounge Banner 96x18.pdf')
    build_banner(banner)
    made.append(banner)

    proof_sheet(made, os.path.join(args.outdir, '_proof.png'))
    for p in made:
        print('wrote', p)


if __name__ == '__main__':
    main()
