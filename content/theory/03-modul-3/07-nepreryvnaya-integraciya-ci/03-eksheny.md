---
title: "Экшены"
module: "Модуль 3"
topic: "Непрерывная интеграция (CI)"
buildin_id: ac44fe19-97ba-4fc6-8d03-3fe4c4e266bf
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Экшены

Сильная сторона GitHub Actions — **экшены**: готовые шаги, которые сокращают YAML и ускоряют типовой цикл «клонировать → установить → протестировать» на любом стеке.

Мы уже видели экшен *checkout* — он клонирует репозиторий в рабочую папку:

```
steps:
  - uses: actions/checkout@v4
```

Экшен подключается как шаг с ключом `uses` вместо `run`. Имя берётся из [каталога экшенов](https://github.com/marketplace?type=actions) — официальные лежат в организации *actions*, сторонние — у авторов по схеме *владелец/репозиторий*.

Версию экшена указывают явно (`@v4`, `@release`), чтобы обновления репозитория экшена не ломали чужие воркфлоу. Актуальную метку смотрите в README [репозитория экшена](https://github.com/actions/setup-node).

Параметры передают через `with`:

```
steps:
  - uses: actions/checkout@v4
  # https://github.com/actions/setup-node
  - uses: actions/setup-node@v4
    with:
      node-version: '18.x'
      cache: 'npm' # ускоряет повторные сборки
  - run: npm ci
  - run: npm test
```

Пример [стороннего экшена Cypress](https://github.com/marketplace/actions/cypress-io):

```
name: End-to-end tests
on: [push]
jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      # Устанавливает зависимости, кеширует их и запускает тесты
      - uses: cypress-io/github-action@v6
```

## Самостоятельная работа

1. Если ещё не сделали — добавьте воркфлоу для **ci-app** (репозиторий из прошлого урока): checkout, установка Node, зависимости и тесты.

1. Подключите учебный экшен, который только печатает приветствие в лог. Имя, репозиторий и ожидаемый вывод — в блоках ниже.

```
uses: hexlet-components/hello-from-hexlet-action@release
Hello from Hexlet!
```

Репозиторий экшена:

```
https://github.com/hexlet-components/hello-from-hexlet-action
```

В итоге — воркфлоу с клонированием, установкой зависимостей, тестами и демонстрационным экшеном.

Что должно получиться

```
https://github.com/hexlet-components/hexlet-ci-app/blob/final/.github/workflows/main.yml
```

## Дополнительные материалы

- [Кеширование](https://github.com/actions/cache)

- [Тестирование на разных версиях языков и библиотек](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix)
