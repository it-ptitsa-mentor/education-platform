# Тесты заданий — импорт оригинальных тестов Hexlet (runbook для агента)

Этот документ — самодостаточная инструкция для агента (Opus), который берёт задачи
из Todoist и доводит курсы Фазы 1 до `validated`, переиспользуя **оригинальные тесты
Hexlet** вместо самописных.

## TL;DR цикла по одному курсу

```bash
# 1. вытащить оригинальные файлы (стартеры, фикстуры, тесты) из контейнеров Hexlet
pnpm import:hexlet-files --course <courseSlug>

# 2. для каждого задания написать эталон в exercises/<slug>/__solution__/<studentFile>
#    (см. раздел «Как писать эталон»)

# 3. валидировать батч
pnpm validate:exercise-tests --slug <slug1> --slug <slug2> ...

# 4. когда все validated — полный прогон (регенерирует exercises/TESTS_STATUS.md)
pnpm validate:exercise-tests

# 5. commit + PR + merge (см. «Git-процесс»), затем синк в Todoist
```

Инвариант валидации: тест **проходит на `__solution__/`** и **падает на стартере** →
`validated`. `solution-fails` — сломан эталон или тест (или не хватает alias/зависимости).
`starter-passes` — тест слишком слабый ИЛИ задание типа «наберите код» (для typed-заданий
TS это часто легитимно, см. ниже).

## Как работает импортёр

`scripts/import-hexlet-exercise-files.mts` (`pnpm import:hexlet-files`):

- Требует живую сессию в `.hexlet-cookies.json` (в корне репо, в `.gitignore`).
  Если куки протухли — залогиниться на ru.hexlet.io и обновить файл (массив
  `{name,value}`). Признак протухания: страница отдаёт редирект/не-Inertia HTML.
- Для каждого задания: открывает `sourceUrl` (exercise_unit), парсит Inertia-пейлоад,
  берёт `run.ide_url` — адрес контейнера-евалуатора с socket.io-сервером.
- Говорит с ним по engine.io v4 (long-polling, без зависимостей): `fs.loadFileTree`,
  `fs.loadDirectory`, `fs.openFiles` — тянет все файлы задания с содержимым.
- Раскладывает:
  - `exercises/<slug>/__hexlet__/` — сырое зеркало ВСЕХ файлов (аудит; раннер его
    **исключает** из прогона, как и `__solution__`).
  - `files_to_open` → стартеры (перезаписываются оригиналами, вид `// BEGIN … // END`).
  - `__tests__/*` → **адаптированный** тест (см. ниже).
  - остальное (`index.html`, `__fixtures__/*`, provided `src/*`) → как есть.
- Флаги: `--slug <slug>` (одно задание), `--course <courseSlug>` (весь курс),
  без флагов — весь `catalog.json`. Контейнер бывает холодным (404 на первый запрос) —
  импортёр ретраит подключение до ~40 c.

### Что делает адаптация теста (`adaptTest`)

Оригинальные тесты Hexlet написаны на **vitest**, но рассчитаны на их окружение.
Адаптер приводит их к нашему temp-раннеру:

1. Префикс `// @vitest-environment jsdom`, если тест трогает DOM (`document`, `window`,
   `testing-library`, `screen`).
2. Шим `__dirname` (в ESM его нет): вставляет вычисление через `import.meta.url`.
3. Удаляет side-effect импорты `@testing-library/jest-dom` и `@testing-library/jest-dom/vitest`
   — матчеры (`toHaveClass`, `toBeInTheDocument`, …) регистрируются глобально в
   `packages/runner/vitest.exercise.setup.ts`.

Оригинал остаётся в `__hexlet__/__tests__/` для сверки.

## Инфраструктура раннера (уже настроена)

`packages/runner/vitest.exercise.config.ts`:
- `resolve.alias` — **белый список npm-пакетов**, доступных коду задания и тестам из
  temp-каталога (bare-импорты оттуда иначе не резолвятся). Уже включены: axios, es-toolkit,
  escape-goat, i18next, jquery, lodash, msw + msw/node, yup, @testing-library/dom,
  @testing-library/user-event, @testing-library/jest-dom (+ /matchers). **Если новый курс
  тянет ещё пакет — установить `pnpm add -D -w <pkg>` и добавить в этот alias** (для ESM-пакетов,
  где `require.resolve` даёт CJS-вариант, ломающий vite, указывай `.mjs`-файл напрямую —
  см. как сделано для jest-dom).
- `test.globals: true` — тесты Hexlet часто используют глобальные `test`/`expect`/`describe`
  без импорта.
- `test.setupFiles` — регистрирует jest-dom матчеры.

`packages/runner/src/run-exercise.ts`:
- Копирует задание в temp-каталог, исключая `exercise.json`, `vitest.config.js`,
  `__solution__`, `__hexlet__`.
- Запускает vitest с `--root <workDir>`, **cwd = workDir** (важно: тесты, читающие фикстуру
  относительным путём `path.join('__fixtures__','index.html')`, полагаются на это).

## Как писать эталон (`__solution__/`)

- Путь: `exercises/<slug>/__solution__/<в точности путь studentFile>`.
  Пример: studentFile `src/application.js` → `__solution__/src/application.js`.
- Эталон обязан покрыть **все** `studentFiles` (частичный эталон = ошибка валидатора).
- Контракт (экспорт, имена, сигнатуры) читай из **оригинального теста** в `__tests__/`,
  а не только из readme. Тест — источник правды.
- Пиши минимально достаточное решение, проходящее все ассерты. Смотри фикстуры
  (`__fixtures__/`) и provided `src/*`, чтобы знать реальную разметку/данные.

### Снапшот-тесты (`toMatchSnapshot`)

Если тест использует `toMatchSnapshot`, нужен закоммиченный `.snap`, сгенерированный
из ЭТАЛОНА (иначе стартер тоже создаст свой снапшот и пройдёт → `starter-passes`).
Генерация без интерференции сырого зеркала:

```bash
CFG=$PWD/packages/runner/vitest.exercise.config.ts
mv exercises/<slug>/__hexlet__ /tmp/hx-bak            # убрать сырой тест из glob
cp exercises/<slug>/__solution__/src/<f>.js exercises/<slug>/src/<f>.js
node node_modules/vitest/vitest.mjs run --config "$CFG" --root "$PWD/exercises/<slug>" --update
git checkout exercises/<slug>/src/<f>.js 2>/dev/null || cp exercises/<slug>/__hexlet__/src/<f>.js …  # вернуть стартер
mv /tmp/hx-bak exercises/<slug>/__hexlet__
```

Снапшот (`__tests__/__snapshots__/*.snap`) коммитится вместе с заданием.

## Особые случаи из курса js-react (волна 17)

- **Решённые пользователем задания**: контейнер хранит файлы АККАУНТА (Саша решал
  часть заданий на Hexlet) — стартер приходит с заполненным `// BEGIN … // END`.
  Скрипт `scripts/split-solved-starters.py <exercisesRoot> <slug>...` разносит:
  содержимое блока → `__solution__`, стартер очищается. Блок из одних пробелов =
  нетронутый стартер («2 chars» в выводе — удалить такой `__solution__` и написать самому).
- **Playwright-тесты**: у пары заданий (js-react-hooks-use-callback) оригинальный тест —
  `@playwright/test` на localhost:8080. В vitest-раннере не исполним: пиши RTL-эквивалент
  тех же ассертов, оригинал остаётся в `__hexlet__`.
- **Контейнер без тестов** (js-react-hooks-use-effect) или мёртвый IDE (502 навсегда,
  js-react-hooks-use-ref): пиши тест сам по readme/соседним заданиям, пометь комментарием.
- **JSX**: `esbuild: { jsx: "automatic" }` в конфиге раннера — тесты Hexlet не импортируют
  React. Тесты приходят и как `.jsx`, и с именами без `.test.` (`test.jsx`).
- **Снапшоты приходят готовыми** из контейнера (сгенерированы при прохождении) —
  коммитить как есть, они соответствуют эталону преподавателя.
- **Subpath-импорты** (`lodash/uniqueId`): алиас должен указывать на КАТАЛОГ пакета
  (`path.dirname(require.resolve("lodash"))`), а не на entry-файл.

## Особые случаи из курса js-redux-toolkit (Фаза 1.5, PR #40)

- **jsdom-локейшн обязан быть `http://localhost/`** — задано глобально через
  `test.environmentOptions.jsdom.url` в конфиге раннера. Vitest-дефолт
  `localhost:3000` уводит относительные запросы (`/api/data`) мимо nock/msw.
- **RTK Query + undici**: jsdom подменяет `AbortController`, а `fetch`/`Request`
  остаются undici — undici отвергает «чужой» AbortSignal
  (`Expected signal to be an instance of AbortSignal`). Решено шимом в
  `vitest.exercise.setup.ts`: обёртка над `globalThis.Request` выбрасывает
  `signal` из init. Abort в тестах заданий не нужен.
- **Сабпат-импорты ESM-пакетов** (`es-toolkit/compat`, `react-bootstrap/Spinner`):
  нужен отдельный alias-ключ ПЕРЕД базовым (`"es-toolkit/compat"` до
  `"es-toolkit"`), иначе базовый alias (файл) съедает сабпат.
- **Решённые стартеры**: `split-solved-starters.py` с выводом «2 chars»
  ПЕРЕЗАПИСЫВАЕТ существующий `__solution__` мусором — после запуска
  восстановить такие эталоны из git и написать заново.
- **Снапшот-тест без готового `.snap`** (js-redux-toolkit-integration):
  контейнер снапшот не отдал — генерировать из эталона по процедуре выше.

## Особые случаи из курса js-dom (эталоны как образец)

- Сетевые задания (`js-dom-ajax`) — тест мокает HTTP через **msw** (`msw/node` setupServer).
  Решение просто дергает `fetch(url)`; msw перехватывает. jsdom-локейшн — `http://localhost/`.
- jQuery-задания (`js-dom-jquery`) — `import $ from 'jquery'` работает в jsdom-окружении.
- Задания, где studentFile — `index.html` (`js-dom-js`, `js-dom-window`): эталон — сам HTML.
- Тесты, читающие фикстуру через cwd (`path.join(...)`) — работают благодаря cwd=workDir.

## Git-процесс (пре-авторизовано пользователем)

```bash
git checkout -b feat/exercise-tests-<wave>-<course>
git add -A
git commit -m "feat(tests): Фаза 1, волна N — все K заданий <Курс> validated"   # + Co-Authored-By
gh pr create --fill
gh pr merge --squash --admin --delete-branch
```

Коммит: conventional + строка `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
PR-боди заканчивать `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
Branch protection требует зелёного CI — потому `--admin`. Всегда **полный** прогон
`pnpm validate:exercise-tests` перед коммитом, чтобы `exercises/TESTS_STATUS.md` был свежим
(CI проверяет `git diff --exit-code`).

## Синк в Todoist после каждой волны

- Задача Фазы 1 `6h2qQCcWrqRr7rRm` — комментарий с прогрессом (курс, N заданий, счётчики
  validated/эталонов/заглушек, номер PR).
- Задача контент-долга `6h2rvcWq298wMCQF` — находки (протёкшие стартеры, недостающие
  хелперы/фикстуры, добавленные в alias пакеты, расхождения readme↔тест).

## Оставшиеся курсы Фазы 1 (JS/TS)

| courseSlug            | заданий | примечание                                         |
|-----------------------|---------|----------------------------------------------------|
| js-react              | 25      | React Testing Library; вероятно 2 волны            |
| js-redux-toolkit      | 10      | RTK + RTL                                          |
| typescript-basics     | 33      | typed-задания: у многих стартер уже проходит        |
| typescript-advanced   | 20      | то же; `starter-passes` тут часто легитимен         |

Про TS: для «typed»-заданий (проверяется факт компиляции/типов, а не поведение)
`starter-passes` — не баг. Помечай такие статусом честно; не выдумывай поведенческие
ассерты там, где оригинальный тест их не делает.

## Опциональный ретрофит (Фаза 1.5)

Курсы, уже провалидированные в волнах 4–15 самописными тестами, можно перевести на
оригинальные тесты Hexlet тем же импортёром (`--course <slug>`) — выше точность
соответствия платформе. Делать только по отдельной задаче, не блокирует остальное.
