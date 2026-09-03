"""Generate a printable volunteer roster PDF from live PorchFest Firestore data.

A working document for organizers -- not signage, so it skips the yard-sign
house style entirely and just needs to be legible on a printed page: US
Letter, portrait, Oswald throughout (Bold for headers, Regular for rows).

Oswald -- not a PDF base-14 font -- is used for the *rows* too, not just
headers, because shift `role` text comes straight from Firestore and some
roles carry an em dash ("Setup Crew — barricades..."). PyMuPDF's base-14
fonts (fontname="helv"/"hebo") silently substitute a stray dot glyph for
anything outside their limited built-in encoding, em dash included -- it
doesn't error, so this is easy to ship without noticing. Embedding a real
webfont sidesteps the whole encoding question rather than auditing every
string (own literals included) for characters the base-14 fonts might choke
on.

Pulls shifts and active signups via the Firestore REST API (same auth this
repo's other admin scripts use) rather than the emulator, since a printable
roster is only useful with real signup data:

    TOKEN=$(gcloud auth print-access-token --account jermdw@gmail.com)
    python3 scripts/generate_volunteer_roster.py --token "$TOKEN" [--outdir DIR]

Grouping and empty-slot handling mirror the CSV export in src/pages/Admin.jsx
(exportCsv) so this and that spreadsheet never disagree: shifts sorted by
day then sortOrder, one row per spot (padded with "OPEN" past the signup
count so understaffed shifts are visible), and any active signup whose
shiftId no longer matches a shift listed under its own heading rather than
silently dropped.
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_signage as base  # noqa: E402 -- for its Oswald ttf loader

PROJECT = 'senoiaporchfest'
EVENT_ID = '2026'
FS_BASE = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents'

PAGE_W, PAGE_H = 8.5 * 72, 11 * 72
MARGIN = 54
INK = (0x10 / 255, 0x1D / 255, 0x3A / 255)   # brand navy -- headers only
GRAY = (0.45, 0.45, 0.45)
LINE = (0.82, 0.82, 0.82)
OPEN_RED = (0.7, 0.15, 0.15)

REG_TTF = base._oswald(400, 'Oswald-Regular.ttf')
HEAD_FONT = pymupdf.Font(fontfile=base.BOLD_TTF)
BODY_FONT = pymupdf.Font(fontfile=REG_TTF)


def _wrap(text, max_w, font, fontsize):
    """Greedy word-wrap using the embedded font's own metrics, so a long
    role name (the "Clean-Up Crew -- ... to predetermined spot" kind) breaks
    onto a second line instead of running under the filled/total badge."""
    words = text.split()
    lines, cur = [], ''
    for w in words:
        trial = f'{cur} {w}'.strip()
        if not cur or font.text_length(trial, fontsize=fontsize) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or ['']


def _curl_json(url, token, data=None):
    """Shell out to curl rather than urllib -- this machine's python.org build
    has no local CA bundle wired up, and curl already has one."""
    cmd = ['curl', '-s', '-H', f'Authorization: Bearer {token}']
    if data is not None:
        cmd += ['-H', 'Content-Type: application/json', '-d', json.dumps(data)]
    cmd.append(url)
    out = subprocess.run(cmd, capture_output=True, check=True, text=True).stdout
    return json.loads(out)


def _get(path, token):
    return _curl_json(f'{FS_BASE}/{path}', token)


def _run_query(body, token):
    return _curl_json(f'{FS_BASE}:runQuery', token, data=body)


def _val(v):
    """Unwrap a Firestore REST typed value."""
    if 'stringValue' in v:
        return v['stringValue']
    if 'integerValue' in v:
        return int(v['integerValue'])
    if 'timestampValue' in v:
        return v['timestampValue']
    if 'booleanValue' in v:
        return v['booleanValue']
    return None


def _doc(fields):
    return {k: _val(v) for k, v in fields.items()}


def fetch(token):
    shifts_raw = _get(f'events/{EVENT_ID}/shifts?pageSize=500', token)
    shifts = []
    for d in shifts_raw.get('documents', []):
        s = _doc(d['fields'])
        s['id'] = d['name'].rsplit('/', 1)[-1]
        shifts.append(s)

    query = {
        'structuredQuery': {
            'from': [{'collectionId': 'signups'}],
            'where': {'compositeFilter': {'op': 'AND', 'filters': [
                {'fieldFilter': {'field': {'fieldPath': 'eventId'}, 'op': 'EQUAL',
                                 'value': {'stringValue': EVENT_ID}}},
                {'fieldFilter': {'field': {'fieldPath': 'status'}, 'op': 'EQUAL',
                                 'value': {'stringValue': 'active'}}},
            ]}},
            'limit': 1000,
        }
    }
    signups_raw = _run_query(query, token)
    signups = []
    for row in signups_raw:
        doc = row.get('document')
        if not doc:
            continue
        v = _doc(doc['fields'])
        v['id'] = doc['name'].rsplit('/', 1)[-1]
        signups.append(v)

    return shifts, signups


def build_pdf(shifts, signups, out_path):
    signups_by_shift = {}
    for v in signups:
        signups_by_shift.setdefault(v.get('shiftId'), []).append(v)

    sorted_shifts = sorted(shifts, key=lambda s: (s.get('day', ''), s.get('sortOrder', 0)))
    known_ids = {s['id'] for s in sorted_shifts}
    orphaned = [v for v in signups if v.get('shiftId') not in known_ids]

    total_spots = sum(s.get('spotsTotal', 0) for s in sorted_shifts)
    total_filled = len(signups)

    doc = pymupdf.open()
    page = None
    y = 0

    def new_page():
        nonlocal page, y
        page = doc.new_page(width=PAGE_W, height=PAGE_H)
        page.insert_font(fontname='OswB', fontfile=base.BOLD_TTF)
        page.insert_font(fontname='OswR', fontfile=REG_TTF)
        y = MARGIN
        return page

    def ensure_room(h):
        nonlocal y
        if y + h > PAGE_H - MARGIN:
            new_page()

    new_page()

    # --- title block, first page only ---
    page.insert_text((MARGIN, y + 26), 'Senoia PorchFest 2026 - Volunteer Roster',
                     fontname='OswB', fontsize=22, color=INK)
    y += 34
    page.insert_text((MARGIN, y + 14), 'Sunday, September 6, 2026',
                     fontname='OswR', fontsize=12, color=GRAY)
    y += 20
    generated = datetime.now(timezone.utc).astimezone().strftime('%B %-d, %Y at %-I:%M %p')
    page.insert_text((MARGIN, y + 12),
                     f'{total_filled} of {total_spots} spots filled across {len(sorted_shifts)} shifts '
                     f'· generated {generated}',
                     fontname='OswR', fontsize=9.5, color=GRAY)
    y += 26
    page.draw_line((MARGIN, y), (PAGE_W - MARGIN, y), color=INK, width=1.2)
    y += 22

    badge_w_reserve = 130   # widest realistic "N / N filled" badge, so wrapping
                            # never has to re-measure per shift

    for shift in sorted_shifts:
        roster = sorted(signups_by_shift.get(shift['id'], []),
                        key=lambda v: (v.get('lastName', ''), v.get('firstName', '')))
        filled = shift.get('spotsFilled', len(roster))
        total = shift.get('spotsTotal', 0)
        rows = max(total, len(roster))

        role_w = PAGE_W - 2 * MARGIN - badge_w_reserve
        role_lines = _wrap(shift.get('role', ''), role_w, HEAD_FONT, 12.5)
        header_h = 13 + (len(role_lines) - 1) * 15 + 14 + 7
        row_h = 15
        ensure_room(header_h + row_h * max(rows, 1) + 14)

        # shift header: role (bold, may wrap) + time, filled/total badge
        for j, line in enumerate(role_lines):
            page.insert_text((MARGIN, y + 13 + j * 15), line,
                             fontname='OswB', fontsize=12.5, color=INK)
        time_y = y + 13 + (len(role_lines) - 1) * 15 + 14
        page.insert_text((MARGIN, time_y), shift.get('time', ''),
                         fontname='OswR', fontsize=9, color=GRAY)
        badge = f'{filled} / {total} filled'
        bw = BODY_FONT.text_length(badge, fontsize=9.5)
        page.insert_text((PAGE_W - MARGIN - bw, y + 13), badge,
                         fontname='OswR', fontsize=9.5,
                         color=OPEN_RED if filled < total else (0.15, 0.45, 0.2))
        y += header_h

        name_x, phone_x, email_x = MARGIN + 14, MARGIN + 230, MARGIN + 360
        for i in range(rows):
            v = roster[i] if i < len(roster) else None
            if v:
                name = f"{v.get('firstName', '')} {v.get('lastName', '')}".strip()
                phone = v.get('phone') or '-'
                email = v.get('email') or '-'
                color = (0.15, 0.15, 0.15)
            else:
                name, phone, email = 'OPEN', '', ''
                color = OPEN_RED
            page.insert_text((name_x, y + 11), name, fontname='OswR', fontsize=10, color=color)
            if v:
                page.insert_text((phone_x, y + 11), phone, fontname='OswR', fontsize=9.5, color=GRAY)
                page.insert_text((email_x, y + 11), email, fontname='OswR', fontsize=9.5, color=GRAY)
            y += row_h

        y += 10
        page.draw_line((MARGIN, y), (PAGE_W - MARGIN, y), color=LINE, width=0.6)
        y += 12

    if orphaned:
        ensure_room(30 + 15 * len(orphaned))
        page.insert_text((MARGIN, y + 13), 'Signed up, shift since removed',
                         fontname='OswB', fontsize=12.5, color=INK)
        y += 30
        for v in sorted(orphaned, key=lambda v: (v.get('lastName', ''), v.get('firstName', ''))):
            name = f"{v.get('firstName', '')} {v.get('lastName', '')}".strip()
            page.insert_text((MARGIN + 14, y + 11), name, fontname='OswR', fontsize=10, color=(0.15, 0.15, 0.15))
            page.insert_text((MARGIN + 230, y + 11), v.get('phone') or '-',
                             fontname='OswR', fontsize=9.5, color=GRAY)
            y += 15

    doc.save(out_path, deflate=True)
    doc.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--token', required=True, help='gcloud access token (see module docstring)')
    ap.add_argument('--outdir', default=os.path.expanduser('~/Downloads'))
    args = ap.parse_args()
    os.makedirs(args.outdir, exist_ok=True)

    shifts, signups = fetch(args.token)
    out = os.path.join(args.outdir,
                       f'PorchFest-Volunteer-Roster-{datetime.now().strftime("%Y-%m-%d")}.pdf')
    build_pdf(shifts, signups, out)
    print(f'wrote {out}  ({len(shifts)} shifts, {len(signups)} active signups)')


if __name__ == '__main__':
    main()
