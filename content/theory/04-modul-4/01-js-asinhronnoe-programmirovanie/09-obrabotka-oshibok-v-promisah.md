---
title: "Обработка ошибок в промисах"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 99637734-7e74-41b6-ae37-17739407e147
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Обработка ошибок в промисах

Ошибки в промисах ловят через `catch` — передайте колбек с объектом ошибки:

```
import fsp from 'fs/promises'

const promise = fsp.readFile('unknownfile')
promise.catch(e => console.log('error!!!', e))
// => error!!! { [Error: ENOENT: no such file or directory, open 'unknownfile']
// errno: -2, code: 'ENOENT', syscall: 'open', path: 'unknownfile' }
```

`catch` возвращает новый *promise*, цепочку можно продолжить после ошибки. Допустимо чередовать `then` и `catch`:

```
import fsp from 'fs/promises'

const promise = fsp.readFile('unknownfile')
  .catch(console.log)
  .then(() => fsp.readFile('anotherUnknownFile'))
  .catch(console.log)
```

Часто неважно, на каком шаге упало: любая ошибка должна прервать сценарий и уйти в обработчик — как в *try/catch*. Ошибка идёт к первому `catch`, промежуточные `then` пропускаются. Поэтому часто пишут так:

```
import fsp from 'fs/promises'

const promise = fsp.readFile('unknownfile')
  .then(() => fsp.readFile('anotherUnknownFile'))
  .catch(console.log)
```

Семантика отличается: в первом варианте второе чтение стартует даже после падения первого; во втором — нет.

<!-- IMG (из Buildin, перезалить отдельно) -->
Иногда ошибку нужно создать вручную. Проще всего — `throw`. *try/catch* для синхронного кода; в `then` исключение промис превратит и отправит в `catch`:

```
import fsp from 'fs/promises'

// Файл unknownfile существует, но нам все равно нужно выкинуть ошибку
const promise = fsp.readFile('unknownfile')
  .then((data) => {
    // делаем что-нибудь
    throw new Error('boom!')
  })
  .then(() => {
    // Этот then не будет вызван из—за исключения на предыдущем шаге
  })
  .catch(console.log)
```

Или вернуть `Promise.reject` с ошибкой:

```
import fsp from 'fs/promises'

const promise = fsp.readFile('unknownfile')
  .then((data) => {
    // делаем что-нибудь
    return Promise.reject(new Error('boom!'))
  })
  .catch(console.log)
```

Архитектурно: в библиотечных функциях не глотайте ошибки:

```
import fsp from 'fs/promises'
// Подавление ошибки при помощи catch()
const readFileEasily = filepath => fsp.readFile(filepath).catch(console.log)
```

Вызывающий код не узнает о сбое. Если логируете — пробросьте снова:

```
import fsp from 'fs/promises'
// Перехватывая ошибку при помощи catch(), мы не даем ей попасть в вызывающий код
// Это нежелательное поведение — в конце ошибку нужно выбросить снова
const readFileEasily = filepath => fsp.readFile(filepath)
  .catch((e) => {
    console.log(e) // В библиотеках так делать нельзя, только в своем коде
    throw e
  })

// Теперь вызывающий код может обработать ошибку:

readFileEasily('path/to/file').catch(/* ... */)
```

## Далее →
