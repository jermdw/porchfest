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

Renders everything into a private staging directory first; OUTDIR is only
touched after every sign renders successfully, and only this run's filenames
(each sponsor's PDF, plus proof.png) are written there -- an existing OUTDIR
(e.g. a prior batch, or a directory the operator already had other files in)
never gets swept or deleted. Re-running with a shorter sponsor list will not
remove a now-orphaned PDF from a previous run; delete those by hand if needed.

Writes one PDF per sponsor into OUTDIR, plus OUTDIR/proof.png (a contact sheet)
and OUTDIR.zip (this run's PDFs only) next to OUTDIR. Prints each sponsor's
placed logo size in inches so you can eyeball anything that looks too small
before sending the batch -- read the printed sizes, don't just trust the run
finished without error.
"""
import json
import os
import shutil
import sys
import tempfile
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

    with tempfile.TemporaryDirectory(prefix='porchfest-signs-') as staging:
        made = []
        print(f"{'sponsor':45s} {'logo':>12s}   src")
        for s in sponsors:
            logo = s.get('logo')
            logo_abs = os.path.join(spec_dir, logo) if logo else None
            fname, sized = g.make_sign(s['name'], logo_abs, staging, out_name=s.get('out_name'))
            made.append(fname)
            if sized:
                w, h, sw, sh = sized
                print(f"{fname[:-4]:45s} {w:5.1f}x{h:4.1f}in   src {sw}x{sh}px")
            else:
                print(f"{fname[:-4]:45s}   name-only")

        proof_name = 'proof.png'
        g.contact_sheet(staging, os.path.join(staging, proof_name), made)

        # Every sign rendered -- now, and only now, touch OUTDIR: copy in this
        # run's files by name (overwriting same-named files from a prior run of
        # this same batch), and leave everything else in OUTDIR untouched.
        os.makedirs(outdir, exist_ok=True)
        for fname in made + [proof_name]:
            shutil.copy2(os.path.join(staging, fname), os.path.join(outdir, fname))

    batch_name = os.path.basename(os.path.normpath(outdir))
    zip_path = os.path.normpath(outdir).rstrip('/\\') + '.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in made:
            z.write(os.path.join(outdir, f), f"{batch_name}/{f}")

    print(f"\n{len(made)} signs -> {outdir}")
    print(f"proof sheet -> {os.path.join(outdir, proof_name)}")
    print(f"zip -> {zip_path} ({os.path.getsize(zip_path)/1e6:.1f} MB)")


if __name__ == '__main__':
    main()
