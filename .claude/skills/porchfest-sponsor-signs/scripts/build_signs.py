#!/usr/bin/env python3
"""CLI driver for gen_sponsor_signs.py.

Usage:
    python build_signs.py SPEC.json OUTDIR

SPEC.json is a JSON array of sponsor objects, in the order they should appear
on the contact sheet:

    [
      {"name": "Filmore's Garage", "logo": "logos/filmores.png"},
      {"name": "The Veranda Inn", "logo": null},
      {"name": "Senoia Area Historical Society", "logo": "logos/sahs.png",
       "out_name": "Senoia Area Historical Society (classic logo)"}
    ]

- "logo": null (or omitted) falls back to the name-only big-type layout.
- "logo" paths are resolved relative to SPEC.json's own directory, so keep a
  logos/ folder next to the spec file.
- "out_name" overrides the PDF filename when you need two variants of one
  sponsor's name to coexist (e.g. two logo options to hand the client).

Writes one PDF per sponsor into OUTDIR, plus OUTDIR/proof.png (a contact sheet)
and OUTDIR.zip (all PDFs, no proof sheet, no logos/ leftovers) next to OUTDIR.
Prints each sponsor's placed logo size in inches so you can eyeball anything
that looks too small before sending the batch -- read the printed sizes, don't
just trust the run finished without error.
"""
import json
import os
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_sponsor_signs as g


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    spec_path, outdir = sys.argv[1], sys.argv[2]
    spec_dir = os.path.dirname(os.path.abspath(spec_path))
    sponsors = json.load(open(spec_path))

    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if f.endswith('.pdf'):
            os.remove(os.path.join(outdir, f))

    made = []
    print(f"{'sponsor':45s} {'logo':>12s}   src")
    for s in sponsors:
        logo = s.get('logo')
        logo_abs = os.path.join(spec_dir, logo) if logo else None
        fname = g.make_sign(s['name'], logo_abs, outdir, out_name=s.get('out_name'))
        made.append(fname)
        sized = g.placed_logo_size(os.path.join(outdir, fname))
        if sized:
            w, h, sw, sh = sized
            print(f"{fname[:-4]:45s} {w:5.1f}x{h:4.1f}in   src {sw}x{sh}px")
        else:
            print(f"{fname[:-4]:45s}   name-only")

    proof = os.path.join(outdir, 'proof.png')
    g.contact_sheet(outdir, proof, made)

    zip_path = outdir.rstrip('/\\') + '.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in made:
            z.write(os.path.join(outdir, f), f"{os.path.basename(outdir)}/{f}")

    print(f"\n{len(made)} signs -> {outdir}")
    print(f"proof sheet -> {proof}")
    print(f"zip -> {zip_path} ({os.path.getsize(zip_path)/1e6:.1f} MB)")


if __name__ == '__main__':
    main()
