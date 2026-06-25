# Theory rewrite pilot — Module 1 (CSS/HTML)

**Date:** 2026-06-24  
**Status:** In progress — branch `content/theory-rewrite`, PR отдельно от UX  
**Scope:** Переписать теорию Модуля 1 своими словами; проекты roadmap не трогаем

## Goal

Опубликовать на платформе **оригинальный по формулировкам и бренду** текст теории для М1 (~53 урока), без следов Hexlet, **не ломая** связку теория → квиз → практика. Пилот отрабатывает процесс; М2–М6 и rebrand проектов — отдельные итерации.

## Decisions (from brainstorm)

| Topic | Decision |
|-------|----------|
| Driver | Юридика/этика + голос IT Птица |
| Volume | Пилот: **Модуль 1** only (53 lessons) |
| SSOT | **Git** `content/theory/` в `education-platform` |
| Process | AI draft → human review per lesson |
| Done criteria | Свой текст, no Hexlet, pedagogy matches quiz/exercise |
| Projects | Out of scope |
| Pipeline approach | **A:** freeze M1 in Buildin import (`FROZEN_MODULES`) |

## Module 1 inventory

| Topic slug | Title | Lessons |
|------------|-------|---------|
| `01-osnovy-sovremennoy-verstki` | Основы современной верстки | 12 |
| `02-verstka-kontenta` | Верстка контента | 17 |
| `03-css-pozicionirovanie-elementov` | CSS: позиционирование | 8 |
| `04-css-flex` | CSS: Flex | 9 |
| `05-css-verstka-na-grid` | CSS: Grid | 7 |

**Total:** 53 markdown files under `content/theory/01-modul-1/`.

## Architecture

### Content flow (after pilot)

```
Buildin import  ──► content/theory/  (M2–M6 only; overwrites)
                         ▲
Human + AI edit  ────────┘ (M1 frozen — git is SSOT)

build-course-model.py  ──► content/course.json
generate:course-content ──► packages/web/public/course/
web SPA  ──► /learn/.../theory
```

### Import freeze (approach A)

- Extend `scripts/import-buildin-theory.py` with `FROZEN_MODULES = ["01-modul-1"]`.
- For frozen modules: skip write if target `.md` already exists (or always skip entire module tree).
- Update `AGENTS.md` §4: M1 edits only in git; Buildin is archive for M1.

### Lesson frontmatter (after rewrite)

```yaml
---
title: "..."           # unchanged — course.json matching
module: "Модуль 1"
topic: "..."
buildin_id: "..."      # traceability
source: platform
rewritten_at: 2026-06-24
reviewed_by: ilia
---
```

**Do not change:** file path, slug, `title` in frontmatter, manifest lesson order.

## Per-lesson workflow

1. Pick lesson from current topic batch.
2. AI draft from existing `.md` + brief (goals, keep headings/code structure, replace examples/links).
3. Author review and edit in git.
4. Run quality checks (see Verification).
5. Mark done in tracking (Todoist / PR checklist).

### Definition of Done (checklist)

**Content**

- [ ] Переписано своими словами; нет копипасты Hexlet
- [ ] Нет `hexlet`, `codepen.io/hexlet`, hexlet.io URLs
- [ ] Примеры нейтральные или IT Птица
- [ ] После урока студент может пройти **тот же** quiz и exercise
- [ ] `title` в frontmatter не изменён

**Technical**

- [ ] `source: platform`, `rewritten_at`, `reviewed_by`; `buildin_id` kept
- [ ] Path/slug unchanged
- [ ] `python3 scripts/build-course-model.py` — no regression for lesson linkage
- [ ] `scripts/check-theory-lesson.py` (new) — pass

**Media (soft for pilot)**

- [ ] Hexlet CodePen replaced; `<!-- IMG -->` may stay with TODO

## Rollout phases

1. **Smoke (1 lesson)** — e.g. `01-osnovy-sovremennoy-verstki/05-osnovy-css.md`: validate freeze + pipeline + one lesson end-to-end.
2. **Topic 1** (12 lessons) — full pass.
3. **Topics 2 → 5** in curriculum order — batches or one branch `content/theory-m1-rewrite`.

**Effort estimate:** ~25–45 h author review for full M1 (15–40 min/lesson); AI draft ~5–10 min/lesson.

## Testing and CI

### New automation

| Check | Purpose |
|-------|---------|
| `scripts/check-theory-lesson.py` | Per file or `--module 01-modul-1`: grep hexlet, optional link HEAD |
| CI step (optional phase 2) | Fail PR if rewritten M1 files contain `(?i)hexlet` or `codepen.io/hexlet` |

### Existing gates (must stay green)

```bash
pnpm test
pnpm test:feature
python3 scripts/build-course-model.py
pnpm generate:course-content
```

### Integration boundary test (recommended once)

- Feature test: open one rewritten M1 lesson route → theory renders → quiz/exercise slugs present in `course.json` for that lesson index.

## Branch and PR strategy

- Branch from **`main`**, not `feat/lesson-units` — orthogonal to PR #5/#4.
- Suggested name: `content/theory-m1-rewrite`.
- **Do not merge** until: smoke lesson + topic 1 reviewed; CI green; no accidental import overwrite (manual test: run import script, confirm M1 unchanged).
- Prod stays on `main` until content PR merged separately from UX PRs.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Re-import overwrites M1 | `FROZEN_MODULES` + test in CI or manual checklist |
| `course.json` desync | Never change lesson `title`; run `build-course-model.py` after each batch |
| Still too close to Hexlet legally | Review checklist + spot external plagiarism check on sample lessons |
| Images missing | Keep placeholders; separate asset upload project |
| Scope creep (M2, projects) | Explicit out-of-scope in PR description |

## Out of scope

- Roadmap / Classroom project rename
- Module 2–6 theory
- Buildin as SSOT for M1 after freeze
- Full image re-hosting (pilot)

## Where to verify (operator guide)

### During one lesson rewrite

| What | Where / command |
|------|-----------------|
| Source file | `content/theory/01-modul-1/<topic>/<lesson>.md` |
| Lesson in course model | `content/course.json` → module 1 → topic → lesson → `theory` path |
| Hexlet leftovers | `rg -i hexlet content/theory/01-modul-1/<topic>/` |
| Linkage after edit | `python3 scripts/build-course-model.py` then grep lesson title in `course.json` |
| Local UI | `pnpm dev` → navigate to lesson theory URL from course |
| Unit/feature tests | `pnpm test && pnpm test:feature` |

### After batch (topic or full M1)

| What | Where |
|------|-------|
| All M1 files | `content/theory/01-modul-1/**/*.md` |
| Manifest unchanged structure | `content/theory/manifest.json` (module 1 topics/lesson slugs) |
| Generated static | `pnpm generate:course-content` → `packages/web/public/course/` |
| Import safety | Run `import-buildin-theory.py` — confirm M1 files unchanged (mtime/content) |
| PR | GitHub compare against `main`; CI workflow `ci.yml` |

### Tracking progress

| What | Where |
|------|-------|
| Spec (this doc) | `docs/superpowers/specs/2026-06-24-theory-m1-rewrite-design.md` |
| Agent rules | `AGENTS.md` § theory / Buildin (update when freeze lands) |
| Roadmap tasks (optional) | Todoist project «IT Птица · Роадмап и программа» — add tasks per topic |

## Next step

After user approves this spec → invoke **writing-plans** skill for implementation plan (import freeze, check script, smoke lesson, topic batches).
