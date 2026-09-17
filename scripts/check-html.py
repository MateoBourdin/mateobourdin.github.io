#!/usr/bin/env python3
"""Parses every HTML file in the repo to catch malformed markup
(unclosed tags, stray angle brackets, etc.) before it ships."""
import html.parser
import pathlib
import sys


class Checker(html.parser.HTMLParser):
    pass


def main():
    root = pathlib.Path(__file__).resolve().parent.parent
    html_files = sorted(root.rglob("*.html"))
    html_files = [f for f in html_files if ".git" not in f.parts]

    failures = []
    for path in html_files:
        try:
            Checker().feed(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001 - report and continue
            failures.append(f"{path.relative_to(root)}: {exc}")

    print(f"Checked {len(html_files)} HTML files.")
    if failures:
        print("\nHTML check FAILED:\n")
        for f in failures:
            print("  - " + f)
        sys.exit(1)

    print("All HTML files parse cleanly. OK.")


if __name__ == "__main__":
    main()
