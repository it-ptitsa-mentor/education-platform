# education-platform

Платформа IT Птица Mentor — JS-тренажёры с Monaco-редактором и общим runner'ом (вариант 2: без evaluator-кластера как у Hexlet).

## Стек

| Слой | Технологии |
|------|------------|
| Web | React, Vite, Monaco Editor |
| API | Fastify (локально / свой сервер) |
| Runner | Vitest в изолированной temp-директории |
| GitHub Pages | статика + проверка в браузере |
| Упражнения | `exercises/{slug}/` + `exercise.json` (SSOT) |

## Быстрый старт

```bash
pnpm install
pnpm dev:api    # http://127.0.0.1:4100
pnpm dev:web    # http://127.0.0.1:5175
```

Или оба сразу: `pnpm dev`

## Деплой — GitHub Pages

**Сайт:** https://it-ptitsa-mentor.github.io/education-platform/

Репозиторий **публичный**. При push в `main` workflow `.github/workflows/deploy-pages.yml` собирает статику с:

- `VITE_BASE_PATH=/education-platform/`
- `VITE_STATIC_API=true` — упражнения и «Проверить» работают без отдельного API (проверка в браузере)

Локально по-прежнему API + Vitest runner (`pnpm dev`).

### Свой сервер (позже education.*)

```bash
VITE_BASE_PATH=/ VITE_API_BASE_URL= pnpm --filter @ptitsa/web build
NODE_ENV=production pnpm --filter @ptitsa/api start:prod
```

## Тесты

```bash
pnpm test           # unit: manifest, runner, browser checks
pnpm test:feature   # API + реальный vitest на js-variables
```

## Добавить JS-упражнение

1. Создайте `exercises/my-slug/exercise.json`
2. Положите `solution.js`, `__tests__/`
3. Зарегистрируйте browser-check в `packages/shared/src/exercise-checks/`
4. Упражнение появится в списке после `pnpm generate:static-exercises`

## Дизайн

Спека MVP: [docs/superpowers/specs/2026-06-10-js-trainer-design.md](docs/superpowers/specs/2026-06-10-js-trainer-design.md)
