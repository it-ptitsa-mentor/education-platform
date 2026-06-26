# Phase 1 — Module 1 (53 lessons)

**Prerequisite:** Phase 0 complete (guide, CI, topic 1 = эталон или merge вместе с PR 1.1).

**Branch:** `content/theory-m1-rewrite`

**Exit:** весь `content/theory/01-modul-1/` — `source: platform`, `rg -i hexlet` → 0 matches.

**Effort:** ~15–25 h human review (~20–30 min/lesson)

---

## PR plan

| PR | Topic slug | Lessons | Suggested title |
|----|------------|---------|-----------------|
| 1.1 | `01-osnovy-sovremennoy-verstki` | 12 | `content(theory): rewrite M1 topic — основы верстки` |
| 1.2 | `02-verstka-kontenta` | 17 | `content(theory): rewrite M1 topic — верстка контента` |
| 1.3 | `03-css-pozicionirovanie-elementov` | 8 | `content(theory): rewrite M1 topic — позиционирование` |
| 1.4 | `04-css-flex` | 9 | `content(theory): rewrite M1 topic — flex` |
| 1.5 | `05-css-verstka-na-grid` | 7 | `content(theory): rewrite M1 topic — grid` |

**Max parallel:** 1 PR open at a time (review focus).

---

## Per-PR workflow

1. AI batch: все `.md` темы → rewrite-light
2. Author pass: 10–20 min × N уроков
3. `python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten`
4. `rg -i hexlet content/theory/01-modul-1/<topic>/`
5. `python3 scripts/build-course-model.py && pnpm generate:course-content`
6. Spot-check: 2 урока + их квизы (см. ниже)
7. `pnpm test && pnpm test:feature`
8. Update `REWRITE_STATUS.md` → `done` for topic
9. Open PR → merge after green CI

---

## Quiz spot-check (course.json)

Для урока с индексом `i` (1-based) в теме:

1. Открыть `content/course.json` → `modules[0].topics[t].lessons[i-1]`
2. Поля: `theory`, `quiz`, `exercise`
3. В UI: `/learn/01-modul-1/<topic-slug>/<i>/theory` затем quiz tab
4. **Правило:** вопросы квиза должны находить ответ в переписанном тексте (термины не переименовывать)

Пример урок 5 CSS:

- theory: `.../05-osnovy-css.md`
- URL: `http://localhost:5175/learn/01-modul-1/01-osnovy-sovremennoy-verstki/5/theory`

---

## M1-specific pitfalls

| Issue | Action |
|-------|--------|
| `codepen.io/hexlet` | Заменить ссылку на нейтральный pen или оставить URL + TODO P2 |
| `<!-- IMG -->` | Не удалять; media epic позже |
| Курсовик | → IT Птица |
| DevTools скриншоты с чужим UI | Текст перефразировать; картинки P2 |
| Два урока «Введение» в одной теме | Не сливать; только light rewrite |

---

## Week schedule (10–15 lessons/week)

| Week | Deliverable |
|------|-------------|
| W0 | Phase 0 + PR 1.1 (12) |
| W1 | PR 1.2 (17) |
| W2 | PR 1.3 (8) + PR 1.4 (9) |
| W3 | PR 1.5 (7) + full M1 audit |

---

## All 53 paths (glob)

```
content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/*.md   (12)
content/theory/01-modul-1/02-verstka-kontenta/*.md             (17)
content/theory/01-modul-1/03-css-pozicionirovanie-elementov/*.md (8)
content/theory/01-modul-1/04-css-flex/*.md                     (9)
content/theory/01-modul-1/05-css-verstka-na-grid/*.md          (7)
```

List:

```bash
find content/theory/01-modul-1 -name '*.md' | sort
```

---

## Exit verification

```bash
rg -i hexlet content/theory/01-modul-1          # expect: no matches
rg -i курсовик content/theory/01-modul-1
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
grep -c 'status: done' content/theory/REWRITE_STATUS.md  # expect 53 for M1 rows
```
