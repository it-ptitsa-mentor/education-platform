---
title: "Задания"
module: "Модуль 3"
topic: "Непрерывная интеграция (CI)"
buildin_id: 6fbf4dd2-7a73-4ab6-b503-23d9b85e5a81
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Задания

**Задания (jobs)** в воркфлоу — логические этапы CI: сборка, тесты, деплой и т.п. По умолчанию они стартуют параллельно; при необходимости задают порядок:

```
# сборка фронтенда и бекенда происходит одновременно
# а тесты бекенда запускаются только после сборки бекенда
jobs:
  build-frontend:
  build-backend:
  test:
    needs: build-backend
```

Задание *test* запустится только если *build-backend* завершился успешно. Иногда шаг нужен в любом случае — типичный пример: уведомление. Для этого в выражении указывают `if`:

```
jobs:
  build-frontend:
  build-backend:
  test:
    # конструкция внутри ${{}} называется выражением
    if: ${{ always() }}
    needs: build-backend
```

GitHub Actions изолирует задания: каждое работает в своей директории на раннере. Файлы, созданные в *build-backend*, не видны в *test* без явной передачи артефактов — см. [передачу данных между jobs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/passing-information-between-jobs). Для простых Node-проектов часто хватает одного задания со всеми шагами:

```
# Пример для проекта на Node.js
jobs:
  build: # имя взято для примера
    runs-on: ubuntu-latest

    steps:
      # Клонируем репозиторий
      - uses: actions/checkout@v4
      # Устанавливаем Node.js
      - uses: actions/setup-node@v4
      # Ставим зависимости
      - run: npm install
      # Запускаем линтер
      - run: npm run lint
      # Запускаем тесты
      # у шагов может быть имя, иногда это помогает отладке
      # имя выводится на Github при просмотре сборки
      - name: run tests
        run: npm test # name и run относятся к одной задаче, поэтому дефис ставится только перед name
```

Все шаги одного задания делят одну рабочую директорию; репозиторий туда клонирует экшен *checkout*.

## Операционная система

В `runs-on` выбирают Ubuntu, Windows или macOS — полный список на [странице hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners#standard-github-hosted-runners-for-public-repositories). Чаще всего берут *ubuntu-latest*. Чтобы гонять те же шаги на разных ОС, не обязательно дублировать задания — есть **matrix**:

```
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
    steps:
      # тут шаги
```

## Переменные окружения

Ключ `env` на уровне задания задаёт переменные для всех его шагов:

```
jobs:
  run:
    env:
      RAILS_ENV: staging
      DEBUG: 1
```

GitHub также подставляет [встроенные переменные](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables):

```
steps:
  - run: echo "Имя текущего воркфлоу – $GITHUB_WORKFLOW"
```

Переменные можно переопределить на уровне шага:

```
steps:
  - run: echo "$key"
    env:
      # Если такой ключ определен на уровне задания,
      # то он будет переопределен текущим значением
      key: value
```

## Самостоятельная работа

Настроим воркфлоу для учебного приложения.

1. Сделайте форк репозитория **ci-app** (URL в блоке ниже)

```
https://github.com/hexlet-components/hexlet-ci-app
```

1. Прочитайте README форка

1. Добавьте воркфлоу со шагами:
  - `make setup` — сетап проекта
  - `make test` — запуск тестов
  - `make lint` — запуск линтера

1. Запушьте изменения и проверьте успешный прогон на вкладке Actions. Pull request в исходный репозиторий не нужен

1. Добавьте в *README.md* бейдж статуса GitHub Actions

## Дополнительные материалы

- [Запуск сервисов](https://docs.github.com/en/actions/using-containerized-services/about-service-containers)

## Далее →
