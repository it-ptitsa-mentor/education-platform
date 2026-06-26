# Phase 2 — Module 2 (119 lessons)

**Prerequisite:** Phase 1 merged; Phase 0 artifacts exist.

**Before first edit:**

```python
# scripts/import-buildin-theory.py
FROZEN_MODULES = {"01-modul-1", "02-modul-2"}
```

Update `AGENTS.md` + run import smoke test.

**Branch:** `content/theory-m2-rewrite`

**Exit:** `02-modul-2` fully rewritten, no hexlet in done files.

**Effort:** ~35–50 h review

---

## Topics

| Topic | Lessons | PR strategy |
|-------|---------|-------------|
| `01-osnovy-javascript` | 39 | **2 PR:** 01–20, 21–39 |
| `02-js-massivy` | 22 | 1–2 PR (12+10) |
| `03-js-obekty` | 13 | 1 PR |
| `04-osnovy-komandnoy-stroki` | 19 | 1–2 PR |
| `05-vvedenie-v-git` | 15 | 1 PR |
| `06-js-nastroyka-okruzheniya` | 11 | 1 PR |

**Total PRs:** ~8–10

**Rule:** ≤15 lessons per PR.

---

## Base path

```
content/theory/02-modul-2/<topic-slug>/<NN>-<lesson-slug>.md
```

Enumerate:

```bash
find content/theory/02-modul-2 -name '*.md' | sort
```

---

## M2-specific notes

- **Длинные блоки кода** — не рефакторить логику, только комментарии/обёртка текста
- **Node/npm версии** — не обновлять цифры без проверки практики
- **Терминал/bash** — команды не менять (квизы и практика)
- **Git** — имена команд и флаги sacred
- **console.log / =>** — оставить как в оригинале

---

## Quiz alignment

М2 = модуль 2 в `course.json` (`modules[1]`). Для каждой темы после PR:

- 1 урок с квизом: пройти квиз после чтения theory
- 1 урок с практикой: убедиться что wording в theory не противоречит `exercise.json`

---

## Timeline

| Weeks | PRs |
|-------|-----|
| 1–2 | JS basics 1/2 + 2/2 |
| 3 | massivy |
| 4 | obekty + CLI part 1 |
| 5 | CLI part 2 + git |
| 6 | okruzhenie + audit |

---

## Exit

```bash
rg -i hexlet content/theory/02-modul-2
python3 scripts/check-theory-lesson.py --module 02-modul-2 --only-rewritten
```
