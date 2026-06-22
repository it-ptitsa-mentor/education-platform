---
title: "Экшены"
module: "Модуль 3"
topic: "Непрерывная интеграция (CI)"
buildin_id: ac44fe19-97ba-4fc6-8d03-3fe4c4e266bf
---

# Экшены

Одна из самых классных вещей в Github Action – экшены. С их помощью значительно сокращается количество кода в воркфлоу, а стандартный цикл сборки и тестирования проходит буквально за минуты на любом стеке.

В предыдущих уроках мы уже встречались с несколькими экшенами. Чаще всего в сборках используется экшен *checkout*, который клонирует репозиторий в рабочую директорию:

```
steps:
  - uses: actions/checkout@v4
```

Отметим несколько деталей. Экшен работает как один из шагов задания. Для этого вместо ключа `run` используется ключ `uses`, за которым идет имя экшена. Откуда берется это имя? Из [каталога экшенов](https://github.com/marketplace?type=actions). Причем там могут быть как встроенные Github Actions, так и созданные сторонними пользователями. Понять, что и откуда можно по имени экшена, оно соответствует структуре ссылок самого Github: *имя пользователя или команды/название репозитория*. Встроенные экшены находятся в команде *actions*.

Кроме имени экшена Github требует указания его версии. Это сделано в целях надежности, чтобы обновления экшена не могли привести к случайной поломке всех репозиториев, которые его используют. Следить за версиями придется самостоятельно, поглядывая в *README* [конкретного репозитория](https://github.com/actions/setup-node) с экшеном.

У экшена могут быть параметры. Они задаются через ключ `with`:

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

А вот пример [стороннего экшена](https://github.com/marketplace/actions/cypress-io), который запускает тесты на фреймворке cypress:

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

1. Создайте Воркфлоу для приложения [ci-app](https://github.com/hexlet-components/hexlet-ci-app), если этого еще не сделали. Добавьте в него клонирование репозитория, установку Node, установку проекта и запуск тестов.

1. Добавьте в воркфлоу экшен [components/hello-from-hexlet-action](https://github.com/hexlet-components/hello-from-hexlet-action), который мы для вас подготовили. Он не делает ничего полезного, просто выводит строку *Hello from Hexlet!*. Имя экшена: **hexlet-components/hello-from-hexlet-action@release**

В итоге у вас получится файл с описанным воркфлоу, в котором происходит клонирование репозитория, установка зависимостей, запуск тестов и экшен, который выводит строку.

Что должно получиться

[https://github.com/hexlet-components/hexlet-ci-app/blob/final/.github/workflows/main.yml](https://github.com/hexlet-components/hexlet-ci-app/blob/final/.github/workflows/main.yml)

## Дополнительные материалы

- [Кеширование](https://github.com/actions/cache)

- [Тестирование на разных версиях языков и библиотек](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix)
