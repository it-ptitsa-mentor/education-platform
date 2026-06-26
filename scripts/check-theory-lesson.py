#!/usr/bin/env python3
"""
Проверка переписанных уроков теории: запрещённые упоминания Hexlet и обязательные поля frontmatter.

Примеры:
  python3 scripts/check-theory-lesson.py content/theory/01-modul-1/.../05-osnovy-css.md
  python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THEORY = ROOT / "content" / "theory"

FORBIDDEN = (
    (re.compile(r"hexlet", re.I), "упоминание hexlet"),
    (re.compile(r"codepen\.io/hexlet", re.I), "codepen.io/hexlet"),
    (re.compile(r"hexlet\.io", re.I), "hexlet.io"),
)


def lesson_files(module_slug: str | None) -> list[Path]:
    base = THEORY / module_slug if module_slug else THEORY
    if not base.is_dir():
        raise SystemExit(f"нет каталога: {base}")
    return sorted(base.rglob("*.md"))


def prose_without_fenced_code(text: str) -> str:
    """Проверяем hexlet только вне блоков кода — импорты npm в ``` оставляем."""
    parts = re.split(r"^```.*?^```", text, flags=re.M | re.S)
    return "\n".join(parts)


def check_file(path: Path, *, only_rewritten: bool) -> list[str]:
    text = path.read_text(encoding="utf-8")
    if only_rewritten and not re.search(r"^source:\s*platform\s*$", text, re.M):
        return []

    prose = prose_without_fenced_code(text)
    errors: list[str] = []
    for pattern, label in FORBIDDEN:
        if pattern.search(prose):
            errors.append(f"{path.relative_to(ROOT)}: {label}")

    if re.search(r"^source:\s*platform\s*$", text, re.M):
        if not re.search(r"^rewritten_at:\s*.+", text, re.M):
            errors.append(f"{path.relative_to(ROOT)}: source: platform без rewritten_at")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Проверка уроков теории после rewrite")
    parser.add_argument("paths", nargs="*", help="Файлы .md (если пусто — смотри --module)")
    parser.add_argument("--module", help="Слаг модуля, напр. 01-modul-1")
    parser.add_argument(
        "--only-rewritten",
        action="store_true",
        help="Проверять только файлы с source: platform",
    )
    args = parser.parse_args()

    if args.paths:
        files = [Path(p) for p in args.paths]
    elif args.module:
        files = lesson_files(args.module)
    else:
        parser.error("укажи файлы или --module")

    all_errors: list[str] = []
    checked = 0
    for path in files:
        if not path.is_file():
            all_errors.append(f"{path}: файл не найден")
            continue
        errs = check_file(path, only_rewritten=args.only_rewritten)
        if errs or not args.only_rewritten or re.search(
            r"^source:\s*platform\s*$", path.read_text(encoding="utf-8"), re.M
        ):
            checked += 1
        all_errors.extend(errs)

    if all_errors:
        print("\n".join(all_errors), file=sys.stderr)
        return 1

    print(f"OK: проверено файлов — {checked}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
