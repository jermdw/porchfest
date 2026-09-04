#!/usr/bin/env python3
"""Render docs/playbook/*.md into one self-contained HTML page.

The markdown is the source of truth; this script exists so the browsable
version can never drift from it. Dependency-free on purpose — it supports
exactly the markdown subset the playbook uses, and nothing else.

    python3 scripts/build-playbook-html.py [-o OUT.html]

Publishing the result as a shareable page is a separate, manual step.
"""
import argparse
import html
import pathlib
import re
import sys

SRC = pathlib.Path(__file__).resolve().parent.parent / "docs" / "playbook"

# ---------------------------------------------------------------- inline ----

def slug(text):
    t = re.sub(r"`([^`]*)`", r"\1", text).lower()
    t = re.sub(r"\*\*|\*|_", "", t)
    t = re.sub(r"[^a-z0-9 -]", "", t)
    return re.sub(r"\s+", "-", t.strip())


def inline(text, chapters):
    """Inline markdown -> HTML. Code spans are extracted first so their
    contents are never treated as markup."""
    spans = []

    def stash(m):
        spans.append(m.group(2).strip())
        return f"\x00{len(spans) - 1}\x00"

    # Double-backtick spans first: they may legally contain single backticks.
    text = re.sub(r"(``)(.+?)\1", stash, text, flags=re.S)
    text = re.sub(r"(`)([^`]+?)\1", stash, text, flags=re.S)

    text = text.replace(r"\|", "|")
    text = html.escape(text, quote=False)

    def link(m):
        label, href = m.group(1), m.group(2)
        target = re.match(r"^(README|\d\d-[a-z0-9-]+)\.md(#([a-z0-9-]+))?$", href)
        if target:
            name, anchor = target.group(1), target.group(3)
            ch = "top" if name == "README" else chapters.get(name, "top")
            href = f"#{ch}-{anchor}" if anchor else f"#{ch}"
        ext = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        return f'<a href="{html.escape(href, quote=True)}"{ext}>{label}</a>'

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text, flags=re.S)
    text = re.sub(r"(?<![\w*])\*([^*\n]+?)\*(?![\w*])", r"<em>\1</em>", text)

    return re.sub(r"\x00(\d+)\x00",
                  lambda m: f"<code>{html.escape(spans[int(m.group(1))], quote=False)}</code>",
                  text)


# ----------------------------------------------------------------- blocks ----

RAW_HTML = ("<details", "</details", "<summary", "</summary")


def render(md, chapter_id, chapters):
    out, lines, i = [], md.split("\n"), 0
    # Drop the H1 (the page supplies its own) and the back-links.
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped.startswith("← ["):
            i += 1
            continue

        if stripped.startswith(RAW_HTML):
            out.append(stripped)
            i += 1
            continue

        # Fenced code
        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            cls = f' class="lang-{html.escape(lang, quote=True)}"' if lang else ""
            body = html.escape("\n".join(buf), quote=False)
            out.append(f"<pre{cls}><code>{body}</code></pre>")
            continue

        # Horizontal rule
        if re.fullmatch(r"-{3,}", stripped):
            out.append("<hr />")
            i += 1
            continue

        # Heading
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            level, text = len(m.group(1)), m.group(2)
            if level == 1:
                i += 1
                continue
            hid = f"{chapter_id}-{slug(text)}"
            out.append(f'<h{level} id="{hid}">'
                       f'<a class="anchor" href="#{hid}" aria-label="Link to this section">#</a>'
                       f'{inline(text, chapters)}</h{level}>')
            i += 1
            continue

        # Table
        if stripped.startswith("|") and i + 1 < len(lines) and \
                re.fullmatch(r"\|[\s:|-]+\|", lines[i + 1].strip()):
            def cells(row):
                return [c.strip() for c in re.split(r"(?<!\\)\|", row.strip())[1:-1]]
            head = cells(lines[i])
            i += 2
            body = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                body.append(cells(lines[i]))
                i += 1
            th = "".join(f"<th>{inline(c, chapters)}</th>" for c in head)
            trs = "".join(
                "<tr>" + "".join(f"<td>{inline(c, chapters)}</td>" for c in r) + "</tr>"
                for r in body)
            out.append(f'<div class="scroll"><table><thead><tr>{th}</tr></thead>'
                       f"<tbody>{trs}</tbody></table></div>")
            continue

        # Blockquote
        if stripped.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            out.append(f'<blockquote>{render_flow(buf, chapter_id, chapters)}</blockquote>')
            continue

        # Lists
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", line)
        if m:
            ordered = not m.group(2) in ("-", "*")
            items, buf = [], None
            while i < len(lines):
                mm = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", lines[i])
                if mm:
                    if buf is not None:
                        items.append(buf)
                    buf = [mm.group(3)]
                    i += 1
                elif lines[i].strip() and lines[i].startswith((" ", "\t")) and buf is not None:
                    buf.append(lines[i].strip())
                    i += 1
                else:
                    break
            if buf is not None:
                items.append(buf)
            tag = "ol" if ordered else "ul"
            lis = []
            for it in items:
                txt = " ".join(it)
                box = re.match(r"^\[([ xX])\]\s+(.*)$", txt)
                if box:
                    checked = " checked" if box.group(1).lower() == "x" else ""
                    lis.append(f'<li class="task"><input type="checkbox" disabled{checked} />'
                               f"{inline(box.group(2), chapters)}</li>")
                else:
                    lis.append(f"<li>{inline(txt, chapters)}</li>")
            out.append(f"<{tag}>{''.join(lis)}</{tag}>")
            continue

        # Paragraph
        buf = []
        while i < len(lines) and lines[i].strip() and \
                not re.match(r"^\s*([-*]|\d+\.|>|#{1,6}\s|```|\|)", lines[i]) and \
                not lines[i].strip().startswith(RAW_HTML) and \
                not re.fullmatch(r"-{3,}", lines[i].strip()):
            buf.append(lines[i].strip())
            i += 1
        if buf:
            out.append(f"<p>{inline(' '.join(buf), chapters)}</p>")
        else:
            i += 1

    return "\n".join(out)


def render_flow(lines, chapter_id, chapters):
    return render("\n".join(lines), chapter_id, chapters)


# ------------------------------------------------------------------ shell ----
# Palette is the PorchFest brand, not an invention: navy #101D3A, flag red
# #B02A30, cream #F5F1E6, warm stone neutrals. Dark mode swaps flag red for
# flag-bright #E35A55, because true flag red fails contrast on navy — the same
# rule the site and docs/brand-guide.html follow.

STYLE = """
<meta charset="utf-8" />
<style>
:root{
  --ground:#F5F1E6; --surface:#FFFCF2; --raised:#EFE9D8;
  --ink:#101D3A; --ink-soft:#55608A; --ink-faint:#7C8099;
  --flag:#B02A30; --flag-soft:#F0DEDA;
  --rule:#DCD5C0; --code-bg:#EBE4D1;
  --shadow:0 1px 2px rgba(16,29,58,.06);
}
:root:not([data-theme="light"]){ color-scheme:light; }
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    color-scheme:dark;
    --ground:#0C1730; --surface:#132145; --raised:#1B2C57;
    --ink:#F2EEE2; --ink-soft:#B9C1DC; --ink-faint:#8A93B4;
    --flag:#E97B74; --flag-soft:#3A1D22;
    --rule:#2A3A66; --code-bg:#081128;
    --shadow:0 1px 2px rgba(0,0,0,.35);
  }
}
:root[data-theme="dark"]{
  color-scheme:dark;
  --ground:#0C1730; --surface:#132145; --raised:#1B2C57;
  --ink:#F2EEE2; --ink-soft:#B9C1DC; --ink-faint:#8A93B4;
  --flag:#E97B74; --flag-soft:#3A1D22;
  --rule:#2A3A66; --code-bg:#081128;
  --shadow:0 1px 2px rgba(0,0,0,.35);
}

*{box-sizing:border-box;}
body{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:16px; line-height:1.65; -webkit-font-smoothing:antialiased;
}
@media (prefers-reduced-motion:reduce){ *{transition-duration:.01ms !important; scroll-behavior:auto !important;} }
html{scroll-behavior:smooth;}

.wrap{max-width:1180px; margin:0 auto; padding:0 24px; display:grid; gap:48px;
      grid-template-columns:224px minmax(0,1fr); align-items:start;}
@media (max-width:900px){ .wrap{grid-template-columns:minmax(0,1fr); gap:0;} }

/* ---- masthead ---- */
.mast{border-bottom:2px solid var(--ink); background:var(--surface);}
.mast-in{max-width:1180px; margin:0 auto; padding:40px 24px 28px;}
.eyebrow{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:600; font-size:12px;
  letter-spacing:.18em; text-transform:uppercase; color:var(--flag); margin:0 0 10px;}
h1.title{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:700;
  font-size:clamp(34px,6vw,56px); line-height:1.02; letter-spacing:-.01em;
  text-transform:uppercase; margin:0; text-wrap:balance;}
.standfirst{margin:14px 0 0; max-width:60ch; color:var(--ink-soft); font-size:17px;}

/* ---- chapter rail ---- */
nav.rail{position:sticky; top:24px; padding:32px 0; font-size:13.5px;}
@media (max-width:900px){ nav.rail{position:static; padding:24px 0 0; border-bottom:1px solid var(--rule);} }
nav.rail h2{font-family:Oswald,"Arial Narrow",sans-serif; font-size:11px; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase; color:var(--ink-faint); margin:0 0 12px;}
nav.rail ol{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:2px;}
nav.rail a{display:grid; grid-template-columns:26px 1fr; gap:6px; padding:5px 8px;
  border-radius:4px; text-decoration:none; color:var(--ink-soft); border-left:2px solid transparent;}
nav.rail a:hover{background:var(--raised); color:var(--ink);}
nav.rail a .n{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:600; color:var(--flag);
  font-variant-numeric:tabular-nums;}

/* ---- content ---- */
main{padding:32px 0 96px; min-width:0;}
.chapter{padding-top:28px;}
.chapter + .chapter{margin-top:56px; border-top:1px solid var(--rule);}
.chapter > .ch-head{display:flex; align-items:baseline; gap:12px; margin:0 0 4px;}
.ch-num{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:700; font-size:13px;
  letter-spacing:.14em; color:var(--flag); font-variant-numeric:tabular-nums;}
h2.ch-title{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:700;
  font-size:clamp(26px,3.4vw,36px); text-transform:uppercase; letter-spacing:-.005em;
  margin:0 0 20px; line-height:1.08; text-wrap:balance;}

main h2:not(.ch-title){font-family:Oswald,"Arial Narrow",sans-serif; font-weight:600;
  font-size:23px; text-transform:uppercase; letter-spacing:.01em;
  margin:38px 0 12px; padding-bottom:6px; border-bottom:1px solid var(--rule); text-wrap:balance;}
main h3{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:600; font-size:18px;
  margin:28px 0 8px; text-wrap:balance;}
main h4{font-size:15px; font-weight:700; margin:20px 0 6px; color:var(--ink-soft);}
main p, main li{max-width:70ch;}
main p{margin:0 0 14px;}
main ul, main ol{margin:0 0 16px; padding-left:22px; display:flex; flex-direction:column; gap:7px;}
li.task{list-style:none; margin-left:-22px; display:flex; gap:9px; align-items:flex-start;}
li.task input{margin-top:5px;}
hr{border:0; border-top:1px solid var(--rule); margin:34px 0;}
a{color:var(--flag); text-underline-offset:2px;}
a:focus-visible, nav.rail a:focus-visible{outline:2px solid var(--flag); outline-offset:2px; border-radius:3px;}
strong{font-weight:700;}

.anchor{opacity:0; text-decoration:none; margin-left:-16px; padding-right:6px;
  color:var(--ink-faint); font-weight:400;}
h2:hover .anchor, h3:hover .anchor, h4:hover .anchor, .anchor:focus{opacity:1;}

code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.875em;
  background:var(--code-bg); padding:.1em .35em; border-radius:3px; word-break:break-word;}
pre{background:var(--code-bg); border:1px solid var(--rule); border-left:3px solid var(--flag);
  border-radius:4px; padding:13px 15px; overflow-x:auto; margin:0 0 18px;}
pre code{background:none; padding:0; font-size:13px; line-height:1.55;}

blockquote{margin:0 0 18px; padding:13px 16px; background:var(--flag-soft);
  border-left:3px solid var(--flag); border-radius:0 4px 4px 0;}
blockquote p:last-child, blockquote ul:last-child, blockquote ol:last-child{margin-bottom:0;}
blockquote p{max-width:66ch;}

.scroll{overflow-x:auto; margin:0 0 20px; border:1px solid var(--rule);
  border-radius:5px; background:var(--surface); box-shadow:var(--shadow);}
table{border-collapse:collapse; width:100%; font-size:14.5px;}
th,td{text-align:left; padding:9px 13px; border-bottom:1px solid var(--rule); vertical-align:top;}
th{font-family:Oswald,"Arial Narrow",sans-serif; font-weight:600; font-size:12px;
  letter-spacing:.09em; text-transform:uppercase; color:var(--ink-soft);
  background:var(--raised); white-space:nowrap;}
tbody tr:last-child td{border-bottom:0;}
td code{white-space:nowrap;}

details{border:1px solid var(--rule); border-radius:5px; padding:11px 15px;
  margin:0 0 18px; background:var(--surface);}
summary{cursor:pointer; font-weight:600; font-family:Oswald,"Arial Narrow",sans-serif;
  letter-spacing:.02em;}
details[open] summary{margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid var(--rule);}

footer{border-top:2px solid var(--ink); background:var(--surface); padding:26px 0 40px;}
footer .fin{max-width:1180px; margin:0 auto; padding:0 24px; color:var(--ink-soft); font-size:14px;}
footer code{font-size:13px;}
</style>
"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com" />'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Oswald:wght@500;600;700&display=swap" />')


def build():
    files = sorted(p for p in SRC.glob("*.md") if p.name != "README.md")
    if not files:
        sys.exit(f"no chapter markdown found in {SRC}")

    chapters = {p.stem: f"ch{p.stem[:2]}" for p in files}
    chapters["README"] = "top"

    index_md = (SRC / "README.md").read_text()
    # The index's chapter table duplicates the rail; keep only its prose.
    index_md = re.sub(r"\n\| # \| Chapter \|.*?\n\n", "\n\n", index_md, flags=re.S)
    index_md = re.sub(r"\*\*Start here.*?\*\*\n", "", index_md)

    rail, body = [], []
    body.append(f'<section class="chapter" id="top">'
                f'{render(index_md, "top", chapters)}</section>')

    for p in files:
        cid = chapters[p.stem]
        raw = p.read_text()
        m = re.match(r"^#\s+(\d+)\s+—\s+(.*)$", raw.split("\n")[0])
        num, title = (m.group(1), m.group(2)) if m else (p.stem[:2], p.stem)
        rail.append(f'<li><a href="#{cid}"><span class="n">{num}</span>'
                    f"<span>{html.escape(title)}</span></a></li>")
        body.append(
            f'<section class="chapter" id="{cid}">'
            f'<div class="ch-head"><span class="ch-num">CHAPTER {num}</span></div>'
            f'<h2 class="ch-title">{html.escape(title)}</h2>'
            f"{render(raw, cid, chapters)}</section>")

    return f"""<title>PorchFest Organizer's Playbook</title>
{FONTS}{STYLE}
<header class="mast"><div class="mast-in">
  <p class="eyebrow">Senoia PorchFest &middot; Internal reference</p>
  <h1 class="title">The Organizer's Playbook</h1>
  <p class="standfirst">How the festival gets built each year — the website, the
  volunteer system, the ticketing, and every piece of print artwork. Written so
  next year's planners can pick it up cold.</p>
</div></header>
<div class="wrap">
  <nav class="rail" aria-label="Chapters">
    <h2>Contents</h2>
    <ol><li><a href="#top"><span class="n">00</span><span>Start here</span></a></li>
    {''.join(rail)}</ol>
  </nav>
  <main>{''.join(body)}</main>
</div>
<footer><div class="fin">
  Generated from <code>docs/playbook/*.md</code> in
  <code>jermdw/porchfest</code> by <code>scripts/build-playbook-html.py</code>.
  The markdown is the source of truth — edit there, then regenerate.
</div></footer>
"""


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("-o", "--out", default="docs/playbook.html")
    a = ap.parse_args()
    out = pathlib.Path(a.out)
    out.write_text(build())
    print(f"wrote {out} ({out.stat().st_size:,} bytes)")
