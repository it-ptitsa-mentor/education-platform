# AGENTS.md — образовательный портал IT Птица

> Контекст и правила для AI-агента, продолжающего разработку портала.
> Читай целиком перед первым изменением. Этот файл — источник правды по
> устройству проекта; держи его в актуальном состоянии.

---

## 1. Что это

Образовательный портал для учеников менторской программы **IT Птица**
(подготовка фронтенд-разработчиков к трудоустройству). Три части:

1. **Витрина** `/courses` — лендинг программы (маркетинг, лиды).
2. **Тренажёр** `/app` — SPA: курс + 370 практических заданий (Monaco-редактор
   + автопроверка тестами) + квизы.
3. **Курс** (внутри `/app`) — связка **теория → квиз → практика** по урокам.

**Этот репозиторий = SSOT (единый источник правды).** Всё через git: ветка →
PR → CI-гейт (тесты) → авто-деплой при мердже в `main`. Прод напрямую не править.

### Живые адреса
- Прод тренажёр: **https://education.it-ptitsa-mentor.ru/app/**
- Витрина: **https://education.it-ptitsa-mentor.ru/courses** (статика, отдельно от репо)
- Preview-ветка (ручной): **https://education.it-ptitsa-mentor.ru/preview/**
- Демо на GitHub Pages: https://it-ptitsa-mentor.github.io/education-platform/
- GitHub: `it-ptitsa-mentor/education-platform`

---

## 2. Стек и структура

Монорепо на **pnpm workspaces**. Node ≥ 20, pnpm 9.15.

```
packages/
  web/      React + Vite + Monaco-редактор + react-router. Главное приложение.
  api/      Fastify — раннер проверки кода (Vitest). В dev и на «своём сервере».
  runner/   Vitest-проверка решений в temp-директории.
  shared/   Общие типы, генераторы тестов, browser-check (проверка в браузере).
exercises/  370 заданий: exercises/{slug}/exercise.json + файлы + __tests__/
quizzes/    446 квизов: quizzes/{slug}/quiz.json
content/    КОНТЕНТ КУРСА (см. §4):
  theory/   420 уроков теории (markdown), импортированы из Buildin
  course.json   модель курса (связка теория↔квиз↔практика)
scripts/    генераторы и импортёры (.mts через tsx, .py через python3)
.github/workflows/  ci.yml (тесты+деплой), deploy-pages.yml (демо на Pages)
```

### Два режима работы web
- **`VITE_STATIC_API=true`** — нет бэкенда, проверка решений в браузере
  (`runBrowserExerciseCheck`, слабее Vitest). Так собираются Pages, `/app/`, preview.
- **dev** (`pnpm dev`) — поднимает api (Fastify) + web; кнопка RUN TESTS шлёт
  код на api → Vitest гоняет реальные `__tests__/`.

### Базовый путь (`VITE_BASE_PATH`)
SPA знает свой префикс из `import.meta.env.BASE_URL` (react-router `basename`).
- `/app/` — прод (`VITE_BASE_PATH=/app/`)
- `/preview/` — ручной preview
- `/education-platform/` — GitHub Pages

---

## 3. Команды

```bash
pnpm install --frozen-lockfile

# тесты (ОБЯЗАТЕЛЬНЫ перед PR — это CI-гейт)
pnpm test            # unit (54)
pnpm test:feature    # feature (13)

# генерация контента перед сборкой
pnpm generate:static-exercises   # exercises → src/generated/exercises-data.ts
pnpm generate:course-content     # content/course.json + theory → web/public/course/

# сборка web (пример для прода /app/)
VITE_BASE_PATH=/app/ VITE_STATIC_API=true pnpm --filter @ptitsa/web build
# → packages/web/dist

# локальный просмотр (dev с api+раннером)
pnpm dev
```

Скриншот-проверка вёрстки headless-хромом: **рендерит layout не уже ~500px**
(минимум окна), поэтому мобайл <390 честно не снять — проверяй на 500px.

---

## 4. Контент курса и связка (самое важное)

### Источник теории — Buildin
Теория живёт в Buildin: воркспейс `it-ptitsa`, курс **«АйТи Птица. Программа
обучения JS Разработчик»** (page id `2427ffcb-409b-463a-bfc0-01f0be591a9a`).
Структура: курс → **Модуль 1-6** (child_page) → **тема** (child_database,
напр. «CSS: Flex») → **урок** (строка БД, тело = markdown-теория).

Импорт повторяемым скриптом:
```bash
BUILDIN_MCP_TOKEN=... python3 scripts/import-buildin-theory.py
```
Кладёт уроки в `content/theory/<NN-модуль>/<MM-тема>/<KK-урок>.md` + `manifest.json`.

**Замороженные модули (rewrite в git):** в скрипте `FROZEN_MODULES` (сейчас
`01-modul-1`, `02-modul-2`). При ре-импорте эти каталоги бэкапятся и восстанавливаются —
правки теории только в репозитории, не в Buildin. Проверка после rewrite:
`python3 scripts/check-theory-lesson.py --module 01-modul-1 --only-rewritten` (М1 готово),
`--module 02-modul-2 --only-rewritten` (М2 в работе).

**Волны freeze перед перепиской (план 2026-06-24):**

| Волна | Модуль | Уроков | Когда добавить в `FROZEN_MODULES` |
|-------|--------|--------|-----------------------------------|
| 0 (эталон) | `01-modul-1` | 53 | заморожен, rewrite готов |
| 1 | `02-modul-2` | 119 | заморожен, Phase 2 в работе |
| 2 | `03-modul-3` | 72 | после Phase 3 |
| 3 | `04-modul-4` + `05-modul-5` | 88+ | после Phase 4 |
| 4 | `06-modul-6` | 88 | после Phase 5 |

Гайд и трекинг: `docs/theory-writing-guide.md`, `content/theory/REWRITE_STATUS.md`,
`scripts/theory-rewrite-inventory.py`. Промпт AI: `docs/prompts/theory-rewrite-light.md`.

**Гочи Buildin REST** (`https://api.buildin.ai/v1`, заголовок `Authorization: Bearer <token>`):
- Контент блока в `b["data"]`, НЕ в `b[type]` (как было бы в MCP).
- REST НЕ отдаёт `title` у child_page/child_database → резолвить через `GET /databases/{id}`.
- REST дропает Модуль 2 из списка детей курса → id модулей захардкожены в скрипте.
- markdown-эндпоинт REST = 500 → markdown собираем из блоков сами (`blocks_to_md`).
- Иногда 502/500 → ретраи (есть в скрипте).
- Доступ боту выдаётся ПОСТРАНИЧНО (если новый модуль/тема = 403 — попросить
  владельца добавить интеграцию к странице в Buildin: «…» → Connections).
- Картинки = плейсхолдеры `<!-- IMG -->` (URL Buildin временные), перезаливать отдельно.
- Уроки сортируются по числовому префиксу «N.» и префикс срезается (чистое имя
  лучше матчится с заданиями).

### Связка теория ↔ квиз ↔ практика
```bash
python3 scripts/build-course-model.py   # content/theory + exercises + quizzes → content/course.json
```
Джойн на уровне **урока** по `(courseSlug, нормализованный lessonName)`:
- темы теории (manifest) совпадают с `hexlet.courseName` заданий (+ алиасы в `ALIAS`);
- урок теории ↔ задание ↔ квиз по совпадению названия урока с `hexlet.lessonName`.

`content/course.json` = `курс → модуль → тема(course_slug) → урок {theory, quiz, exercise}`.
Сейчас: **420 уроков, 363 с квизом, 332 полных**. 2 темы теория-онли (Настройка
окружения, CI). Покрытие можно растить, улучшая матчинг названий / добавляя ALIAS.

> Любая правка теории/заданий → перегенерировать `course.json` (`build-course-model.py`)
> и контент (`generate:course-content`).

---

## 5. UI приложения (`packages/web/src`)

- `App.tsx` — роуты: `/` = курс, `/learn/:m/:t/:i/{theory|quiz|exercise}` = урок
  (вложенные шаги), `/tasks`, `/quizzes`, `/exercise/:slug`, `/quiz/:slug`.
- `course.ts` — модель курса, ленивые загрузчики, прогресс по шагам
  (`readLessonUnits` / `markUnitDone` / `isLessonComplete`).
- `lesson/` — `LessonLayout` (sidebar + stepper + outlet), шаги `LessonTheoryStep`,
  `LessonQuizStep`, `LessonExerciseStep`.
- `components/QuizRunner.tsx` / `ExerciseRunner.tsx` — квиз и практика (standalone и embedded).
- `pages/CourseHomePage.tsx` — обзор курса (модули→темы→уроки).
- `pages/ExercisePage.tsx` / `components/ExerciseWorkspace.tsx` — рабочее место (Monaco).
- `pages/QuizPage.tsx` — квиз.
- `components/AppShell.tsx` — шапка (лого-гифка, нав Курс/Задачи/Квизы, тема).
- `styles/global.css` — ВСЕ стили. Тема через CSS-переменные:
  `[data-theme="dark"]`/`[data-theme="light"]`. **Бренд: золото `#e8b45a`,
  фон `#0d0d10`, текст `#f4efe5`, шрифты Unbounded (дисплей) + Onest (UI) +
  IBM Plex Mono (код).** Dark-first по умолчанию.

**UI-формат курса:** линейный flow как у Hexlet — дерево слева, урок в оболочке,
кликабельный степпер ① теория → ② квиз → ③ практика; квиз и практика встроены
в шаги (`embedded`), каталоги `/quiz/:slug` и `/exercise/:slug` сохранены.

---

## 6. Деплой, CI/CD, инфраструктура

### Хостинг
Свой сервер (Ubuntu, nginx). Поддомен `education.it-ptitsa-mentor.ru`, SSL
Let's Encrypt (автопродление). Web-root `/var/www/education.it-ptitsa-mentor.ru/`:
- `/courses/` — витрина (статика, отдельно от репо)
- `/app/` — прод тренажёр (деплоится из main)
- `/preview/` — ручной preview ветки
nginx: `/app`, `/preview` — SPA-fallback (`try_files $uri $uri/ /<dir>/index.html`).

### CI/CD (`.github/workflows/ci.yml`)
- **job `test`** на каждый PR и push в main: `pnpm test` + `pnpm test:feature`.
  Обязательный гейт (branch protection на main требует check `test`).
- **job `theory-rewrite-check`**: `check-theory-lesson.py --module 01-modul-1 --only-rewritten`
  + unit-тесты скрипта (запрет hexlet в переписанных уроках).
- **job `deploy`** только при push в main после зелёных тестов:
  generate exercises + course-content → сборка (`base=/app/`, static) →
  rsync на сервер по SSH-ключу (`webfactory/ssh-agent`) → права www-data →
  **уведомление в TG-группу** ботом о смердженном PR.

### GitHub Secrets (значения у владельца, НЕ в репо)
`SSH_DEPLOY_KEY`, `SSH_HOST`, `SSH_USER`, `SSH_KNOWN_HOSTS` (деплой),
`TG_BOT_TOKEN`, `TG_CHAT_ID` (уведомления в группу о мердже).

### Рабочий процесс (соблюдать)
1. Ветка от `main` → изменения → `pnpm test && pnpm test:feature` зелёные.
2. PR в `main`. CI прогонит тесты (гейт). Для визуала — выкатить на `/preview/`.
3. Мердж → авто-деплой на `/app/` + пост в TG-группу.
4. Прод напрямую НЕ трогать. Конвенция коммитов — conventional commits,
   в конце: `Co-Authored-By: <модель> <noreply@anthropic.com>`.

---

## 7. Текущий статус и роадмап

Задачи ведутся в **Todoist**, проект «IT Птица · Роадмап и программа»
(канбан Backlog/Ready/In progress/Review/Done; метки `infra`/`curriculum`,
`for-claude`/`by-claude`). Берём по приоритету `[P0] → [P1] → [P2]`.

**Сделано:** витрина `/courses`; редизайн тренажёра в бренд; CI/CD (тесты-гейт +
авто-деплой + TG); импорт теории из Buildin (6/6 модулей, 420 уроков); модель
курса (связка); MVP линейного курса (обзор + урок).

**Открытые PR:** #3 (теория), #4 (модель + UI курса; включает #3).

**Ближайшее (P1):** встроить квиз/практику в шаги урока; пайплайн рендера/UI
доводка; backend API на сервере (Fastify за nginx `/api`); БД портала (Postgres:
ученики, прогресс, результаты); код-сплиттинг (бандл static-api ~2.6MB).
**Позже (P2):** картинки теории; авто-синхронизация теории; мониторинг; бэкапы;
staging/preview в CI; серверный прогресс; гибрид-доступ (логин ученика).

---

## 8. Принципы

- **SSOT** — настройки/контент в одном месте, передаются, не дублируются.
- **TDD** — на логику/связку/генераторы тест ПЕРЕД кодом; перед claim «готово» —
  `pnpm test` зелёный. Чистый визуал/markdown — без обязательного теста.
- **Интеграции (Buildin, Telegram, SSH-деплой, БД) — покрывать тестом, который
  пересекает границу** (реальный вызов/round-trip), а не только unit на обеих сторонах.
- Контент теории М2–М6 — повторяемо из Buildin (скрипт); не править руками в
  `content/theory` (перетрётся при ре-импорте), правки — в Buildin.
- **Модуль 1** — SSOT в git (`FROZEN_MODULES`); переписываем своими словами,
  см. `docs/superpowers/specs/2026-06-24-theory-m1-rewrite-design.md`.
