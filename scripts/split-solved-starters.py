#!/usr/bin/env python3
"""Split user-solved starters: BEGIN/END content -> __solution__, starter emptied.

Usage: split-solutions.py <exercisesRoot> <slug> [<slug> ...]
"""
import json
import os
import re
import sys

JS_RE = re.compile(
    r"(//\s*BEGIN[^\n]*\n)(.*?)(\n?[ \t]*//\s*END)", re.S,
)
HTML_RE = re.compile(
    r"(<!--\s*BEGIN[^\n]*-->\n)(.*?)(\n?[ \t]*<!--\s*END\s*-->)", re.S,
)

def split(content):
    for rx in (JS_RE, HTML_RE):
        m = rx.search(content)
        if m:
            body = m.group(2)
            emptied = content[: m.start(2)].rstrip("\n") + "\n\n" + content[m.end(2):].lstrip("\n")
            return body.strip("\n"), emptied, True
    return None, content, False

root = sys.argv[1]
for slug in sys.argv[2:]:
    exdir = os.path.join(root, slug)
    manifest = json.load(open(os.path.join(exdir, "exercise.json")))
    for rel in manifest["studentFiles"]:
        p = os.path.join(exdir, rel)
        if not os.path.exists(p):
            print(f"{slug}: MISSING starter {rel}")
            continue
        content = open(p).read()
        body, emptied, found = split(content)
        if not found:
            print(f"{slug}: {rel}: no BEGIN/END markers")
            continue
        if not body:
            print(f"{slug}: {rel}: empty (pristine starter)")
            continue
        sol = os.path.join(exdir, "__solution__", rel)
        os.makedirs(os.path.dirname(sol), exist_ok=True)
        open(sol, "w").write(content)  # solution = full file with filled block
        open(p, "w").write(emptied)
        print(f"{slug}: {rel}: solution extracted ({len(body)} chars), starter emptied")
