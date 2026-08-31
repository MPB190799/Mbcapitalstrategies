#!/usr/bin/env python3
"""
MB Capital Strategies — Community-Anbindung an die statische Seite.

Setzt idempotent:
  1. Community-Link in die gemeinsame Navigation (assets/js/nav.js, Desktop + Mobil)
  2. Community-Link in die Inline-Navigation von index.html
  3. robots.txt: Sitemap-Eintrag + Disallow für /community/admin
  4. sitemap.xml: Verweis auf die Community-Sitemap (falls Sitemap-Index)

Mehrfach ausführbar — jeder Schritt prüft vorher, ob er schon erledigt ist.
Aufruf aus dem Repo-Wurzelverzeichnis:  python community/patch-site.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANGED, SKIPPED = [], []


def report(path, done, note=""):
    (CHANGED if done else SKIPPED).append(f"{path}{' — ' + note if note else ''}")


# ---------------------------------------------------------------- 1 nav.js
def patch_navjs():
    f = ROOT / "assets" / "js" / "nav.js"
    if not f.exists():
        report("assets/js/nav.js", False, "nicht gefunden")
        return
    s = f.read_text(encoding="utf-8")
    if "/community/" in s:
        report("assets/js/nav.js", False, "Link schon vorhanden")
        return

    before = s
    # Desktop-Navigation: direkt nach dem Blog-Link
    s = s.replace(
        "'<a href=\"/blog/\">Blog</a>' +",
        "'<a href=\"/blog/\">Blog</a>' +\n            "
        "'<a href=\"/community/\">Community</a>' +",
        1)
    # Mobile Navigation
    s = s.replace(
        "'<a href=\"/blog/\">\U0001F4F0 Blog</a>' +",
        "'<a href=\"/blog/\">\U0001F4F0 Blog</a>' +\n          "
        "'<a href=\"/community/\">\U0001F4AC Community</a>' +",
        1)

    if s == before:
        report("assets/js/nav.js", False, "Ankerpunkte nicht gefunden — bitte von Hand einfügen")
        return
    f.write_text(s, encoding="utf-8")
    report("assets/js/nav.js", True, "Desktop + Mobil")


# ------------------------------------------------------------- 2 index.html
def patch_index():
    f = ROOT / "index.html"
    if not f.exists():
        report("index.html", False, "nicht gefunden")
        return
    s = f.read_text(encoding="utf-8")
    if 'href="/community/"' in s:
        report("index.html", False, "Link schon vorhanden")
        return

    anchor = '<a href="/blog/" class="nav-link">Analysen</a>'
    if anchor not in s:
        report("index.html", False, "Nav-Anker nicht gefunden — bitte von Hand einfügen")
        return
    s = s.replace(anchor, anchor + '\n    <a href="/community/" class="nav-link">Community</a>', 1)
    f.write_text(s, encoding="utf-8")
    report("index.html", True)


# ------------------------------------------------------------- 3 robots.txt
def patch_robots():
    f = ROOT / "robots.txt"
    if not f.exists():
        report("robots.txt", False, "nicht gefunden")
        return
    s = f.read_text(encoding="utf-8")
    done = False

    if "/community/admin" not in s:
        s = s.replace("Disallow: /admin/", "Disallow: /admin/\nDisallow: /community/admin", 1)
        done = True
    if "community/sitemap.xml" not in s:
        s = s.rstrip() + "\nSitemap: https://mbcapitalstrategies.com/community/sitemap.xml\n"
        done = True

    if done:
        f.write_text(s, encoding="utf-8")
    report("robots.txt", done, "" if done else "schon eingetragen")


# ------------------------------------------------------------- 4 sitemap.xml
def patch_sitemap():
    f = ROOT / "sitemap.xml"
    if not f.exists():
        report("sitemap.xml", False, "nicht gefunden")
        return
    s = f.read_text(encoding="utf-8")
    if "community/sitemap.xml" in s:
        report("sitemap.xml", False, "schon eingetragen")
        return
    if "<sitemapindex" not in s:
        report("sitemap.xml", False, "kein Sitemap-Index — Eintrag in robots.txt reicht")
        return
    entry = ("  <sitemap><loc>https://mbcapitalstrategies.com/community/sitemap.xml</loc></sitemap>\n"
             "</sitemapindex>")
    s = s.replace("</sitemapindex>", entry, 1)
    f.write_text(s, encoding="utf-8")
    report("sitemap.xml", True)


if __name__ == "__main__":
    if not (ROOT / "index.html").exists():
        sys.exit(f"Repo-Wurzel nicht gefunden (erwartet: {ROOT})")
    patch_navjs()
    patch_index()
    patch_robots()
    patch_sitemap()

    print("\nGeändert:")
    print("\n".join("  + " + c for c in CHANGED) or "  (nichts)")
    print("\nÜbersprungen:")
    print("\n".join("  · " + s for s in SKIPPED) or "  (nichts)")
    print("\nFertig. Danach:  git add -A && git commit && git push")
