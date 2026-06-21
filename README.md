# education-platform

Платформа IT Птица Mentor — JS-тренажёры с Monaco-редактором и общим runner'ом (вариант 2: без evaluator-кластера как у Hexlet).

**Сайт (GitHub Pages):** https://it-ptitsa-mentor.github.io/education-platform/

## Стек

| Слой | Технологии |
|------|------------|
| Web | React, Vite, Monaco Editor, `monaco-jsx-syntax-highlight` |
| API | Fastify (локально / свой сервер) |
| Runner | Vitest в изолированной temp-директории |
| GitHub Pages | статика + проверка в браузере (`VITE_STATIC_API=true`) |
| Упражнения | `exercises/{slug}/` + `exercise.json` (SSOT) |

## Быстрый старт

```bash
pnpm install
pnpm dev:api    # http://127.0.0.1:4100
pnpm dev:web    # http://127.0.0.1:5175
```

Или оба сразу: `pnpm dev`

В режиме `pnpm dev` кнопка **RUN TESTS** шлёт код на API → Vitest запускает `__tests__/` упражнения в temp-директории.

## Деплой — GitHub Pages

Репозиторий **публичный**. При push в `main` workflow `.github/workflows/deploy-pages.yml`:

1. `pnpm install`
2. `pnpm generate:static-exercises` — собирает `exercises-data.ts` (в git не коммитится)
3. `pnpm --filter @ptitsa/web build` с `VITE_BASE_PATH=/education-platform/` и `VITE_STATIC_API=true`
4. публикует `packages/web/dist` на GitHub Pages

На Pages нет отдельного API: упражнения и кнопка **Проверить** работают через `runBrowserExerciseCheck` в браузере.

### Свой сервер (позже education.*)

```bash
VITE_BASE_PATH=/ VITE_API_BASE_URL= pnpm --filter @ptitsa/web build
NODE_ENV=production pnpm --filter @ptitsa/api start:prod
```

---

## Тесты — обзор

Платформа проверяет решения **двумя независимыми путями**. Оба должны быть зелёными перед релизом.

| Режим | Команда / триггер | Что проверяет |
|-------|-------------------|---------------|
| **Unit** | `pnpm test` | manifest, генератор тестов, browser-check helpers, runner, quiz-check, стартеры из readme |
| **Feature** | `pnpm test:feature` | API inject, multi-file POST, browser-check на реальном упражнении, smoke сгенерированных `__tests__` |
| **Локально в UI** | `pnpm dev` → RUN TESTS | Vitest по `exercises/{slug}/__tests__/` |
| **GitHub Pages** | push в `main` | `runBrowserExerciseCheck` по kind из manifest (слабее Vitest, но без сервера) |
| **Регенерация** | `pnpm generate:exercise-tests` | перезаписывает `__tests__/exercise.test.js` или `solution.test.js` |
| **Статика** | `pnpm generate:static-exercises` | `packages/web/src/generated/exercises-data.ts` для Pages |

```bash
pnpm test                  # 54 unit-теста
pnpm test:feature          # 13 feature-тестов (API + runner + browser-check)
pnpm generate:exercise-tests   # ~352 автотеста, ~18 skip (свои тесты Hexlet)
pnpm generate:static-exercises # бандл упражнений для Pages
pnpm generate:static-quizzes     # квизы для Pages
```

### Локальный runner (Vitest)

- API (`packages/api`) принимает POST `/api/exercises/:slug/check` с телом `{ files: { "path": "content" } }`.
- **Все** ключи из `exercise.json` → `studentFiles` обязательны; иначе `400 Missing required files`.
- Runner (`packages/runner`) копирует файлы студента + тесты в temp-dir и запускает Vitest.
- Feature-тесты в `packages/api/src/app.feature.test.ts` пересекают границу API ↔ runner (в т.ч. multi-file `js-redux-toolkit-slices`).

### GitHub Pages (browser-check)

Когда `VITE_STATIC_API=true`, web вызывает `runBrowserExerciseCheck` (`packages/shared/src/exercise-checks/browser-exercise-check.ts`):

| Kind | Поведение |
|------|-----------|
| `console` | `eval` + перехват `console.log`, сравнение с ожидаемым выводом |
| `jsx` | regex-проверки JSX/JS по каждому файлу |
| `module` | загрузка ES-модуля (data URL / blob / `new Function` fallback в Node) |
| `html` / `css` | наличие селекторов, тегов, свойств |
| `ts` | непустой TypeScript (полная проверка только локально) |
| `skip` | placeholder «тесты только локально» (18 упражнений, напр. advanced-testing) |
| custom | `js-variables`, `js-basics-variables` и др. в `exercise-checks/` |

Feature-тест `browser-exercise-check.feature.test.ts` гоняет реальный slug `js-redux-toolkit-slices` через browser-check (pass + fail).

### Генератор `generate:exercise-tests`

Скрипт читает `exercise.json` каждого slug и пишет smoke-тесты:

- console output, import smoke, css/html/jsx presence и т.д.
- удаляет устаревшие `placeholder.test.js`
- **не** копирует оригинальные тесты Hexlet — это упрощённые проверки «код хотя бы компилируется / выводит что-то»

После импорта Hexlet: `pnpm import:hexlet-frontend` → `pnpm generate:exercise-tests`.

### Стартовый код из readme

`packages/shared/src/exercise-starter-from-readme.ts` — SSOT логики извлечения кода из readme:

- один блок кода в readme **не** копируется во все файлы multi-file упражнения
- секции привязаны к `files_to_open` / путям файлов
- импорт (`scripts/import-hexlet-frontend.mts`) и unit-тесты (`exercise-starter-from-readme.test.ts`) используют один модуль

---

## UI и редактор (что сделано)

- **Каталог** — карточки фиксированной высоты, логотип в шапке и favicon (`public/logo.png`)
- **Страница упражнения** — readme скроллится отдельно от редактора; ссылки на hexlet.io рендерятся как неактивный текст
- **Multi-file** — вкладки файлов, переключение с flush Monaco; подсветка JSX через `monaco-jsx-syntax-highlight`
- **Валидация API** — POST должен содержать все `studentFiles` из manifest

---

## Квизы (Hexlet)

```bash
# 1. Куки в .hexlet-cookies.json (см. .hexlet-cookies.json.example) — в git не коммитить
# 2. Импорт quiz_unit из программы «Фронтенд-разработчик»
pnpm import:hexlet-quizzes
pnpm generate:static-quizzes
```

Импорт сбрасывает прогресс квиза на Hexlet для каждого урока (`PATCH /api/lessons/:id/reset_quiz`), чтобы вытащить варианты ответов. В UI — раздел **Квизы** (`/quizzes`).

---

## Импорт упражнений Hexlet (Frontend)

```bash
pnpm import:hexlet-frontend
pnpm generate:exercise-tests
pnpm generate:static-exercises
```

Скрипт `scripts/import-hexlet-frontend.mts` тянет каталог через `/api/courses/{id}/lessons`, readme и `files_to_open` с exercise_unit. Стартовый код — через `exercise-starter-from-readme`. Автотесты Hexlet не копируются.

---

## Добавить JS-упражнение вручную

1. `exercises/my-slug/exercise.json` — manifest (SSOT)
2. `solution.js`, `src/…`, `__tests__/`
3. При необходимости — custom browser-check в `packages/shared/src/exercise-checks/`
4. `pnpm generate:static-exercises` — появится в каталоге и на Pages

---

## Ограничения (честно)

- Сгенерированные тесты — в основном smoke, не полный паритет с Hexlet
- На Pages TypeScript и сложные сценарии (Redux, тестирование) проверяются слабее, чем локальный Vitest
- Упражнения с kind `skip` на Pages показывают placeholder; полная проверка только через `pnpm dev` + API
- `packages/web/src/generated/` в `.gitignore` — CI генерирует при каждом деплое

---

## Дизайн

Спека MVP: [docs/superpowers/specs/2026-06-10-js-trainer-design.md](docs/superpowers/specs/2026-06-10-js-trainer-design.md)
