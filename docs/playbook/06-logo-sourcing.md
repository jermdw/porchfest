# 06 — Logo Sourcing

← [Playbook index](README.md)

You need a sponsor's logo at print resolution. This chapter is the accumulated
research from sourcing roughly 30 of them, and it will save you hours.

> **The best fix is upstream.** Ask every sponsor for print-resolution or vector
> artwork **at signing**, as a line in the sponsorship agreement. Everything
> below exists because that did not happen.

---

## First: the repo's logos are useless for print

Every `src/assets/sponsor-*.webp` and `vendor-*.webp` is downscaled to a **400 px
long edge** for the web. At that size a logo places at roughly 6.7 in on a
24 × 18 in sign, and around 30 dpi on a large banner.

They tell you **which** sponsors have been identified. They are not a source.
Always re-source the original.

Print-resolution copies actually used by the generators live in
`scripts/assets/logo-*.png` and `scripts/signtower/assets/`, and are committed.

---

## The sourcing ladder

Work down it and stop at the first usable hit. **Always sanity-check resolution
before moving on** — see the floors in
[05](05-print-and-signage.md#the-effective-dpi-floor).

### 1. The organizers' own files

`~/Downloads` and the DDA's Google Drive, **before any web research**. Sponsors
often send artwork with their sign-up, and it is usually the best copy anyone
will find.

### 2. enjoysenoia.com `/partners/<slug>`

These pages host **print-quality uploads** — genuinely the second-best source for
Senoia businesses.

Note the distinction: `/partners/<slug>` pages carry real logo uploads;
`/downtown-business/<slug>` pages on the same site carry photos only, and the
site's own header and footer assets are web derivatives.

```bash
curl -sL https://enjoysenoia.com/sitemap.xml    # find the slug
```

Then fetch the page and look for `https://cdn.prod.website-files.com/...`
image URLs. **Filter out anything with `-p-<number>` in the filename** — those
are downscaled variants; the bare filename is the original upload.

> **CMYK JPEG check.** Some uploads are CMYK JPEGs with an Adobe marker, which
> can decode **inverted**. Before trusting one, verify that a corner pixel reads
> white and the artwork reads dark, then `.convert('RGB')`.

### 3. Facebook Graph — the trick that rescues small businesses

```
https://graph.facebook.com/<page-slug>/picture?width=2000&height=2000&redirect=1
```

Returns a page's profile picture at its **true stored resolution**. No auth, no
token, no API key.

> `?type=large` caps at 200 px. **Always use the `width`/`height` form.**

This beat every other source repeatedly and rescued four dead ends in 2026 —
turning a 200 × 83 px logo into 1079 px, a 292 px into 1179 px, and two others
into 2048 px. Get the slug from a `facebook.com/<slug>` link on the sponsor's own
site.

It does not always work: at least one Senoia business's page slug does not
resolve through this path at all. If it 404s or returns a generic image, move on
rather than retrying variants.

### 4. The sponsor's own website — last

Counter-intuitively the **worst** source in practice. Business sites serve
web-optimised derivatives, typically 400–500 px, which place worse than what
Facebook or enjoysenoia already gave you.

Exceptions exist and are worth a look: a WordPress site may hide a larger file in
`/wp-content/uploads/`, and some restaurant platforms serve a 2000 px roundel.

### 5. Name-only

If nothing above works, ship a name-only sign (`"logo": null` in the spec).
**Tell the organizers this happened and why** — do not silently ship a plainer
sign.

---

## A true vector source beats any raster, at any size

If you find an SVG, EPS or PDF, use it. Render it with PyMuPDF at whatever
resolution you need rather than using a bitmap export.

> **PyMuPDF's SVG renderer is not always reliable.** On at least one file it
> returned a black blob. When that happens, render the SVG through **headless
> Chrome** to PDF instead — that is how the committed
> `scripts/assets/bmw-roundel.pdf` was produced, and it is sharp at any size.

### Split the mark from the name

The single most useful trick for a stubborn logo. A dealer or franchise raster
usually bakes the symbol and the wordmark together, and it is the **lettering**
that caps the usable resolution.

Set the name as **live Oswald type** and place the symbol separately as vector.
The BMW roundel was unlocked exactly this way — and it is what the DDA's own VIP
flyer does.

---

## Preparing a logo before it goes in a spec

`prep_logo()` auto-trims near-white margins and flattens transparency onto white.
It does **nothing useful** for a logo whose field is a solid dark colour — that
trims to nothing and places as a giant colour block. Handle these yourself first:

| Case | What to do |
| --- | --- |
| **White-on-solid-colour, colour is load-bearing** (a brand's teal or black plaque) | Threshold on the non-white content, take that bounding box + 5% padding, crop the plaque to a proportionate size. **Keep the field** — it is part of the mark. |
| **Pure white knockout, no colour data** (verify opaque pixels really are `255,255,255` and only alpha carries the shape) | Recolour by setting RGB to the sign's ink and compositing on white. Nothing is lost. |
| **Mark inside a busy or circular crop** (an oval Facebook profile picture) | Fit an ellipse or rectangle to the light region's bounding box, composite outside it to white, crop. |
| **CMYK JPEG** | `Image.open(path).convert('RGB')` before anything else. |
| **White plaque on a flat colour field** | Threshold `(a > 225).all(axis=2)`, take the bounding box, crop — the field falls away and the plaque's inner rule becomes the frame. |

Save the prepped file next to the spec's `logos/` folder and point the spec at
it.

---

## Known dead ends — do not spend time on these again

- **A national dealer's full lockup.** The dealer site sits behind Cloudflare bot
  protection (do not try to bypass it), and only the 400 px web asset exists
  locally, placing at about 30 dpi on a 96-inch banner. Dealer co-op artwork has
  to come from the dealer's approved brand pack — **ask the DDA or the brand
  representative.** Precedent: the existing 48 × 96 in sign towers were also
  built from 400 px web logos, and the DDA accepted that.
- **The Senoia DDA "America 250" logo does not exist publicly.** All 340
  enjoysenoia.com sitemap pages, 3,211 unique CDN images, and the DDA's Facebook
  profile picture were checked — all carry the standard seal. Ask the DDA
  directly.
- **Some businesses genuinely have no better source than a 400–500 px file.**
  Use a name-only layout rather than blowing it up.

## One file to avoid

A file named `kim_peacock_logo.png` in Downloads is **a contact card carrying
personal contact details**, not a logo. Do not place it on a public sign. Use the
2000 × 2000 JPEG instead — and note that the PDF of the same name has artwork
rotated 90°.

---

## Recording what you find

When you finish a batch, write down **the source for each logo** — the exact URL
or file path — so next year's rebuild does not redo this research. Add it here,
in this chapter, in the same pull request that adds the signs.

That is the whole reason this chapter is useful: someone wrote it down.
