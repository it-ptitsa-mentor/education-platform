# Theory Full Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переписать все 420 уроков теории в `content/theory/` в режиме **rewrite-light** (свои формулировки, без Hexlet/чужих брендов, почерк Hexlet сохранён), не ломая связку теория → квиз → практика.

**Architecture:** Git — SSOT для теории; `FROZEN_MODULES` блокирует перезапись из Buildin; волны по модулям, внутри модуля — PR-батчи по темам; AI черновик → человеческое ревью → `check-theory-lesson.py` → `generate:course-content`. Медиа (Codepen, IMG) — отдельный эпик P2.

**Tech Stack:** Markdown + YAML frontmatter, Python (`import-buildin-theory.py`, `check-theory-lesson.py`, `build-course-model.py`), pnpm (`generate:course-content`, `watch:course-theory`), CI `ci.yml`.

**Spec:** `docs/superpowers/specs/2026-06-24-theory-m1-rewrite-design.md` (расширить scope на все модули).

**Phase detail docs:** (готовы — см. таблицу ниже)

| Phase | Doc |
|-------|-----|
| 0 — Инфраструктура | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-0.md` |
| 1 — Модуль 1 | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-1-m1.md` |
| 2 — Модуль 2 | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-2-m2.md` |
| 3 — Модуль 3 | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-3-m3.md` |
| 4 — Модули 4–5 | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-4-m4-m5.md` |
| 5 — Модуль 6 + медиа | `docs/superpowers/plans/2026-06-24-theory-rewrite-phase-5-m6-media.md` |

---

## Inventory

| Module | Lessons | Topics | Hexlet mentions (approx.) |
|--------|---------|--------|---------------------------|
| `01-modul-1` | 53 | 5 | часть файлов |
| `02-modul-2` | 119 | 6 | ~высокая доля |
| `03-modul-3` | 72 | 7 | |
| `04-modul-4` | 65 | 5 | |
| `05-modul-5` | 41 | 2 | |
| `06-modul-6` | 70 | 3 | |
| **Total** | **420** | **28** | ~163 файла с `hexlet`, ~66 `codepen.io/hexlet` |

**Rewrite mode:** `rewrite-light` only (см. согласованный тон на пилоте CSS после отката тяжёлой версии).

**Out of scope:** roadmap/classroom project rename; смена slug/title в `course.json`; полный шаблон ЦУ (author-full).

---

## Phase 0 — Infrastructure (gate before content work)

**Deliverable:** можно безопасно править теорию в git без затирания импортом; единый гайд; трекинг; CI на переписанные файлы.

См. детали: [`2026-06-24-theory-rewrite-phase-0.md`](./2026-06-24-theory-rewrite-phase-0.md).

### Task 0.1: Writing guide

**Files:**
- Create: `docs/theory-writing-guide.md`

- [ ] Описать `rewrite-light` vs `author-full`
- [ ] DoD чеклист (термины, hexlet, квиз, frontmatter)
- [ ] 2–3 примера «до/после» (фрагменты из `05-osnovy-css.md`)
- [ ] Промпт-шаблон для AI (вставить в гайд или `docs/prompts/theory-rewrite-light.md`)

### Task 0.2: Extend freeze policy

**Files:**
- Modify: `scripts/import-buildin-theory.py` — `FROZEN_MODULES` по мере волн
- Modify: `AGENTS.md` §4 / §8
- Test: manual — запуск импорта не меняет frozen tree

- [ ] **Волна 1:** только `01-modul-1` (уже есть)
- [ ] **Перед М2:** добавить `02-modul-2` в `FROZEN_MODULES`
- [ ] Документировать порядок расширения freeze в `AGENTS.md`

### Task 0.3: Inventory script (optional but recommended)

**Files:**
- Create: `scripts/theory-rewrite-inventory.py`

- [ ] Отчёт: module/topic/lesson, `hexlet`, codepen, `<!-- IMG -->`, `source: platform`, word count
- [ ] Вывод: `content/theory/REWRITE_STATUS.json` или markdown table

### Task 0.4: Tracking SSOT

**Files:**
- Create: `content/theory/REWRITE_STATUS.md` (или JSON)

- [ ] Колонки: path, status (`todo|draft|review|done`), reviewer, date
- [ ] Инициализировать все 420 путей как `todo`

### Task 0.5: CI gate (phase 2)

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `scripts/check-theory-lesson.py` (если нужно `--fail-on-any-hexlet-in-module`)

- [ ] Job: для файлов с `source: platform` — fail on hexlet patterns
- [ ] Опционально: fail if `rewritten_at` missing when `source: platform`

### Task 0.6: Pilot topic gate (M1)

**Files:** вся тема `01-modul-1/01-osnovy-sovremennoy-verstki/` (12 уроков)

- [ ] Переписать 12 уроков rewrite-light (не запускать до утверждения Phase 0)
- [ ] Spot-check: 3 случайных урока — квиз вручную
- [ ] Merge topic PR → эталон процесса для волн 1–5

**Phase 0 exit criteria:** гайд + трекинг + CI + эталонная тема М1 (12 уроков) в `main`.

---

## Phase 1 — Module 1 (53 lessons, 5 PRs)

**Branch:** `content/theory-m1-rewrite` (или продолжить существующую)

| PR | Topic | Lessons |
|----|-------|---------|
| 1.1 | `01-osnovy-sovremennoy-verstki` | 12 (эталон Phase 0) |
| 1.2 | `02-verstka-kontenta` | 17 |
| 1.3 | `03-css-pozicionirovanie-elementov` | 8 |
| 1.4 | `04-css-flex` | 9 |
| 1.5 | `05-css-verstka-na-grid` | 7 |

**Per-lesson workflow:** см. spec § Per-lesson workflow.

- [ ] После каждого PR: `python3 scripts/build-course-model.py`, `pnpm generate:course-content`, `pnpm test && pnpm test:feature`
- [ ] `rg -i hexlet content/theory/01-modul-1` → 0 в `done` файлах
- [ ] Обновить `REWRITE_STATUS` для темы

**Effort:** ~15–25 h human review.

**Phase 1 exit:** М1 полностью `source: platform`, ноль hexlet, merged to `main`.

Детали: `phase-1-m1.md`.

---

## Phase 2 — Module 2 (119 lessons, ~6–8 PRs)

**Pre-requisite:** `FROZEN_MODULES` += `02-modul-2`

| Topic | Lessons | Suggested PR |
|-------|---------|--------------|
| `01-osnovy-javascript` | 39 | split 2 PR (20+19) |
| `02-js-massivy` | 22 | 1–2 PR |
| `03-js-obekty` | 13 | 1 PR |
| `04-osnovy-komandnoy-stroki` | 19 | 1–2 PR |
| `05-vvedenie-v-git` | 15 | 1 PR |
| `06-js-nastroyka-okruzheniya` | 11 | 1 PR |

**Notes:** крупнейший модуль; тема JS basics — батчить по 15 уроков max.

**Effort:** ~35–50 h review.

Детали: `phase-2-m2.md`.

---

## Phase 3 — Module 3 (72 lessons)

**Pre-requisite:** freeze `03-modul-3`

7 topics, 4–7 PR по размеру темы.

Детали: `phase-3-m3.md`.

---

## Phase 4 — Modules 4 + 5 (106 lessons)

**Pre-requisite:** freeze `04-modul-4`, `05-modul-5`

М4: 5 topics (65). М5: React (30) + RTK (11) — 2 модуля можно в одной волне календарно, отдельные PR.

Детали: `phase-4-m4-m5.md`.

---

## Phase 5 — Module 6 + Media epic (70 lessons + assets)

**Pre-requisite:** freeze `06-modul-6`

3 topics TS/polymorphism. Медиа P2 параллельно или после текстовой волны.

Детали: `phase-5-m6-media.md`.

---

## Per-lesson checklist (all phases)

- [ ] Rewrite-light: перефраз, структура и код сохранены
- [ ] Нет `hexlet`, `hexlet.io`, `codepen.io/hexlet`
- [ ] Бренды → IT Птица / нейтрально (Курсовик и т.д.)
- [ ] `title` в frontmatter **не менять**
- [ ] Path/slug не менять
- [ ] `buildin_id` сохранить
- [ ] Добавить: `source: platform`, `rewritten_at`, `reviewed_by`
- [ ] `python3 scripts/check-theory-lesson.py <file>`
- [ ] Квиз/практика: термины согласованы (выборочно — полный проход на 1 урок/тему)

---

## Verification commands

```bash
# один файл
python3 scripts/check-theory-lesson.py content/theory/01-modul-1/.../lesson.md

# весь переписанный модуль
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten

# остатки бренда
rg -i hexlet content/theory/01-modul-1

# пайплайн
python3 scripts/build-course-model.py
pnpm generate:course-content
pnpm test && pnpm test:feature

# локальный просмотр
pnpm dev:web
pnpm watch:course-theory   # в отдельном терминале
```

---

## Timeline (indicative)

| Phase | Calendar | Parallel work |
|-------|----------|---------------|
| 0 | 1–2 weeks | infra only |
| 1 | 2–4 weeks | — |
| 2 | 4–8 weeks | — |
| 3 | 3–5 weeks | — |
| 4 | 4–6 weeks | — |
| 5 | 3–5 weeks | media P2 |
| **Total** | **~4–6 months** part-time | 1 module active |

---

## Risks (program-level)

| Risk | Mitigation |
|------|------------|
| Buildin re-import | Freeze before each wave |
| Quiz drift | DoD + sample quiz per topic |
| Review bottleneck | Cap 10–15 lessons/week; AI draft only |
| Legal similarity | rewrite-light; external sample after M1 |
| PR #6 heavy rewrite | Do not merge; use reverted CSS tone |
| Images broken | P2 epic; keep `<!-- IMG -->` in wave 1–5 |

---

## Next action (human)

1. Approve this plan + Phase 0 scope.
2. Sub-agents fill phase detail docs (in progress).
3. Execute Phase 0 tasks (no mass rewrite until 0.6 gate defined).
4. Start M1 topic 1 batch only after Phase 0 green.
