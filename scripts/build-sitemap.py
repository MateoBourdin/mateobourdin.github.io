#!/usr/bin/env python3
"""Génère sitemap.xml à partir des pages HTML du site.

- lastmod : date du dernier commit qui a modifié la page (git log), sinon aujourd'hui.
- --check : vérifie seulement que sitemap.xml liste exactement les pages attendues
  (les dates ne sont pas comparées, car un clone superficiel de la CI n'a pas l'historique).
"""
import datetime
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://mateobourdin.github.io/"
SKIP_DIRS = {"vendor", "games", "fonts", "img", "scripts", "tests", "node_modules", ".git", "CV", "cours"}
# Pages hors de ce dépôt mais servies sous le même domaine
EXTRA = [("fianchetto/", 0.7)]


def pages():
    out = []
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in SKIP_DIRS or "/" in rel and rel.split("/")[0] not in {"projects", "revisions"}:
            continue
        if rel in {"404.html", "google*.html"}:
            continue
        out.append(rel)
    return out


def priority(rel):
    if rel == "index.html":
        return 1.0
    if rel.startswith("projects/"):
        return 0.7
    if rel.startswith("revisions/"):
        return 0.5
    if rel in {"mentions-legales.html"}:
        return 0.3
    return 0.8


def lastmod(rel):
    try:
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        d = ""
    return d or datetime.date.today().isoformat()


def loc(rel):
    return BASE if rel == "index.html" else BASE + rel


def build():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for rel in pages():
        lines += ["    <url>", f"        <loc>{loc(rel)}</loc>", f"        <lastmod>{lastmod(rel)}</lastmod>",
                  f"        <priority>{priority(rel):.1f}</priority>", "    </url>"]
    for path, prio in EXTRA:
        lines += ["    <url>", f"        <loc>{BASE + path}</loc>", f"        <priority>{prio:.1f}</priority>", "    </url>"]
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main(argv):
    target = ROOT / "sitemap.xml"
    if "--check" in argv:
        current = set(re.findall(r"<loc>([^<]+)</loc>", target.read_text(encoding="utf-8")))
        expected = {loc(r) for r in pages()} | {BASE + p for p, _ in EXTRA}
        if current != expected:
            print("sitemap.xml n'est pas à jour.")
            print("  manquantes :", sorted(expected - current))
            print("  en trop    :", sorted(current - expected))
            print("Lancez : python3 scripts/build-sitemap.py")
            return 1
        print(f"sitemap.xml est à jour ({len(expected)} URL). OK.")
        return 0
    target.write_text(build(), encoding="utf-8")
    print(f"sitemap.xml écrit ({len(pages()) + len(EXTRA)} URL).")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
