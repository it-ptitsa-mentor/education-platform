#!/usr/bin/env python3
"""
Инвентарь уроков теории: hexlet, codepen, IMG, frontmatter, статус rewrite.

Примеры:
  python3 scripts/theory-rewrite-inventory.py --module 01-modul-1
  python3 scripts/theory-rewrite-inventory.py --format json
  python3 scripts/theory-rewrite-inventory.py --init-status
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THEORY = ROOT / "content" / "theory"
STATUS_FILE = THEORY / "REWRITE_STATUS.md"

HEXLET = re.compile(r"hexlet", re.I)
CODEPEN_HEXLET = re.compile(r"codepen\.io/hexlet", re.I)
IMG = re.compile(r"<!--\s*IMG")
SOURCE_PLATFORM = re.compile(r"^source:\s*platform\s*$", re.M)
REWRITTEN_AT = re.compile(r"^rewritten_at:\s*(.+)$", re.M)
TITLE = re.compile(r'^title:\s*["\']?(.+?)["\']?\s*$', re.M)


@dataclass
class LessonRow:
    path: str
    module: str
    topic: str
    lesson_slug: str
    title: str
    words: int
    has_hexlet: bool
    has_codepen_hexlet: bool
    has_img_placeholder: bool
    source_platform: bool
    rewritten_at: str | None
    status: str


def parse_status_table() -> dict[str, str]:
    """path -> status from REWRITE_STATUS.md"""
    if not STATUS_FILE.is_file():
        return {}
    text = STATUS_FILE.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for line in text.splitlines():
        if not line.startswith("| `content/theory/"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 4:
            continue
        path = parts[1].strip("`")
        status = parts[3] if len(parts) > 3 else "todo"
        out[path] = status
    return out


def lesson_files(module_slug: str | None) -> list[Path]:
    base = THEORY / module_slug if module_slug else THEORY
    if not base.is_dir():
        raise SystemExit(f"нет каталога: {base}")
    return sorted(base.rglob("*.md"))


def row_for(path: Path, status_map: dict[str, str]) -> LessonRow:
    rel = path.relative_to(ROOT).as_posix()
    parts = path.relative_to(THEORY).parts
    module = parts[0] if parts else ""
    topic = parts[1] if len(parts) > 1 else ""
    lesson_slug = path.stem
    text = path.read_text(encoding="utf-8")
    words = len(text.split())
    m_title = TITLE.search(text)
    m_rew = REWRITTEN_AT.search(text)
    return LessonRow(
        path=rel,
        module=module,
        topic=topic,
        lesson_slug=lesson_slug,
        title=m_title.group(1) if m_title else "",
        words=words,
        has_hexlet=bool(HEXLET.search(text)),
        has_codepen_hexlet=bool(CODEPEN_HEXLET.search(text)),
        has_img_placeholder=bool(IMG.search(text)),
        source_platform=bool(SOURCE_PLATFORM.search(text)),
        rewritten_at=m_rew.group(1).strip() if m_rew else None,
        status=status_map.get(rel, "todo"),
    )


def format_md(rows: list[LessonRow]) -> str:
    lines = [
        "# Theory rewrite inventory",
        "",
        f"Всего уроков: **{len(rows)}**",
        "",
        "| path | module | topic | words | hexlet | codepen | IMG | platform | status |",
        "|------|--------|-------|------:|--------|---------|-----|----------|--------|",
    ]
    for r in rows:
        lines.append(
            f"| `{r.path}` | {r.module} | {r.topic} | {r.words} | "
            f"{'yes' if r.has_hexlet else ''} | "
            f"{'yes' if r.has_codepen_hexlet else ''} | "
            f"{'yes' if r.has_img_placeholder else ''} | "
            f"{'yes' if r.source_platform else ''} | {r.status} |"
        )
    return "\n".join(lines) + "\n"


def init_status_file(rows: list[LessonRow]) -> None:
    header = """# Статус переписки теории

| path | module | topic | status | reviewer | date |
|------|--------|-------|--------|----------|------|
"""
    body_lines = []
    for r in rows:
        body_lines.append(
            f"| `{r.path}` | {r.module} | {r.topic} | {r.status} | | |"
        )
    STATUS_FILE.write_text(header + "\n".join(body_lines) + "\n", encoding="utf-8")
    print(f"Записано {len(rows)} строк в {STATUS_FILE.relative_to(ROOT)}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Инвентарь теории для rewrite")
    parser.add_argument("--module", help="Слаг модуля, напр. 01-modul-1")
    parser.add_argument("--format", choices=("md", "json"), default="md")
    parser.add_argument(
        "--init-status",
        action="store_true",
        help="Создать/перезаписать content/theory/REWRITE_STATUS.md (все todo, кроме source: platform → done)",
    )
    args = parser.parse_args()

    status_map = parse_status_table()
    files = lesson_files(args.module)
    rows = [row_for(p, status_map) for p in files if p.name != "REWRITE_STATUS.md"]

    if args.init_status:
        for r in rows:
            if r.source_platform and r.status == "todo":
                r.status = "done"
        init_status_file(rows)
        return 0

    if args.format == "json":
        print(json.dumps([asdict(r) for r in rows], ensure_ascii=False, indent=2))
    else:
        print(format_md(rows), end="")

    hexlet_n = sum(1 for r in rows if r.has_hexlet)
    platform_n = sum(1 for r in rows if r.source_platform)
    print(
        f"\n# summary: lessons={len(rows)} hexlet_files={hexlet_n} platform={platform_n}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
