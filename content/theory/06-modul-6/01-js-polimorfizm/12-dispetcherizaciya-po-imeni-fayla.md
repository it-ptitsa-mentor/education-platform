---
title: "Диспетчеризация по имени файла"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: bcc17ec6-a724-41e9-8194-82e9ee66af66
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Диспетчеризация по имени файла

Ещё один приём — выбор ресурса по имени файла.

Иногда конфигурацию не кладут в один файл с ключами, а делят по средам:

`configs/ database.development.json database.production.json database.test.json`

Где-то в коде нужно выбрать нужный файл. Вариант с диспетчеризацией по ключу:

```
import fs from 'fs'

const configFileNamesByEnv = {
  development: 'database.development.json',
  production: 'database.production.json',
  test: 'database.test.json',
}

const filename = configFileNamesByEnv[env]
const raw = fs.readFileSync(filename)
const config = JSON.parse(raw)
```

Имея имя среды, можно собрать имя файла по шаблону:

```
const filename = `database.${env}.json`
const raw = fs.readFileSync(filename)
const config = JSON.parse(raw)
```

Код короче и не требует правок при добавлении среды.

## Далее →
