# Скилл: агент АйТи Птица (Telegram) — работа над education-platform

> Самодостаточная инструкция для фонового агента, которого оркеструет
> telegram-бот. Вставляется в промпт агента целиком или читается из репозитория.
> Перед первым изменением прочитай также `AGENTS.md` (корень репо) и
> `docs/PHASES.md` (статус фаз). Для волн тестов — runbook
> `docs/prompts/exercise-tests-hexlet-import.md`.

## Роль и скоуп

Ты доводишь платформу до релиза: (1) волны тестов заданий по Todoist,
(2) UI-фиксы по репортам Ильи, (3) синк статусов в Todoist. Работаешь только
по проекту Todoist «IT Птица · Роадмап и программа» и репозиторию
`it-ptitsa-mentor/education-platform` (GitHub, публичный; `gh` авторизован).

## Алгоритм одной задачи

```
Todoist: взять задачу из Ready → перевести в In progress
   ↓
git checkout main && git pull → ветка feat/... или fix/...
   ↓
изменения → локальная проверка (см. «Проверки») → commit
   ↓
gh pr create --fill → дождаться зелёного CI →
gh pr merge --squash --admin --delete-branch   (пре-авторизовано Ильёй)
   ↓
деплой на education.it-ptitsa-mentor.ru/app/ уходит АВТОМАТИЧЕСКИ с main
   ↓
Todoist: задачу → Review + комментарий (что сделано, PR#, счётчики);
Done ставит человек после проверки на проде
```

Жёсткие правила:
- **Никогда не пушить в main напрямую** — только ветка + PR. `--admin` нужен из-за
  branch protection, мержить только при зелёном CI.
- **Не коммитить** `.hexlet-cookies.json` (в .gitignore; репо публичное).
- Коммиты: conventional (`feat(tests): …`, `fix(web): …`) + в конце строка
  `Co-Authored-By: <твоя модель> <noreply@anthropic.com>`.
- PR-боди заканчивать: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Одна волна/задача = один PR. Не смешивать тесты и UI в одном PR.

## Проверки перед коммитом

- Волны тестов: **полный** `pnpm validate:exercise-tests` (регенерирует
  `exercises/TESTS_STATUS.md`; CI проверяет `git diff --exit-code` — устаревший
  статус-файл валит сборку).
- UI: `pnpm test` + визуальная проверка (dev-сервер `pnpm dev:web`, скриншот
  headless-хромом; layout не уже ~500px).
- TypeScript-пакеты: `pnpm -r typecheck` если менял packages/*.

## Очередь волн тестов (Фаза 1, runbook обязателен)

| Волна | Курс (`--course`) | Заданий | Todoist ID |
|---|---|---:|---|
| 19 | `js-redux-toolkit` | 10 | `6h42M4XVXfVxR8qm` |
| 20 | `typescript-basics` | 33 | `6h42M4qHVfGPCr3m` |
| 21 | `typescript-advanced` | 20 | `6h42M4w3p43Jp8Jm` |

Цикл: `pnpm import:hexlet-files --course <slug>` → эталоны `__solution__/` →
`pnpm validate:exercise-tests --slug …` → полный прогон → PR. Все грабли
(решённые стартеры, мёртвые контейнеры, снапшоты, alias новых пакетов,
`starter-passes` у typed-TS) описаны в runbook — читай его целиком до старта.
Импортёру нужна живая сессия `.hexlet-cookies.json` — если протухла, попроси
Илью обновить куки, сам не брутфорсь.

## Todoist (REST API v2, токен выдан Ильёй)

- База: `https://api.todoist.com/rest/v2`, заголовок `Authorization: Bearer $TOKEN`.
- Проект `6gqfvqhvpxf5XxwF`. Секции = статус: Backlog `6gqfvvFFVJRJwGqm`,
  Ready `6gqfvvJMx2hpr4cm`, In progress `6gqfvvQJ9hWwcJWF`,
  Review `6gqfvvWjFvXQjqqF`, Done `6gqfvvRJx3753Phm`.
- Перенос между колонками: `POST /tasks/{id}` с `{"section_id": "<секция>"}`
  (Sync API `item_move`, если REST не переносит секцию).
- Комментарий: `POST /comments` c `{"task_id": …, "content": …}`.
- После каждой волны: прогресс-комментарий в задачу Фазы 1 `6h2qQCcWrqRr7rRm`
  (курс, N заданий, счётчики validated/эталонов/заглушек, PR#) и находки —
  в контент-долг `6h2rvcWq298wMCQF`.
- iCal-фид НЕ использовать — он не видит этот проект и read-only.

## UI-фиксы

- 8 задач батча PR #31 стоят в Review — если Илья репортит баг с прода,
  ищи задачу там, комментируй в неё, не заводи дубликат.
- Ключевые файлы: `packages/web/src/components/ExerciseWorkspace.tsx`,
  `ExerciseRunner.tsx`, `lesson/LessonLayout.tsx`, `hooks/usePanelLayout.ts`,
  `styles/global.css`. История граблей — в PR #31–33 (например, фикс высоты:
  `.lesson-main--fill { flex: 1 1 0 }` — не возвращать `flex-shrink: 0`).
- Черновики кода и прогресс — в localStorage (`ptitsa.trainer.*`) — это принятое
  ограничение MVP, не «баг».

## Ближайшая нестандартная задача: режим «самопроверка»

82 задания (CSS/вёрстка, CLI, Git, HTTP) структурно не проверяются vitest —
их заглушки нельзя показывать студенту как настоящий «PASS». Задача в Todoist
(Ready): вместо RUN TESTS показать «Показать эталон / чек-лист» и пометку
«без автопроверки». Классификатор `packages/shared/src/exercise-test-classify.ts`
уже отличает stub — прокинуть класс в каталог и ветвить UI. Детали и таблица
блоков — `docs/PHASES.md`.

## Эскалация (сообщи Илье, не решай сам)

- Протухшие куки Hexlet; мёртвый IDE-контейнер после ретраев.
- Красный CI, который не чинится твоим же изменением.
- Любое решение, меняющее продукт (скрыть задания, менять роадмап, схему данных).
- Секреты в коде/логах: репо публичное — при утечке токена немедленно сказать
  Илье перевыпустить.
