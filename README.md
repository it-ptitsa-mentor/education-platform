# education-platform

Платформа IT Птица Mentor — JS-тренажёры с Monaco-редактором и общим runner'ом (вариант 2: без evaluator-кластера как у Hexlet).

## Стек

| Слой | Технологии |
|------|------------|
| Web | React, Vite, Monaco Editor |
| API | Fastify |
| Runner | Vitest в изолированной temp-директории |
| Упражнения | `exercises/{slug}/` + `exercise.json` (SSOT) |

## Быстрый старт

```bash
pnpm install
pnpm dev:api    # http://127.0.0.1:4100
pnpm dev:web    # http://127.0.0.1:5175
```

Или оба сразу: `pnpm dev`

## Деплой

### GitHub Pages (фронт)

После push в `main` workflow `.github/workflows/deploy-pages.yml` публикует UI:

**https://it-ptitsa-mentor.github.io/education-platform/**

GitHub Pages — только статика. Кнопка «Проверить» требует API.

1. Подними API (Render blueprint `render.yaml` или свой сервер): `pnpm --filter @ptitsa/api dev`
2. В настройках репозитория → **Secrets** → `VITE_API_BASE_URL` = `https://твой-api.example.com` (без слэша в конце)
3. Перезапусти workflow **Deploy GitHub Pages**

### API (отдельно)

```bash
pnpm --filter @ptitsa/api exec tsx packages/api/src/server.ts
# PORT=4100, нужны exercises/ и node_modules с vitest в корне репо
```

## Тесты

```bash
pnpm test           # unit: manifest, runner
pnpm test:feature   # API + реальный vitest на js-variables
```

## Добавить JS-упражнение

1. Создайте `exercises/my-slug/exercise.json`
2. Положите `solution.js`, `vitest.config.js`, `__tests__/`
3. Упражнение появится в `GET /api/exercises`

## Дизайн

Спека MVP: [docs/superpowers/specs/2026-06-10-js-trainer-design.md](docs/superpowers/specs/2026-06-10-js-trainer-design.md)
