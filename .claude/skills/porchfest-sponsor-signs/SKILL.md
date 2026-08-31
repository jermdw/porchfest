---
name: porchfest-sponsor-signs
description: Generate print-ready 24x18in "This Stage Sponsored by:" yard signs for Senoia PorchFest porch/stage sponsors. Use when the user asks for a porch sponsor sign, stage sponsor sign, or to add a sponsor to the sign set -- covers sourcing a sponsor's logo (Downloads, Drive, enjoysenoia.com, Facebook, their own site) and running the PyMuPDF generator to produce the PDF, a proof sheet, and a delivery zip.
---

# PorchFest sponsor signs

Produces one 24"x18" landscape PDF per sponsor: navy-blue "This Stage Sponsored
by:" header, the sponsor's logo with their name set below it in Oswald Bold, and
the PorchFest dove mirrored into the bottom-right corner. White background.

Everything the generator needs is bundled in this skill directory:
- `scripts/gen_sponsor_signs.py` -- the layout engine (import this, don't copy it).
- `scripts/build_signs.py` -- CLI driver. Give it a JSON spec + an output dir; it
  writes the PDFs, a contact-sheet proof, and a delivery zip.
- `assets/Oswald-Bold.ttf`, `assets/dove.png` -- fonts and mascot art, already
  extracted/converted. You should never need to rebuild these (see the bottom of
  this file if you ever do).

Do not re-derive the layout logic from scratch or hand-roll a new PyMuPDF script
for this -- use `build_signs.py`. It exists so this whole workflow is one command
instead of a bespoke heredoc every time.

## Workflow

### 1. Check what's already done

Read the roster memory before starting: look for a `porchfest-sponsor-signs-roster`
project memory (`/Users/jermdw/.claude/projects/-Users-jermdw-git-porchfest/memory/`
if it exists on this machine). It lists every sponsor who already has a sign --
skip them. If the memory doesn't exist yet, ask the user or check
`~/Downloads/PorchFest_Sponsor_Signs*` for prior output folders/zips.

### 2. Source each sponsor's logo

Check in this order -- stop at the first usable hit, and always sanity-check
resolution before moving on (a placed logo is capped at roughly `src_height_px x
1.2` points tall, i.e. a 60dpi effective floor: a 400px-tall source maxes out
around 6.7in, a 200px-tall source around 3.3in -- too small for this sign):

1. **The user's own files.** Check `~/Downloads` and Google Drive
   (`search_files` MCP tool, query on the sponsor name + `mimeType contains
   'image/'`) FIRST, before any web research. The user often already has the
   source art from vendor sign-up sheets.
2. **enjoysenoia.com `/partners/<slug>` pages.** These host print-quality
   uploads, unlike the `/downtown-business/<slug>` pages on the same site (photos
   only) or the site's own header/footer assets. Find the slug via
   `curl -sL https://enjoysenoia.com/sitemap.xml`, grep for the sponsor name, then
   fetch the page and grep for
   `https://cdn.prod.website-files.com/...\.(png|svg|jpg|jpeg|webp)`, filtering
   out anything with `-p-<number>` in the filename (those are downscaled
   variants; the bare filename is the original upload). Watch for CMYK JPEGs
   (Adobe marker) -- verify a corner pixel decodes white and the mark decodes
   dark before trusting the file, then `.convert('RGB')`.
3. **Facebook Graph, if you have the page's slug/username:**
   `https://graph.facebook.com/<slug>/picture?width=2000&height=2000&redirect=1`
   returns the page's profile picture at its true stored resolution -- no auth,
   no token needed. (`?type=large` caps at 200px; always use the width/height
   form.) This has repeatedly beaten every other source for small local
   businesses. Get the slug from the sponsor's own site (a `facebook.com/<slug>`
   link) or a websearch.
4. **The sponsor's own website**, as a last resort -- in practice their own site
   usually serves web-optimized derivatives (400px, sub-6in placed) that are
   worse than what Facebook or enjoysenoia already gave you.
5. Only if nothing above works: fall back to a name-only sign (`"logo": null` in
   the spec). Tell the user this happened and why -- don't silently ship a
   smaller/plainer sign.

**A true vector source (SVG/EPS/PDF) beats any raster, at any size** -- render it
with PyMuPDF (`pymupdf.open(path)`, then `page.get_pixmap(matrix=pymupdf.Matrix(z,z),
alpha=True)` at whatever DPI you need) rather than using a bitmap export.

### 3. Prepare the logo file

`prep_logo()` inside `gen_sponsor_signs.py` auto-trims near-white margins and
flattens transparency onto white. It does **nothing** for a logo whose field is a
solid dark colour (e.g. a white wordmark knockout on black) -- that trims to
nothing useful and would place as a giant colour block. Handle these cases
yourself, in a scratch script, before pointing the spec at the file:

- **White-on-solid-colour, colour is load-bearing** (e.g. a teal or black plaque
  that's part of the brand): threshold on the non-white content
  (`convert('L').point(lambda v: 255 if v>40 else 0)`), take that bbox +5% pad,
  and crop the plaque down to a proportionate size. Do NOT strip the field.
- **Pure white knockout with no colour data** (verify: opaque pixels' RGB really
  is `(255,255,255)`, only alpha carries the shape) -- recolor by setting RGB to
  ink and compositing on white; nothing is lost.
- **Logo sits inside a busy/photographic circle crop** (e.g. an oval FB profile
  picture where the mark floats on a plain field outside it) -- fit the shape
  (ellipse/rect) to the light or dark region, composite outside it to white, crop
  to the bbox.
- **CMYK JPEG**: `Image.open(path).convert('RGB')` before doing anything else.

Save the prepped file next to the spec's logo folder; point `"logo"` at that file.

### 4. Write the spec and run the generator

Bootstrap a scratch Python env once per session (pymupdf + pillow aren't system
Python packages):

```bash
python3 -m venv /tmp/porchfest-signs-venv
/tmp/porchfest-signs-venv/bin/pip install -q pymupdf pillow
```

Write `spec.json` next to a `logos/` folder holding the prepped files:

```json
[
  {"name": "Sponsor One", "logo": "logos/sponsor-one.png"},
  {"name": "Sponsor Two", "logo": null},
  {"name": "Sponsor Three", "logo": "logos/sponsor-three-classic.png",
   "out_name": "Sponsor Three (classic logo)"},
  {"name": "doTERRA", "logo": "logos/doterra.png", "subtitle": "Cathy Geis"}
]
```

Use `subtitle` for the second line a sponsor's name needs and the header cannot
carry -- a reseller's own name under the brand they sell, or the towns a shop
trades in. It sets at 46% of the name and works on both layouts. Do not put
"Sponsored by" in `name`: the sign header already reads "This Stage Sponsored
by:", so it would print the phrase twice.

Use `out_name` when you're handing the user two variants of one sponsor to
choose between (as happened for Senoia Area Historical Society -- two logos, two
PDFs, one prompt to pick).

Run it:

```bash
/tmp/porchfest-signs-venv/bin/python \
  <this-skill-dir>/scripts/build_signs.py spec.json ~/Downloads/PorchFest_Sponsor_Signs_<batch>
```

This prints each sponsor's placed logo size in inches -- READ those numbers.
Anything under ~3in is going to look like an afterthought on a 24x18in sign;
go back to sourcing (step 2) for a bigger source rather than shipping it small.
It also writes `<outdir>/proof.png` (a single contact-sheet PNG, three signs per
row -- check all sponsors in that one image) and `<outdir>.zip` (delivery-ready,
PDFs only).

### 5. Verify visually before delivering

Read `proof.png` with the Read tool and actually look at it. Check per sponsor:
logo isn't clipped or floating in a colored box that shouldn't be there, name
text doesn't overlap the logo, the dove is present bottom-right facing inward,
and text reads in the royal blue (not looking washed out or wrong-color, which
usually means a stray edit to `NAVY` in a copy of the generator rather than an
import of the real one).

### 6. Deliver and record

Send the user `proof.png` and the `.zip` via `SendUserFile`. Then update (or
create) the `porchfest-sponsor-signs-roster` project memory with: which sponsors
were added this batch, the logo source for each (so a future rebuild doesn't
redo the research), and any open questions (missing/weak logo, a name spelled
differently across sources, a variant the user hasn't picked yet).

## Design constants (don't relitigate these)

- **Ink is royal blue `#002FA7`**, chosen by the user from physical print
  samples. This is deliberately NOT the site's brand navy `#101D3A` from
  `CLAUDE.md` -- don't "fix" it to match. If a future user explicitly wants a
  different ink, change `NAVY` in `gen_sponsor_signs.py`, not per-call.
- **24"x18" landscape**, white background, header "This Stage Sponsored by:" in
  Oswald Bold, sponsor name in Oswald Bold beneath the logo (or as the sole
  large-type element for name-only signs).
- **The dove is mirrored to face into the sign** (right-facing on the
  bottom-right corner where it sits).
- Every sponsor name renders in Oswald's single weight/case (caps via
  `tokens()`), so acronym-style names like "doTERRA" will print as "DOTERRA" --
  that's expected, not a bug.

## Rebuilding assets/ from scratch (should not be needed)

If `assets/Oswald-Bold.ttf` or `assets/dove.png` are ever lost:

- **Oswald-Bold.ttf**: convert from either PorchFest or senoia-car-show repo's
  `node_modules/@fontsource/oswald/files/oswald-latin-700-normal.woff2` --
  `fontTools.ttLib.TTFont(path)`, set `.flavor = None`, `.save('Oswald-Bold.ttf')`.
- **dove.png**: the mascot only exists fused into the flag-guitar shirt art.
  Extract the embedded raster from any band yard-sign PDF (e.g. one from
  `~/Downloads/PorchFest_Band_Signs*`), crop roughly `(700, 780, 1250, 1330)` out
  of the full 3600x2700 image, white out the guitar body below/left of the bird
  (`[0,400,550,550]` and `[0,0,30,550]`), threshold-trim at v<215 with 6px pad,
  upscale 3x. The belly line is occluded by the guitar in the source art and has
  to be redrawn as a quadratic bezier from roughly `(80,868)` through `(400,1005)`
  to `(660,855)`, width 26, on a canvas extended to 1000px tall with
  `[150,852,595,1000]` erased first. Final trim -> ~1020x950. This is fiddly;
  only do it if the asset is truly gone, not to "improve" the existing one.
