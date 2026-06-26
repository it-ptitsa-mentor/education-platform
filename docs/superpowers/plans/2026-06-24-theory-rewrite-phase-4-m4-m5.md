# Phase 4 — Modules 4 & 5 (106 lessons)

**Prerequisite:** Phase 3 merged.

**Freeze:** `04-modul-4`, `05-modul-5` in `FROZEN_MODULES`.

**Recommendation:** **последовательно** М4 → М5 (один активный модуль). Параллель только если два ревьюера.

**Effort:** ~32–45 h review

---

## Module 4 (65 lessons, 5 topics)

| Topic | Lessons | PRs |
|-------|---------|-----|
| `01-js-asinhronnoe-programmirovanie` | 15 | 1 |
| `02-js-prodvinutoe-testirovanie` | 9 | 1 |
| `03-js-dom-api` | 18 | 2 (9+9) |
| `04-regulyarnye-vyrazheniya-regexp` | 12 | 1 |
| `05-js-arhitektura-frontenda` | 11 | 1 |

**Branch:** `content/theory-m4-rewrite` (~6 PR)

### M4 pitfalls

- **async/Promise** — термины для квизов не трогать
- **DOM** — имена методов (`querySelector`, `addEventListener`) exact
- **regexp** — паттерны в примерах не ломать
- **архитектура** — абстрактные схемы; light rewrite только в prose

---

## Module 5 (41 lessons, 2 topics)

| Topic | Lessons | PRs |
|-------|---------|-----|
| `01-js-react` | 30 | 2 (15+15) |
| `02-react-redux-toolkit` | 11 | 1 |

**Branch:** `content/theory-m5-rewrite` (~3 PR)

### M5 pitfalls

- **React API** — `useState`, `useEffect`, JSX — stable names
- **Redux/RTK** — slice, reducer, dispatch — match quiz wording
- **Create React App / Vite** — не менять стек без sync с exercises

---

## Paths

```
content/theory/04-modul-4/
content/theory/05-modul-5/
```

---

## Timeline

| Block | Weeks |
|-------|-------|
| M4 all | 4–5 |
| M5 all | 2–3 |

---

## Exit

```bash
rg -i hexlet content/theory/04-modul-4 content/theory/05-modul-5
python3 scripts/check-theory-lesson.py --module 04-modul-4 --only-rewritten
python3 scripts/check-theory-lesson.py --module 05-modul-5 --only-rewritten
```
