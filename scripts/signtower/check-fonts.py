#!/usr/bin/env python3
"""Fail if a bundled webfont cannot render the text the panels set in it.

This exists because of a bug that shipped: the League Gothic woff2 was pulled
from the first @font-face block in a Google Fonts CSS response, which is an
accented-latin subset -- 114 glyphs, and of ASCII only a space and "A". Chrome
silently rendered the whole lockup in the Oswald fallback and kept the one
League Gothic "A", so the wordmark came out in the wrong typeface with a single
odd letter in it. Nothing errored; it just looked slightly wrong at 48 inches.

A missing glyph is invisible in a PDF -- the fallback simply takes over -- so
there is no way to catch this by looking at the output unless you already
suspect it. Hence a check.

    ./check-fonts.py        # exits non-zero on any gap

Run it after replacing any file in fonts/.
"""
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit('fontTools is required: pip install fonttools brotli')

HERE = Path(__file__).parent

# What each face actually has to draw across the four panels. Kept as literal
# text rather than a range so the failure message names the missing character.
#
# The punctuation here is not decoration. The lockup sets Senoia&rsquo;s, so it
# needs U+2019 and NOT the ASCII apostrophe; side 4 sets Greg &ldquo;Rogan&rdquo;
# Rogers, so Oswald needs U+201C/U+201D. Checking the ASCII lookalike instead
# passes while Chrome quietly falls back for the character actually rendered --
# the exact failure this script exists to catch.
#
# To re-derive after editing a panel: strip <style> and tags, html.unescape the
# rest, and collect every character above U+007F plus the curly quotes.
_OSWALD = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
           " &.,:;!?'\"-()/" "—’“”©·")

REQUIRED = {
    'league-gothic-latin-400-normal.woff2': "SENOIA’S5THANNUALPORCHFEST ",
    'oswald-latin-700-normal.woff2': _OSWALD,
    'oswald-latin-600-normal.woff2': _OSWALD,
    'oswald-latin-500-normal.woff2': _OSWALD,
    'yellowtail-latin-400-normal.woff2':
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .",
}

# Side 2's amenity pins are drawn with these dingbats, and Oswald has none of
# them -- they resolve through a system font on the rendering machine. That is
# a real dependency on the box doing the rendering, not something this script
# can require, so it is reported rather than enforced. If a pin ever prints as
# a blank or a tofu box, this is why: the fix is to swap that pin to an inline
# SVG, the way the beverage-station pin already works.
SYSTEM_FALLBACK = "★♪✚❄❖☀"

fail = False
for name, required in REQUIRED.items():
    path = HERE / 'fonts' / name
    if not path.exists():
        print(f'MISSING FILE  {name}')
        fail = True
        continue
    cmap = TTFont(path).getBestCmap()
    gaps = sorted({c for c in required if ord(c) not in cmap})
    if gaps:
        print(f'INCOMPLETE    {name}: cannot draw {"".join(gaps)!r} '
              f'({len(cmap)} glyphs total) -- Chrome will silently fall back')
        fail = True
    else:
        print(f'ok            {name} ({len(cmap)} glyphs)')

osw = HERE / 'fonts' / 'oswald-latin-700-normal.woff2'
if osw.exists():
    cmap = TTFont(osw).getBestCmap()
    missing = ''.join(c for c in SYSTEM_FALLBACK if ord(c) not in cmap)
    if missing:
        print(f'note          map pin glyphs {missing!r} are not in Oswald and '
              f'resolve via a system font on the rendering machine')

sys.exit(1 if fail else 0)
