# Phase 1 — Module 1 checklist (53 lessons)

**Branch:** `content/theory-m1-rewrite`  
**Plan:** [2026-06-24-theory-rewrite-phase-1-m1.md](./2026-06-24-theory-rewrite-phase-1-m1.md)  
**Exit:** все `.md` в `content/theory/01-modul-1/` — `source: platform`, `rg -i hexlet` → 0 matches.

**Review rate:** ~20–30 min/lesson (AI draft + author pass)  
**Total estimate:** ~15–25 h (53 × 20–30 min)

---

## Spot-check URL pattern

Для урока с индексом `i` (1-based) в теме:

| What | Pattern |
|------|---------|
| Theory UI | `http://localhost:5175/learn/01-modul-1/<topic-slug>/<i>/theory` |
| Quiz UI | `http://localhost:5175/learn/01-modul-1/<topic-slug>/<i>/quiz` |
| course.json | `modules[0].topics[t].lessons[i-1]` → поля `theory`, `quiz`, `exercise` |

**Per-PR rule:** spot-check **2 урока** + их квизы (термины в квизе должны находиться в переписанном тексте).

**Example (topic 1, lesson 5):**

- File: `content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/05-osnovy-css.md`
- Theory: `http://localhost:5175/learn/01-modul-1/01-osnovy-sovremennoy-verstki/5/theory`
- Quiz: `http://localhost:5175/learn/01-modul-1/01-osnovy-sovremennoy-verstki/5/quiz`

---

## PR 1.1 — `01-osnovy-sovremennoy-verstki` (12 lessons)

**Suggested PR title:** `content(theory): rewrite M1 topic — основы верстки`  
**Est. review:** ~4–6 h

| # | File | Spot-check? |
|---|------|-------------|
| 1 | `01-emmet.md` | |
| 2 | `02-kaskadnost-v-css.md` | |
| 3 | `03-chrome-devtools.md` | |
| 4 | `04-graficheskie-redaktory.md` | |
| 5 | `05-osnovy-css.md` | ✓ (plan example) |
| 6 | `06-publikaciya-v-internete.md` | |
| 7 | `07-blochnaya-model.md` | |
| 8 | `08-vvedenie-v-html.md` | |
| 9 | `09-vvedenie.md` | |
| 10 | `10-redaktory-koda.md` | |
| 11 | `11-bazovaya-struktura-html-dokumenta.md` | |
| 12 | `12-semanticheskiy-html.md` | ✓ (suggested 2nd) |

**Suggested spot-check indices:** `5`, `12`  
**URLs:** `.../01-osnovy-sovremennoy-verstki/5/theory`, `.../12/theory` (+ quiz tabs)

**Per-PR commands:**

```bash
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
rg -i hexlet content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/
python3 scripts/build-course-model.py && pnpm generate:course-content
pnpm test && pnpm test:feature
```

---

## PR 1.2 — `02-verstka-kontenta` (17 lessons)

**Suggested PR title:** `content(theory): rewrite M1 topic — верстка контента`  
**Est. review:** ~6–8.5 h

| # | File | Spot-check? |
|---|------|-------------|
| 1 | `01-shrifty-i-rabota-s-nimi.md` | |
| 2 | `02-formy.md` | |
| 3 | `03-psevdoklassy.md` | |
| 4 | `04-vvedenie.md` | |
| 5 | `05-tablicy.md` | |
| 6 | `06-perepolnenie.md` | |
| 7 | `07-spiski.md` | |
| 8 | `08-selektory.md` | ✓ (suggested 1st) |
| 9 | `09-blochnaya-model-i-css.md` | |
| 10 | `10-kolonki.md` | |
| 11 | `11-edinicy-izmereniya.md` | |
| 12 | `12-stili-teksta.md` | |
| 13 | `13-css-peremennye.md` | |
| 14 | `14-mediaelementy.md` | |
| 15 | `15-psevdoelementy.md` | |
| 16 | `16-gradienty.md` | |
| 17 | `17-fon.md` | ✓ (suggested 2nd) |

**Suggested spot-check indices:** `8`, `17`

---

## PR 1.3 — `03-css-pozicionirovanie-elementov` (8 lessons)

**Suggested PR title:** `content(theory): rewrite M1 topic — позиционирование`  
**Est. review:** ~2.5–4 h

| # | File | Spot-check? |
|---|------|-------------|
| 1 | `01-potok-dokumenta.md` | |
| 2 | `02-fiksirovannoe-pozicionirovanie.md` | |
| 3 | `03-nalozhenie-elementov.md` | |
| 4 | `04-absolyutnoe-pozicionirovanie.md` | ✓ (suggested 1st) |
| 5 | `05-otnositelnoe-i-absolyutnoe-pozicionirovanie.md` | |
| 6 | `06-plavayuschie-elementy.md` | |
| 7 | `07-vvedenie.md` | |
| 8 | `08-otnositelnoe-pozicionirovanie.md` | ✓ (suggested 2nd) |

**Suggested spot-check indices:** `4`, `8`

---

## PR 1.4 — `04-css-flex` (9 lessons)

**Suggested PR title:** `content(theory): rewrite M1 topic — flex`  
**Est. review:** ~3–4.5 h

| # | File | Spot-check? |
|---|------|-------------|
| 1 | `01-svoystva-flex-elementov-gibkost.md` | |
| 2 | `02-fleks-konteyner.md` | |
| 3 | `03-perenos-elementov-v-konteynere.md` | |
| 4 | `04-vyravnivanie-elementov-po-glavnoy-osi.md` | |
| 5 | `05-svoystva-flex-elementov-gibkost-flex-grow.md` | ✓ (suggested 1st) |
| 6 | `06-vyravnivanie-elementov-po-poperechnoy-osi.md` | |
| 7 | `07-chto-takoe-flex.md` | |
| 8 | `08-svoystva-flex-elementov-raspolozhenie.md` | |
| 9 | `09-vvedenie.md` | ✓ (suggested 2nd) |

**Suggested spot-check indices:** `5`, `9`

---

## PR 1.5 — `05-css-verstka-na-grid` (7 lessons)

**Suggested PR title:** `content(theory): rewrite M1 topic — grid`  
**Est. review:** ~2–3.5 h

| # | File | Spot-check? |
|---|------|-------------|
| 1 | `01-neyavnaya-setka.md` | |
| 2 | `02-vvedenie.md` | |
| 3 | `03-pozicionirovanie-i-grid.md` | |
| 4 | `04-raspolozhenie-elementov-v-setke.md` | ✓ (suggested 1st) |
| 5 | `05-pervaya-setka.md` | |
| 6 | `06-terminologiya.md` | |
| 7 | `07-rabota-s-setkoy.md` | ✓ (suggested 2nd) |

**Suggested spot-check indices:** `4`, `7`

---

## Module exit verification

```bash
rg -i hexlet content/theory/01-modul-1
rg -i курсовик content/theory/01-modul-1
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
grep -c 'status: done' content/theory/REWRITE_STATUS.md   # expect 53 for M1 rows
```

---

## Summary

| PR | Topic slug | Lessons | Est. hours |
|----|------------|---------|------------|
| 1.1 | `01-osnovy-sovremennoy-verstki` | 12 | 4–6 |
| 1.2 | `02-verstka-kontenta` | 17 | 6–8.5 |
| 1.3 | `03-css-pozicionirovanie-elementov` | 8 | 2.5–4 |
| 1.4 | `04-css-flex` | 9 | 3–4.5 |
| 1.5 | `05-css-verstka-na-grid` | 7 | 2–3.5 |
| **Total** | | **53** | **~15–25** |
