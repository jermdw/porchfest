"""Generate PorchFest stage-sponsor yard signs (24x18in) with logo + name-under layout.

Sponsors with no logo fall back to the big-name layout. Mirrored dove bottom-right
on all. See ../SKILL.md for the full workflow (sourcing logos, running this script,
building the proof sheet and zip).
"""
import os
import pymupdf
from PIL import Image

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(SKILL_DIR, 'assets')

NAVY = (0/255, 47/255, 167/255)      # royal blue #002FA7 (ink-sample colour, NOT
                                      # the site's brand navy #101D3A -- see SKILL.md)
FLAG = (0xB0/255, 0x2A/255, 0x30/255)  # brand flag red, the yard-sign family's accent

# Named inks a spec's "ink" field can ask for. Deliberately a short list rather
# than free-form hex: the printed set is one ink for a reason, and an exception
# should be a decision someone made, not a colour someone typed.
INKS = {'blue': NAVY, 'red': FLAG}
W, H = 1728, 1296                    # 24x18in at 72pt/in
FONTFILE = os.path.join(ASSETS, 'Oswald-Bold.ttf')
font = pymupdf.Font(fontfile=FONTFILE)

HEADER = "This Stage Sponsored by:"
HEADER_SIZE = 125
MAX_W, LEAD = 1500, 1.06
BIRD_ASPECT = 1020 / 950
BAND_TOP, BAND_BOTTOM = 245, 1165    # usable space between header and the dove
LOGO_NAME_GAP = 50
NAME_MAX_SIZE = 150

_bird_flip_cache = None


def _bird_flip_path():
    """Mirrored dove, flipped once into a scratch file next to the upright original."""
    global _bird_flip_cache
    if _bird_flip_cache is None:
        src = os.path.join(ASSETS, 'dove.png')
        _bird_flip_cache = os.path.join(ASSETS, '.dove_flip.png')
        if not os.path.exists(_bird_flip_cache):
            Image.open(src).transpose(Image.FLIP_LEFT_RIGHT).save(_bird_flip_cache)
    return _bird_flip_cache


def tokens(name):
    words = name.upper().split()
    out = []
    for w in words:
        if w == '&' and out:
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


def best_layout(name, zone_top, zone_bottom, max_size, max_lines=3):
    words = tokens(name)
    best = None
    for n in range(1, min(max_lines, len(words)) + 1):
        for part in partitions(words, n):
            lines = [' '.join(p) for p in part]
            maxw1 = max(font.text_length(line, fontsize=1) for line in lines)
            size = min(max_size, MAX_W / maxw1, (zone_bottom - zone_top) / (LEAD * n))
            if best is None or size > best[0] + 0.5 or (abs(size - best[0]) <= 0.5 and maxw1 < best[2]):
                best = (size, lines, maxw1)
    return best[0], best[1]


def block_height(size, lines):
    return size * LEAD * (len(lines) - 1) + size * (font.ascender - font.descender)


def draw_lines_at(page, size, lines, y_top, color=None):
    """Draw centered lines with the block's top edge at y_top."""
    y = y_top + size * font.ascender
    for line in lines:
        lw = font.text_length(line, fontsize=size)
        page.insert_text(((W - lw) / 2, y), line, fontname='OswB', fontsize=size,
                         color=color or NAVY)
        y += size * LEAD


def draw_name(page, name, zone_top, zone_bottom, max_size, max_lines=3, color=None):
    size, lines = best_layout(name, zone_top, zone_bottom, max_size, max_lines)
    draw_lines_at(page, size, lines,
                  zone_top + (zone_bottom - zone_top - block_height(size, lines)) / 2,
                  color=color)
    return size, lines


def prep_logo(path):
    """Flatten to white, trim margins; return (processed png path, w, h).

    Only trims NEAR-WHITE margins. A logo whose field is a solid dark colour
    (e.g. a white knockout on black) passes through untouched -- pre-crop those
    yourself before calling make_sign(). See SKILL.md "Preparing a sourced logo".
    """
    im = Image.open(path).convert('RGBA')
    white = Image.new('RGBA', im.size, (255, 255, 255, 255))
    flat = Image.alpha_composite(white, im).convert('RGB')
    alpha_bbox = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    thresh_bbox = flat.convert('L').point(lambda v: 255 if v < 245 else 0).getbbox()
    bbox = alpha_bbox if (alpha_bbox and alpha_bbox != (0, 0, im.width, im.height)) else thresh_bbox
    if bbox:
        pw = max(2, int(0.01 * max(im.size)))
        bbox = (max(0, bbox[0]-pw), max(0, bbox[1]-pw),
                min(im.width, bbox[2]+pw), min(im.height, bbox[3]+pw))
        flat = flat.crop(bbox)
    out = path.rsplit('.', 1)[0] + '_prepped.png'
    flat.save(out)
    return out, flat.width, flat.height


SUB_RATIO = 0.80          # subtitle size, as a fraction of the name's size
SUB_GAP = 0.28            # gap above the subtitle, as a fraction of that size


def subtitle_size(text, size):
    """Shrink `size` until `text` fits the printable width.

    A subtitle is free text -- a reseller's name, a list of towns -- so nothing
    stops it being longer than the sign is wide. Centring an over-wide line puts
    its left edge at a negative x and the PDF clips BOTH ends, which reads as a
    mangled sign rather than an obvious error. Scaling down instead keeps the
    whole line on the sign; if that leaves it too small to read, that is visible
    in the proof, which is the point of the proof.
    """
    w = font.text_length(text, fontsize=size)
    return size * MAX_W / w if w > MAX_W else size


def draw_subtitle(page, text, size, y_top, color=None):
    """One centered line under the sponsor name, in the same ink at ~46%.

    For the second line a sponsor's name sometimes needs and the header cannot
    carry: a reseller's own name, or the towns a shop trades in. Deliberately
    not the same weight relationship as the header -- it reads as part of the
    name block, not as another label.
    """
    size = subtitle_size(text, size)
    w = font.text_length(text, fontsize=size)
    page.insert_text(((W - w) / 2, y_top + size * font.ascender), text,
                     fontname='OswB', fontsize=size, color=color or NAVY)


def make_sign(name, logo_path, outdir, out_name=None, subtitle=None, ink=None):
    """Render one sign PDF. Returns (filename, logo_size), where logo_size is
    (placed_w_in, placed_h_in, src_w_px, src_h_px) for a logo sign, or None for
    a name-only sign -- the caller already knows this at creation time, so
    there's no need to re-open the saved PDF and guess which embedded image is
    the sponsor logo vs. the dove."""
    doc = pymupdf.open()
    page = doc.new_page(width=W, height=H)
    page.insert_font(fontname='OswB', fontfile=FONTFILE)

    if ink is not None and ink not in INKS:
        raise ValueError(f'unknown ink {ink!r}; choose one of {sorted(INKS)}')
    color = INKS[ink] if ink else NAVY

    hw = font.text_length(HEADER, fontsize=HEADER_SIZE)
    page.insert_text(((W - hw) / 2, 48 + HEADER_SIZE * font.ascender),
                     HEADER, fontname='OswB', fontsize=HEADER_SIZE, color=color)

    logo_size = None
    if logo_path:
        prepped, lw_px, lh_px = prep_logo(logo_path)
        size, lines = best_layout(name, 0, 225, NAME_MAX_SIZE, 2)
        name_h = block_height(size, lines)
        sub_size = subtitle_size(subtitle, size * SUB_RATIO) if subtitle else 0
        sub_h = (sub_size * SUB_GAP + sub_size * (font.ascender - font.descender)
                 if subtitle else 0)
        # Logo takes every point the name leaves behind, capped by the printable
        # width and by native resolution (60dpi effective floor, so low-res marks
        # never get blown up to mush).
        avail_h = (BAND_BOTTOM - BAND_TOP) - LOGO_NAME_GAP - name_h - sub_h
        scale = min(1428 / lw_px, avail_h / lh_px, (lh_px / 60 * 72) / lh_px)
        w, h = lw_px * scale, lh_px * scale
        logo_size = (w / 72, h / 72, lw_px, lh_px)
        # Logo + name travel as one group, centered in the band, so short/wide
        # logos don't leave a dead gap above their name.
        group_h = h + LOGO_NAME_GAP + name_h + sub_h
        top = BAND_TOP + (BAND_BOTTOM - BAND_TOP - group_h) / 2
        page.insert_image(pymupdf.Rect(W/2 - w/2, top, W/2 + w/2, top + h),
                          filename=prepped)
        draw_lines_at(page, size, lines, top + h + LOGO_NAME_GAP, color=color)
        if subtitle:
            draw_subtitle(page, subtitle, sub_size,
                          top + h + LOGO_NAME_GAP + name_h + sub_size * SUB_GAP,
                          color=color)
    else:
        # Name-only signs reserve the subtitle's slice before centring, so the
        # pair sits centred in the band as one block rather than the name
        # centring alone and the subtitle hanging below it.
        size, lines = best_layout(name, BAND_TOP, BAND_BOTTOM, 340, max_lines=3)
        name_h = block_height(size, lines)
        sub_size = subtitle_size(subtitle, size * SUB_RATIO) if subtitle else 0
        sub_h = (sub_size * SUB_GAP + sub_size * (font.ascender - font.descender)
                 if subtitle else 0)
        top = BAND_TOP + (BAND_BOTTOM - BAND_TOP - name_h - sub_h) / 2
        draw_lines_at(page, size, lines, top, color=color)
        if subtitle:
            draw_subtitle(page, subtitle, sub_size, top + name_h + sub_size * SUB_GAP,
                          color=color)

    # dove: small, bottom-right, below the name band, mirrored to face into the sign
    bh = 90
    bw = bh * BIRD_ASPECT
    margin = 34
    page.insert_image(pymupdf.Rect(W - margin - bw, H - margin - bh, W - margin, H - margin),
                      filename=_bird_flip_path())
    fname = (out_name or name).replace('/', '-') + '.pdf'
    doc.save(os.path.join(outdir, fname), deflate=True)
    return fname, logo_size


def contact_sheet(outdir, png_out, files=None):
    files = files or [f for f in sorted(os.listdir(outdir)) if f.endswith('.pdf')]
    cols, cw, ch = 3, 576, 432
    sheet = pymupdf.open()
    sp = sheet.new_page(width=cols*cw, height=((len(files)+cols-1)//cols)*ch)
    for i, f in enumerate(files):
        src = pymupdf.open(os.path.join(outdir, f))
        r, c = divmod(i, cols)
        sp.show_pdf_page(pymupdf.Rect(c*cw+8, r*ch+8, (c+1)*cw-8, (r+1)*ch-8), src, 0)
        src.close()
    sp.get_pixmap(dpi=96).save(png_out)


def placed_logo_size(pdf_path):
    """Best-effort (w_in, h_in, src_w_px, src_h_px) for the sponsor logo in an
    already-saved sign PDF, or None for a name-only sign. Prefer the logo_size
    make_sign() already returns when you have it -- this exists only for
    inspecting a PDF you didn't just generate. A name-only page has exactly one
    embedded image (the dove); a logo page has two, and the dove is identified
    by matching the *current* dove asset's own pixel size rather than a
    hardcoded constant, so this stays correct if the asset is ever replaced."""
    d = pymupdf.open(pdf_path)
    p = d[0]
    images = p.get_images(full=True)
    if len(images) < 2:
        return None
    dove_w, dove_h = Image.open(os.path.join(ASSETS, 'dove.png')).size
    for im in images:
        if (im[2], im[3]) == (dove_w, dove_h):
            continue
        for r in p.get_image_rects(im[0]):
            return (r.width/72, r.height/72, im[2], im[3])
    return None
