# Phase 2 orchestration — M2 rewrite (119 lessons)

**Repo:** `/home/alice/Documents/education-platform`  
**Branch:** `content/theory-rewrite` (same wave as M1 until PR split)  
**Prerequisite:** Phase 1 committed; `FROZEN_MODULES` includes `02-modul-2`

## Agent roles

| ID | Role | Topic | Lessons | Files | Status |
|----|------|-------|---------|-------|--------|
| **R5** | Rewriter — JS basics (1/2) | `01-osnovy-javascript` | 20 | `01`–`20` | blocked (usage limit) |
| **R6** | Rewriter — JS basics (2/2) | `01-osnovy-javascript` | 19 | `21`–`39` | done |
| **R7** | Rewriter — массивы | `02-js-massivy` | 22 | all | blocked (usage limit) |
| **R8** | Rewriter — объекты | `03-js-obekty` | 13 | all | blocked (usage limit) |
| **R9** | Rewriter — CLI | `04-osnovy-komandnoy-stroki` | 19 | all | blocked (usage limit) |
| **R10** | Rewriter — Git | `05-vvedenie-v-git` | 15 | all | done |
| **R11** | Rewriter — окружение | `06-js-nastroyka-okruzheniya` | 11 | all | blocked (usage limit) |
| **Q** | QA (parent) | all M2 rewritten | 119 | — | after R5–R11 |

## Rewrite rules (all agents)

1. Read `docs/theory-writing-guide.md` + `docs/prompts/theory-rewrite-light.md`
2. Etalon style: `content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/05-osnovy-css.md`
3. Per file: rewrite-light → `source: platform`, `rewritten_at: 2026-06-24`, `reviewed_by:` empty
4. Keep `title`, `buildin_id`, headings order, **code blocks unchanged** (logic, commands, flags)
5. Remove hexlet/Курсовик; MDN / nodejs.org / git-scm.com for external links
6. **M2 sacred:** bash/git commands, `console.log`, npm/node version numbers, exercise wording
7. `python3 scripts/check-theory-lesson.py <file>` must pass
8. Update `content/theory/REWRITE_STATUS.md`: matching row → `done`

## QA gate (parent)

```bash
python3 scripts/check-theory-lesson.py --module 02-modul-2 --only-rewritten
rg -i hexlet content/theory/02-modul-2
rg -i курсовик content/theory/02-modul-2
python3 scripts/build-course-model.py && pnpm generate:course-content
pnpm test && pnpm test:feature
```

## PR split (after all done)

| PR | Topic | Agent |
|----|-------|-------|
| 2.1 | `01-osnovy-javascript` 01–20 | R5 |
| 2.2 | `01-osnovy-javascript` 21–39 | R6 |
| 2.3 | `02-js-massivy` | R7 |
| 2.4 | `03-js-obekty` | R8 |
| 2.5 | `04-osnovy-komandnoy-stroki` | R9 |
| 2.6 | `05-vvedenie-v-git` | R10 |
| 2.7 | `06-js-nastroyka-okruzheniya` | R11 |
