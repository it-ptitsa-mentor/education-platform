# Phase 1 orchestration — M1 rewrite ✅ complete

**Repo:** `/home/alice/Documents/education-platform`  
**Done:** all 53 lessons in `01-modul-1` (Phase 0 + R1–R4)  
**Branch target:** `content/theory-m1-rewrite`

## QA results (2026-06-24)

| Check | Result |
|-------|--------|
| `check-theory-lesson.py --module 01-modul-1 --only-rewritten` | 53/53 OK |
| `rg -i hexlet` / `курсовик` in M1 | 0 matches |
| `REWRITE_STATUS.md` M1 rows `done` | 53/53 |
| `build-course-model` + `generate:course-content` | OK |
| `pnpm test` + `pnpm test:feature` | 83 + 13 passed |

**Post-QA fixes:** артефакты bulk-замены `по— это` в `07-spiski.md`, `16-gradienty.md`, `17-fon.md`.

**Deferred (Phase 2 media / editorial):** ~66 CodePen placeholders, нормализация ссылок `codepen.io/pen/ID`, лёгкая вычитка прозы в `02-verstka-kontenta` (много конструкций «X — это Y»).

## Agent roles

| ID | Role | Topic | Lessons | Status |
|----|------|-------|---------|--------|
| **R1** | Rewriter — верстка контента | `02-verstka-kontenta` | 17 | done |
| **R2** | Rewriter — позиционирование | `03-css-pozicionirovanie-elementov` | 8 | done |
| **R3** | Rewriter — flex | `04-css-flex` | 9 | done |
| **R4** | Rewriter — grid | `05-css-verstka-na-grid` | 7 | done |
| **Q** | QA (parent) | all M1 rewritten | 53 | done |

## Rewrite rules (all agents)

1. Read `docs/theory-writing-guide.md` + `docs/prompts/theory-rewrite-light.md`
2. Etalon: `content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/05-osnovy-css.md`
3. Per file: rewrite-light → `source: platform`, `rewritten_at: 2026-06-24`, `reviewed_by:` empty
4. Keep `title`, `buildin_id`, headings order, code blocks
5. Remove hexlet/Курсовик; MDN for external links where needed
6. `python3 scripts/check-theory-lesson.py <file>` must pass
7. Update `content/theory/REWRITE_STATUS.md`: matching row → `done`

## QA gate (parent)

```bash
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
rg -i hexlet content/theory/01-modul-1
rg -i курсовик content/theory/01-modul-1
python3 scripts/build-course-model.py && pnpm generate:course-content
```

## PR split (after all done)

| PR | Topic | Files |
|----|-------|-------|
| 1.1 | 01-osnovy… | done |
| 1.2 | 02-verstka-kontenta | done (R1) |
| 1.3 | 03-css-pozicionirovanie… | done (R2) |
| 1.4 | 04-css-flex | done (R3) |
| 1.5 | 05-css-verstka-na-grid | done (R4) |
