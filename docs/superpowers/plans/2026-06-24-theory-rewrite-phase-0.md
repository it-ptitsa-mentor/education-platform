# Phase 0 — Infrastructure (theory rewrite)

**Goal:** Перед массовой перепиской 420 уроков зафиксировать процесс, гайд, трекинг, CI и эталонную тему М1 (12 уроков).

**Exit criteria:**

- [ ] `docs/theory-writing-guide.md` в репо, согласован с автором
- [ ] `content/theory/REWRITE_STATUS.md` — все 420 уроков в статусе `todo`
- [ ] CI падает на `hexlet` в файлах с `source: platform`
- [ ] `scripts/theory-rewrite-inventory.py` даёт отчёт по модулю
- [ ] Тема `01-osnovy-sovremennoy-verstki` (12 уроков) переписана rewrite-light и влита в `main` как эталон
- [ ] Ручная проверка: re-import Buildin не трогает `01-modul-1`

**Effort:** ~8–16 h (инфра 4–6 h + эталонная тема 6–10 h review)

---

## Task 0.1 — `docs/theory-writing-guide.md`

**Create:** `docs/theory-writing-guide.md`

### Секции документа

1. **Назначение** — для кого (автор, AI, ревьюер)
2. **Два режима**
   - `rewrite-light` — вся текущая программа (420 уроков)
   - `author-full` — новые темы / тестовое ЦУ (не для импорта Buildin)
3. **Правила rewrite-light**
   - Сохранять: порядок `##`, примеры кода, таблицы, `> **Примечание.**`
   - Менять: формулировки (синонимы, порядок слов), бренды, ссылки
   - Не добавлять: блоки «Ситуация», «Зачем сейчас» на каждый подпункт
   - Не менять: `title` frontmatter, путь файла, термины из квиза
4. **Замены брендов**
   - Hexlet → убрать
   - Курсовик → IT Птица / «учебный проект»
   - codepen.io/hexlet → свой pen или `<!-- IMG -->` (эпик P2)
5. **DoD чеклист** (копия из parent plan)
6. **Frontmatter после rewrite**

```yaml
---
title: "..."          # НЕ МЕНЯТЬ
module: "Модуль N"
topic: "..."
buildin_id: "..."     # сохранить
source: platform
rewritten_at: 2026-06-24
reviewed_by: ilia
---
```

7. **Примеры до/после** — 2 абзаца из `05-osnovy-css.md` (утверждённые автором)

---

## Task 0.2 — AI prompt template

**Create:** `docs/prompts/theory-rewrite-light.md`

```markdown
Ты редактор учебных текстов IT Птица. Режим: rewrite-light.

Вход: markdown урока (теория программиста, стиль Hexlet — структурированный лонгрид).

Задача:
1. Перефразируй прозу своими словами (русский). Не копируй предложения дословно.
2. Сохрани все заголовки ##, порядок блоков, код, таблицы, примечания.
3. Убери: hexlet, hexlet.io, codepen.io/hexlet, «Курсовик» → «IT Птица» или нейтрально.
4. Не меняй: title в YAML frontmatter, технические термины (селектор, каскад, flex…).
5. Не добавляй блоки «Ситуация», «Подконцепт N», длинные мотивационные вступления.
6. Ссылки на MDN/docs — оставь или замени на актуальные нейтральные.
7. Добавь/обнови frontmatter: source: platform, rewritten_at: YYYY-MM-DD, reviewed_by: (пусто).

Верни только полный файл markdown.
```

---

## Task 0.3 — Tracking

**Create:** `content/theory/REWRITE_STATUS.md`

Колонки: `path | module | topic | status | reviewer | date`

Статусы: `todo | ai_draft | review | done`

Инициализация (один раз):

```bash
cd /home/alice/Documents/education-platform
find content/theory -name '*.md' | sort | while read f; do
  echo "| \`$f\` | todo | | |"
done >> content/theory/REWRITE_STATUS.md
```

Или скрипт в `theory-rewrite-inventory.py --init-status`.

---

## Task 0.4 — Inventory script

**Create:** `scripts/theory-rewrite-inventory.py`

```text
Usage:
  python3 scripts/theory-rewrite-inventory.py [--module 01-modul-1] [--format md|json]

Columns per file:
  path, module, topic, lesson_slug, words,
  has_hexlet, has_codepen_hexlet, has_img_placeholder,
  source_platform, rewritten_at, status (from REWRITE_STATUS if exists)
```

---

## Task 0.5 — CI

**Modify:** `.github/workflows/ci.yml` — job `theory-rewrite-check` после `test`:

```yaml
  theory-rewrite-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Check rewritten theory for forbidden brands
        run: python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
```

Расширять `--module` по мере волн или один проход:

```bash
python3 scripts/check-theory-lesson.py $(find content/theory -name '*.md') --only-rewritten
```

---

## Task 0.6 — Freeze policy doc

**Modify:** `AGENTS.md` — таблица волн:

| Wave | Module | Add to FROZEN_MODULES when |
|------|--------|---------------------------|
| 1 | 01-modul-1 | done (already) |
| 2 | 02-modul-2 | before M2 PR #1 |
| … | … | … |

**Test:**

```bash
python3 scripts/import-buildin-theory.py   # dry expectation: M1 skipped
diff -qr content/theory/01-modul-1 /tmp/backup-m1   # no changes
```

---

## Task 0.7 — Pilot topic (12 lessons)

**Paths:**

```
content/theory/01-modul-1/01-osnovy-sovremennoy-verstki/01-emmet.md
… 02-kaskadnost-v-css.md
… 03-chrome-devtools.md
… 04-graficheskie-redaktory.md
… 05-osnovy-css.md
… 06-publikaciya-v-internete.md
… 07-blochnaya-model.md
… 08-vvedenie-v-html.md
… 09-vvedenie.md
… 10-redaktory-koda.md
… 11-bazovaya-struktura-html-dokumenta.md
… 12-semanticheskiy-html.md
```

**PR:** `content/theory-m1-topic1` → `main`

**Spot-check quizzes:** для урока N в `course.json` → `lessons[N-1].quiz` slug → открыть квиз в `/app`, 3 случайных урока из 12.

---

## Verification checklist (Phase 0)

```bash
test -f docs/theory-writing-guide.md
test -f docs/prompts/theory-rewrite-light.md
python3 scripts/theory-rewrite-inventory.py --module 01-modul-1
python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten
pnpm test && pnpm test:feature
python3 scripts/build-course-model.py && pnpm generate:course-content
rg -i hexlet content/theory/01-modul-1/01-osnovy-sovremennoy-verstki
```
