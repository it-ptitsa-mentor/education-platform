# Education Platform — JS Trainer MVP

**Date:** 2026-06-10  
**Status:** Approved (variant 2 — Monaco + shared runner)  
**Scope:** Single-file JavaScript exercises with Vitest checks

## Goal

Browser-based JS trainer for IT Птица Mentor: readme + Monaco editor + «Проверить» runs tests in a shared backend runner (no per-user evaluator cluster).

## Architecture

```
exercises/{slug}/     ← SSOT: manifest + starter + hidden tests
packages/shared/      ← types, manifest loader/validator
packages/runner/      ← copy workspace → run vitest → result
packages/api/         ← Fastify: list/get/check
packages/web/         ← React + Monaco UI
```

## Exercise contract (`exercise.json`)

- `slug`, `title`, `language` (`javascript`)
- `filesToOpen[]` — tabs opened in editor
- `studentFiles[]` — paths the student may submit (others read-only from template)
- `readme` — markdown shown in UI

Folder also contains starter files + `__tests__/` (not editable by student in UI).

## API (MVP)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/exercises` | List slugs + titles |
| GET | `/api/exercises/:slug` | Manifest + starter file contents |
| POST | `/api/exercises/:slug/check` | `{ files: Record<path, string> }` → test output |

## Out of scope (v0)

- Auth / Telegram
- Docker sandbox (subprocess + timeout first)
- Terminal / REPL
- CSS web preview
- React multi-file projects

## Testing

- `pnpm test` — unit (manifest, runner helpers)
- `pnpm test:feature` — HTTP inject + real vitest run on sample exercise
