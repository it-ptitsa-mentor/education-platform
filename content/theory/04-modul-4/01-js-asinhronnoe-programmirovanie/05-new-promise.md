---
title: "new Promise"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 489b16d2-8f83-4f31-893a-194dc5207fce
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# new Promise

Если в проекте появились промисы, разумно перевести на них весь асинхронный код. Не все библиотеки это поддерживают: многие по-прежнему работают на колбеках. Тогда функции «оборачивают» или «промисифицируют». Создание — через конструктор `Promise`:

```
import fs from 'fs'

const promise = new Promise((resolve, reject) => {
  fs.readFile('/etc/passwd', (err, data) => {
    if (err) {
      reject(err)
      return
    }
    resolve(data)
  })
})
```

Конструктор принимает функцию, которую вызывают сразу при создании промиса. Внутри неё запускают асинхронную колбек-операцию, которую хотят представить промисом. В эту функцию передают два колбека:

- `resolve` — при успешном завершении; аргумент станет результатом в `then`.

- `reject` — при ошибке; аргумент попадёт в `catch`.

У каждой функции ровно один аргумент. Достаточно вызвать одну из них. Можно сделать промис, который всегда успешен, просто никогда не вызывая `reject`.

`new Promise()` возвращает обычный промис:

```
promise
  .then(console.log)
  .catch(console.log)
```

Несколько асинхронных операций оборачивают отдельно: одна операция — один `new Promise`. В Node.js есть `util.promisify`, которая делает это автоматически для колбек-функций:

```
import util from 'util'
import fs from 'fs'

const stat = util.promisify(fs.stat)
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
})
```

Во фронтенде аналог ищут в npm-пакетах с `promisify`.

Иногда асинхронности нет, но нужен промис для цепочки:

```
const promise = new Promise(resolve => resolve())
// promise.then ...
```

То же для неуспешного завершения:

```
const promise = new Promise((resolve, reject) => reject())
// promise.catch ...
```

Для этого есть сокращения:

```
const promise1 = Promise.resolve()
// promise1.then ...

const promise2 = Promise.reject()
// promise2.catch ...
```

## Устройство

<!-- IMG (из Buildin, перезалить отдельно) -->
Технически промис — объект с тремя состояниями (см. [конечные автоматы](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D0%B5%D1%87%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82)): *pending*, *fulfilled*, *rejected*. Старт — *pending*; `resolve` и `reject` переводят в терминальные *fulfilled* или *rejected*. Из терминального состояния откат невозможен: после `resolve` вызов `reject` уже не сменит состояние на *rejected*.

---

### Дополнительные материалы

1. [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)

1. [Конечный автомат (Википедия)](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D0%B5%D1%87%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82)

## Далее →
