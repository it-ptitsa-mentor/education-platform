---
title: "GitHub Actions"
module: "Модуль 3"
topic: "Непрерывная интеграция (CI)"
buildin_id: 64d65239-9f1e-47af-a0c9-e92d5bae7a5d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# GitHub Actions

**GitHub Actions** — встроенная CI для публичных репозиториев (на GitHub). С её помощью можно:

- Прогонять линтер и тесты на каждый пуш

- Деплоить проект

- Публиковать новую версию пакета

- Слать уведомления в мессенджеры о issue и pull request

- и многое другое

В уроке — базовые понятия и минимальный пример, чтобы быстро подключить Actions к своему репозиторию.

<!-- IMG (из Buildin, перезалить отдельно) -->
Схема простая: в репозитории появляется каталог *.github/workflows* с YAML-файлами — в них описано, на какие события реагировать и какие шаги выполнять. Ниже воркфлоу *show-directory* на пуш: файл *show-directory.yml* (имя любое, расширение `.yml`). В терминологии GitHub Actions такой файл — **воркфлоу**.

```
# file: .github/workflows/show-directory.yml
name: show-directory
# on – определяет события, которые запускают воркфлоу
on: push
jobs:
  # build – произвольно выбранное имя задания
  # их может быть больше одного
  build:
    # операционная система для работы воркфлоу
    runs-on: ubuntu-latest
    steps: # список шагов, которые надо выполнить
      # экшен — выполняет какую-то задачу
      # checkout — клонирует репозиторий
      - uses: actions/checkout@v4
      # run – произвольная bash-команда
      # ls -la выведет содержимое текущего репозитория
      - run: ls -la
```

Этот воркфлоу выводит список файлов в рабочей директории. Реальные пайплайны сложнее, но структура та же. У любой CI-системы набор блоков похож; дальше — краткий обзор, в следующих уроках разберём детали.

## Основные понятия

На схеме ниже — ключевые сущности GitHub Actions.

<!-- IMG (из Buildin, перезалить отдельно) -->
- Воркфлоу / Workflows
  В репозитории может быть несколько воркфлоу — каждый в отдельном файле в *.github/workflows*. Несколько воркфлоу могут идти параллельно.

- События / Events
  Запуск по событиям GitHub (push, release, pull request), по расписанию (cron) или по внешнему webhook API.

- Задания / Jobs
  Воркфлоу состоит из одного или нескольких **заданий** — набора команд, выполняемых вместе. По умолчанию задания параллельны; зависимости задают порядок.

- Раннеры / Runners
  Задание выполняется на **раннере** — временной машине GitHub (Linux, macOS или Windows). Есть и [собственные раннеры](https://docs.github.com/en/actions/hosting-your-own-runners) для своего окружения.

- Шаги / Steps
  Задание — цепочка **шагов**: команда shell или экшен. Шаги идут по порядку на одном раннере; при падении шага следующие в задании пропускаются.

- Экшен / Actions
  **Экшен** — переиспользуемый шаг с параметрами и выходными значениями. Свои или из [GitHub Marketplace](https://github.com/marketplace?type=actions) — там сотни готовых экшенов.

## Самостоятельная работа

Соберём свой *Hello, World!* на воркфлоу.

1. Добавьте в репозиторий *Makefile* (см. [руководство GNU Make](https://www.gnu.org/software/make/manual/make.html)) с целью `say-hello`, которая печатает `Hello, World!`. Пример вызова:
```
make say-hello
Hello, World!
```

1. Создайте воркфлоу по образцу из урока и замените `ls -la` на `make say-hello`

1. Запушьте изменения и на вкладке Actions убедитесь, что сборка прошла успешно

1. Добавьте в *README.md* [бейдж статуса](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge) воркфлоу — его можно скопировать через меню «⋯» на странице запуска

<!-- IMG (из Buildin, перезалить отдельно) -->
В итоге — рабочий воркфлоу и зелёный бейдж в README со статусом последнего прогона.

## Дополнительные материалы

- [Документация GitHub Actions](https://docs.github.com/en/actions/quickstart)

- [GNU Make — официальное руководство](https://www.gnu.org/software/make/manual/make.html)

- [Добавление бэйджа Github Actions](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)

## Далее →
