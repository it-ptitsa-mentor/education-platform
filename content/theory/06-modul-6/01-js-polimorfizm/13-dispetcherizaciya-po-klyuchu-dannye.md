---
title: "Диспетчеризация по ключу (данные)"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: c460711d-7645-4600-8380-9bfcbefa9d60
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Диспетчеризация по ключу (данные)

Рядом с полиморфизмом часто звучит «динамическая диспетчеризация» — к ней вернёмся позже. Сейчас — что такое диспетчеризация вообще.

Диспетчеризация (dispatch — направлять, отправлять) — координация действий: диспетчер в аэропорту разводит рейсы, в такси — связывает водителя и клиента.

Условный код с ветвлением по значению переменной:

```
let databaseConfiguration
if (env === 'development') {
  databaseConfiguration = {
    adapter: 'sqlite',
  }
}
else if (env === 'production') {
  databaseConfiguration = {
    adapter: 'postgresql',
  }
}
```

У проекта есть «среда» запуска. *development* — у разработчика, *production* — боевая. Старт, конфиг и даже СУБД могут отличаться — отсюда разные настройки в примере. Выбор ветки — диспетчеризация.

Цепочку `if` по строкам заменяют `switch` — намерение читается явнее:

```
let databaseConfiguration

switch (env) {
  case 'development':
    databaseConfiguration = {
      adapter: 'sqlite',
    }
    break
  case 'production':
    databaseConfiguration = {
      adapter: 'postgresql',
    }
    break
}
```

Дальше — таблица по ключу:

```
const databaseSettingsByEnv = {
  development: {
    adapter: 'sqlite',
  },
  production: {
    adapter: 'postgresql',
  },
}

const databaseConfiguration = databaseSettingsByEnv[env]
```

Значение по умолчанию — через `??`:

```
const databaseConfiguration = databaseSettingsByEnv[env] ?? { adapter: 'memory' }
// Либо через _.get
// const databaseConfiguration = _.get(databaseSettingsByEnv, env, { adapter: 'memory' });
```

Этот вариант короче и гибче: `if`/`switch` зашиты в код, таблицу можно вынести в JSON или YAML:

```
---

development:
  adapter: sqlite

production:
  adapter: postgresql
```

Новое поведение добавляют данными, без правки программы. Особенно ценно, когда ветвит не наш код, а библиотека или фреймворк — их исходники мы не трогаем.

## Далее →
