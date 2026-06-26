# Phase 5 — Module 6 + Media epic (70 lessons + assets)

**Prerequisite:** Phase 4 merged.

**Freeze:** `06-modul-6` in `FROZEN_MODULES`.

**Effort text:** ~25–35 h review | **Media P2:** 20–40 h separate

---

## Module 6 text rewrite (70 lessons)

| Topic | Lessons | PRs |
|-------|---------|-----|
| `01-js-polimorfizm` | 15 | 1 |
| `02-osnovy-typescript` | 34 | **2–3** (1–12, 13–24, 25–34) |
| `03-prodvinutyy-typescript` | 21 | 2 (10+11) |

**Branch:** `content/theory-m6-rewrite` (~5–6 PR)

### M6 pitfalls

- **TS syntax** — типы в code fences exact (`interface`, `type`, generics)
- **Polymorphism patterns** — имена паттернов (Strategy, State) для квизов
- **Сравнение с JS** — не удалять блоки «в JS было / в TS»

---

## Media epic P2 (parallel from Phase 2+)

**Scope:** ~66 `codepen.io/hexlet`, `<!-- IMG -->` placeholders, embedded screenshots.

### Tasks

| ID | Task | Output |
|----|------|--------|
| M-P2-1 | Inventory all media refs | `content/theory/MEDIA_INVENTORY.json` |
| M-P2-2 | Policy: own Codepen account / static in `packages/web/public/course/media/` | ADR in docs |
| M-P2-3 | Replace hexlet pens (batch by module) | PRs `content/media-mN` |
| M-P2-4 | Re-host or re-shoot critical screenshots | asset PRs |
| M-P2-5 | CI: optional fail on `codepen.io/hexlet` in `done` lessons | extend check script |

### Can media run parallel to M4/M5?

**Yes**, отдельным потоком:

- Текстовый rewrite **не блокируется** — можно оставить старый pen URL с TODO до P2
- Или заменить на `<!-- IMG: was codepen ... -->` в том же PR (discouraged — ломает preview)

**Recommendation:** текстовые волны 1–5 first; media batch по модулю **после** текст `done` для модуля.

### Legal

- Не копировать скриншоты/пены Hexlet — свои примеры или MDN
- Сохранять `buildin_id` для трассировки источника

---

## Program exit (all 420 + media)

- [ ] All lessons: `source: platform`, `reviewed_by` set
- [ ] `rg -i hexlet content/theory` → 0
- [ ] `rg codepen.io/hexlet content/theory` → 0 (after P2)
- [ ] `REWRITE_STATUS`: 420 × `done`
- [ ] Spot legal review: 10 random lessons external read
- [ ] Feature test: sample lesson theory → quiz path (1 per module)
- [ ] `AGENTS.md`: all modules in FROZEN_MODULES, Buildin import doc updated

---

## Paths

```
content/theory/06-modul-6/01-js-polimorfizm/
content/theory/06-modul-6/02-osnovy-typescript/
content/theory/06-modul-6/03-prodvinutyy-typescript/
```

```bash
find content/theory/06-modul-6 -name '*.md' | sort
rg -l 'codepen\.io/hexlet' content/theory | wc -l
```
