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
REQUIRED = {
    'league-gothic-latin-400-normal.woff2':
        "SENOIA'S5THANNUALPORCHFEST ",
    'oswald-latin-700-normal.woff2':
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &.,:'-—’",
    'oswald-latin-600-normal.woff2':
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &.,:'-—’",
    'oswald-latin-500-normal.woff2':
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &.,:'-—’",
    'yellowtail-latin-400-normal.woff2':
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .",
}

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

sys.exit(1 if fail else 0)
