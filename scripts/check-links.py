#!/usr/bin/env python3
"""Checks that every internal link (relative href/src, and #fragment
anchors) in the site actually resolves to a real file and, for
fragments, a real element id in the target page. External (http/https)
links are left to the lychee-action step in CI, which has real network
access; this script only needs the repo on disk."""
import pathlib
import re
import sys
from urllib.parse import urlsplit

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK_ATTR_RE = re.compile(r'\b(?:href|src)="([^"]+)"')
ID_RE = re.compile(r'\bid="([^"]+)"')


def is_external(url: str) -> bool:
    return url.startswith(("http://", "https://", "mailto:", "tel:", "//"))


def target_ids(path: pathlib.Path) -> set:
    return set(ID_RE.findall(path.read_text(encoding="utf-8")))


def main():
    html_files = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    id_cache = {}
    failures = []
    checked = 0

    for path in html_files:
        text = path.read_text(encoding="utf-8")
        for raw_url in LINK_ATTR_RE.findall(text):
            if is_external(raw_url) or raw_url.startswith("data:") or raw_url.startswith("javascript:"):
                continue
            checked += 1
            parts = urlsplit(raw_url)
            file_part, fragment = parts.path, parts.fragment

            if file_part == "":
                target_path = path
            else:
                target_path = (path.parent / file_part).resolve()

            if file_part and not target_path.exists():
                failures.append(f"{path.relative_to(ROOT)}: broken link '{raw_url}' -> {target_path} does not exist")
                continue

            if fragment:
                if target_path not in id_cache:
                    id_cache[target_path] = target_ids(target_path) if target_path.exists() else set()
                if fragment not in id_cache[target_path]:
                    failures.append(
                        f"{path.relative_to(ROOT)}: '{raw_url}' points at fragment #{fragment}, "
                        f"but no id=\"{fragment}\" exists in {target_path.relative_to(ROOT)}"
                    )

    print(f"Checked {checked} internal links across {len(html_files)} HTML files.")
    if failures:
        print("\nLink check FAILED:\n")
        for f in failures:
            print("  - " + f)
        sys.exit(1)

    print("All internal links resolve. OK.")


if __name__ == "__main__":
    main()
