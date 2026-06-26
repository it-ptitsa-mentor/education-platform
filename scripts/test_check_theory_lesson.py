#!/usr/bin/env python3
"""Tests for scripts/check-theory-lesson.py (forbidden mentions, --only-rewritten)."""
from __future__ import annotations

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts" / "check-theory-lesson.py"
FIXTURE_ROOT = ROOT / "scripts" / ".test-tmp" / "check-theory-lesson"


def load_checker():
    spec = importlib.util.spec_from_file_location("check_theory_lesson", SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {SCRIPT}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


GOOD_FRONTMATTER = """---
title: "Test"
source: platform
rewritten_at: 2026-06-24
---

# Body
"""


class TestCheckFile(unittest.TestCase):
    def setUp(self) -> None:
        self.checker = load_checker()
        FIXTURE_ROOT.mkdir(parents=True, exist_ok=True)
        self.dir = Path(tempfile.mkdtemp(dir=FIXTURE_ROOT))
        self.addCleanup(shutil.rmtree, self.dir, ignore_errors=True)

    def write(self, name: str, body: str) -> Path:
        path = self.dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
        return path

    def test_clean_rewritten_lesson_passes(self) -> None:
        path = self.write("ok.md", GOOD_FRONTMATTER + "Нейтральный текст.\n")
        self.assertEqual(self.checker.check_file(path, only_rewritten=False), [])
        self.assertEqual(self.checker.check_file(path, only_rewritten=True), [])

    def test_detects_hexlet_mention(self) -> None:
        path = self.write(
            "bad.md",
            GOOD_FRONTMATTER + "Курс от Hexlet помогает.\n",
        )
        errors = self.checker.check_file(path, only_rewritten=False)
        self.assertTrue(any("hexlet" in e for e in errors))

    def test_detects_codepen_hexlet_url(self) -> None:
        path = self.write(
            "bad.md",
            GOOD_FRONTMATTER + "https://codepen.io/hexlet/pen/abc\n",
        )
        errors = self.checker.check_file(path, only_rewritten=False)
        self.assertTrue(any("codepen.io/hexlet" in e for e in errors))

    def test_detects_hexlet_io_domain(self) -> None:
        path = self.write(
            "bad.md",
            GOOD_FRONTMATTER + "См. https://hexlet.io/courses\n",
        )
        errors = self.checker.check_file(path, only_rewritten=False)
        self.assertTrue(any("hexlet.io" in e for e in errors))

    def test_platform_without_rewritten_at_fails(self) -> None:
        path = self.write(
            "bad.md",
            """---
title: "Test"
source: platform
---

# Body
""",
        )
        errors = self.checker.check_file(path, only_rewritten=False)
        self.assertTrue(any("rewritten_at" in e for e in errors))

    def test_only_rewritten_skips_non_platform_files(self) -> None:
        path = self.write(
            "legacy.md",
            """---
title: "Legacy"
---

Упоминание hexlet должно быть проигнорировано.
""",
        )
        self.assertEqual(self.checker.check_file(path, only_rewritten=True), [])

    def test_only_rewritten_checks_platform_files(self) -> None:
        path = self.write(
            "rewritten.md",
            """---
title: "Test"
source: platform
rewritten_at: 2026-06-24
---

hexlet
""",
        )
        errors = self.checker.check_file(path, only_rewritten=True)
        self.assertTrue(errors)


class TestMainCli(unittest.TestCase):
    def setUp(self) -> None:
        FIXTURE_ROOT.mkdir(parents=True, exist_ok=True)
        self.dir = Path(tempfile.mkdtemp(dir=FIXTURE_ROOT))
        self.addCleanup(shutil.rmtree, self.dir, ignore_errors=True)

    def write(self, name: str, body: str) -> Path:
        path = self.dir / name
        path.write_text(body, encoding="utf-8")
        return path

    def run_script(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )

    def test_cli_exits_1_on_forbidden_content(self) -> None:
        path = self.write(
            "lesson.md",
            GOOD_FRONTMATTER + "hexlet\n",
        )
        result = self.run_script(str(path))
        self.assertEqual(result.returncode, 1)
        self.assertIn("hexlet", result.stderr.lower())

    def test_cli_only_rewritten_ignores_legacy_hexlet(self) -> None:
        legacy = self.write(
            "legacy.md",
            "---\ntitle: x\n---\nhexlet\n",
        )
        good = self.write(
            "good.md",
            GOOD_FRONTMATTER + "чистый текст\n",
        )
        result = self.run_script(str(legacy), str(good), "--only-rewritten")
        self.assertEqual(result.returncode, 0, msg=result.stderr)


if __name__ == "__main__":
    unittest.main()
