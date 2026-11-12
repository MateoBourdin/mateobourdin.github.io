#!/usr/bin/env python3
"""Met à jour la date « Dernière mise à jour » affichée en bas de toutes les pages.

Usage : python3 scripts/set-updated-date.py 2026-11-12
Sans argument, utilise la date du jour.
"""
import datetime, pathlib, re, sys

MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
        "septembre", "octobre", "novembre", "décembre"]
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"]

d = datetime.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.date.today()
fr = f"{d.day} {MOIS[d.month - 1]} {d.year}"
en = f"{d.day} {MONTHS[d.month - 1]} {d.year}"
root = pathlib.Path(__file__).resolve().parent.parent

def sub(path, pattern, repl, expected=None):
    text = path.read_text(encoding="utf-8")
    new, n = re.subn(pattern, repl, text)
    if expected is not None and n != expected:
        sys.exit(f"{path.name}: {n} remplacement(s) au lieu de {expected}")
    path.write_text(new, encoding="utf-8")
    return n

# Pages principales : texte de repli FR dans le HTML, vraies chaînes dans translations.js
for page in sorted(root.glob("*.html")):
    sub(page, r'(data-i18n="footer\.updated">)[^<]*(<)', rf"\g<1>Dernière mise à jour : {fr}\g<2>")
for f in (root / "translations.js", root / "contact.html"):  # contact.html a ses propres traductions
    sub(f, r"(updated: ')Dernière mise à jour : [^']*(')", rf"\g<1>Dernière mise à jour : {fr}\g<2>", 1)
    sub(f, r"(updated: ')Last updated: [^']*(')", rf"\g<1>Last updated: {en}\g<2>", 1)

# Pages projet : pied de page bilingue
for page in sorted((root / "projects").glob("*.html")):
    sub(page, r'(<span class="mini-updated">)[^<]*(</span>)', rf"\g<1>Mis à jour le {fr} · Updated {en}\g<2>")

print(f"Date de mise à jour : {fr} / {en}")
