---
title: "NPM"
module: "Модуль 2"
topic: "JS: Настройка окружения"
buildin_id: e0f7ff12-e6ab-48c3-a756-61648c5f5580
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# NPM

Вместе с Node.js в системе появляется утилита *npm* (Node Package Manager). Ею управляют JavaScript-проектами как npm-пакетами.

```
# Так можно проверить ее наличие
npm --version

6.14.5
```

*nmp* решает много задач; сейчас важна базовая — **инициализация** нового пакета. Под «проектом» здесь имеется в виду код приложения, например конкретного сайта.

Чтобы создать npm-пакет:

1. Создайте директорию проекта — корень, где будут лежать все файлы.

1. В корне выполните `npm init`.

```
# Создание директории
mkdir js-hello-world
# Переход внутрь директории
cd js-hello-world

# Инициализация npm-пакета
# init – означает initialization
npm init

This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

Press ^C at any time to quit.
package name: (js-hello-world)
```

При инициализации *npm* спросит имя пакета, версию, описание и т.д. Ответы можно пропустить — их всегда можно изменить позже.

В конце *npm* покажет черновик *package.json* и спросит подтверждение. После *yes* файл сохранится, и проект готов к работе.

```
{
  "name": "tmp",
  "version": "1.0.0",
  "type": "module",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

*package.json* — текстовый файл в формате [JSON](https://ru.wikipedia.org/wiki/JSON): пары «ключ — значение», где значением может быть вложенный объект (как у ключа *scripts*).

*Обратите внимание на [ключ `"type"`](https://nodejs.org/api/esm.html#esm_package_json_type_field) в JSON выше. Эту строку нужно добавить вручную после инициализации. Она включает [систему ES-модулей](https://nodejs.org/api/esm.html) в Node.js.*

После инициализации пишут код. По умолчанию стартовый файл — *index.js* в корне (рядом с *package.json*). Это не значит, что проект состоит из одного файла: файлов может быть сколько угодно, но точка сборки обычно в *index.js*, куда импортируют остальные модули.

## Самостоятельная работа

1. Выполните инициализацию в корне проекта my*-js*. Не забудьте добавить ключ *type*, как в теории

1. Заполните пустые поля файла *package.json*. Подробное описание каждого поля можно посмотреть в [документации npm](https://docs.npmjs.com/files/package.json)

1. Запустите код в *index.js* из предыдущего урока, убедитесь что все работает

1. Добавьте все изменения на Github

## Дополнительные материалы

- [NPM](https://www.npmjs.com/)

- Эталонный учебный npm-пакет *nodejs-package* (см. задания курса)

## Далее →
