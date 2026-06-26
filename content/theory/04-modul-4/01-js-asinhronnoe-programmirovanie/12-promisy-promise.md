---
title: "Промисы (Promise)"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: d274cda2-0e6d-4ebd-aca4-d060b8e20e99
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Промисы (Promise)

Асинхронный код на колбеках быстро становится нечитаемым: несколько уровней вложенности и параллельные операции — и логику уже трудно восстановить. В больших программах это критично.

Колбеки ограничены с самого начала; со временем в JavaScript появились **Promises**. Промисы меняют организацию кода без нового синтаксиса и позволяют «выпрямить» цепочку до почти линейной.

Современный JS в основном на промисах; колбеки уходят в legacy. В Node.js промисные обёртки есть у большинства встроенных модулей — у `fs` через свойство `promises`:

```
import fs from 'fs'

// Код на колбеках похож на лесенку

fs.readFile('./first', 'utf-8', (_error1, data1) => {
  console.log(data1)
  fs.readFile('./second', 'utf-8', (_error2, data2) => {
    console.log(data2)
    fs.readFile('./third', 'utf-8', (_error3, data3) => {
      console.log(data3)
    })
  })
})

// Код на промисах практически плоский

// Переименование свойства promises в fsp для краткости
const { promises: fsp } = fs

fsp.readFile('./first', 'utf-8')
  .then(data1 => console.log(data1))
  .then(() => fsp.readFile('./second', 'utf-8'))
  .then(data2 => console.log(data2))
  .then(() => fsp.readFile('./third', 'utf-8'))
  .then(data3 => console.log(data3))
```

Промис — объект, который отслеживает асинхронную операцию и хранит результат. Его возвращают промисные API:

```
const promise = fsp.readFile(src, 'utf-8')
```

Промис — не сам результат операции, а «обещание» отслеживания. Операция по-прежнему выполнится позже:

```
const promise = fsp.readFile(src, 'utf-8')
// Файл еще не прочитан
console.log(promise)
// Promise { <pending> }
// pending — это состояние промиса говорит о том, что операция еще в процессе
```

Снаружи результат не извлечь — только продолжить через `then()` с колбеком; он вызовется после завершения:

```
// Результат чтения файла передан в колбек-функцию, переданную в then
// колбек вызовется только тогда, когда выполнится чтение файла
fsp.readFile(src, 'utf-8').then(content => console.log(content))
```

Колбек **передаётся** в `then()`, не вызывается сразу — вызов делает промис по готовности.

`then()` всегда возвращает новый промис; возвращённое из колбека значение станет аргументом следующего `then()` — так строят цепочки без Callback Hell:

```
// Предположим, что внутри файла был текст Hello
const promise = fsp.readFile(src, 'utf-8') // результат цепочки ВСЕГДА промис
  .then(content => `go to the next then with ${content}`) // игнорируем результат операции
  .then(text => console.log(text)) // в этот колбек, роль которого играет лог, передается значение с предыдущего then
// => go to the next then with Hello
// Вопрос на самопроверку.
// Что выведется на экран, если добавить к промису выше then(console.log)?
```

Если колбек вернёт промис, следующий `then` получит [результат этого промиса](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#return_value):

```
const promise = /* тут какая-то операция */
  // Из колбека возвращается промис
  .then(() => fsp.readFile(filePath))
  // В колбек попадает результат выполнения предыдущего промиса
  .then((text) => console.log(text));
```

Промис внутри функции делает её асинхронной: без возврата промиса нельзя дождаться результата и поймать ошибку:

```
// Неправильное определение

export const copy = (src, dest) => {
  fsp.readFile(src, 'utf-8')
    .then(content => fsp.writeFile(dest, content))
}

// Использование

// делаем что-то синхронное

copy(src, dest)

// делаем что-то еще
```

Появилась асинхронность — меняется структура: колбеки вложены, промисы выстраиваются в непрерывную цепочку.

```
// Правильное определение

export const copy = (src, dest) => {
  return fsp.readFile(src, 'utf-8')
    .then(content => fsp.writeFile(dest, content))
}

// Использование

// делаем что-то синхронное

copy(src, dest).then(() => {
  // делаем что-то еще
}).then(/* продолжаем */)
  .then(/* продолжаем */)
```

## Неправильное использование промисов

Плюс промисов — плоская цепочка вместо глубокой вложенности. На практике её легко сломать:

```
fsp.readFile('./first', 'utf-8')
  .then((data1) => {
    console.log(data1)
    // Читаем файл и продолжаем промис от этой внутренней функции
    return fsp.readFile('./second', 'utf-8').then((data2) => {
      console.log(data2)
      // Читаем файл и продолжаем промис от этой внутренней функции
      return fsp.readFile('./third', 'utf-8').then((data3) => {
        console.log(data3)
      })
    })
  })
```

Промисы есть, но код сложнее колбеков: продолжение идёт от внутренних операций, а не от верхней цепочки. Вложенность уместна только когда иначе нельзя:

```
// Плоская цепочка промисов
fsp.readFile('./first', 'utf-8')
  .then(data1 => console.log(data1))
  .then(() => fsp.readFile('./second', 'utf-8'))
  .then(data2 => console.log(data2))
  .then(() => fsp.readFile('./third', 'utf-8'))
  .then(data3 => console.log(data3))
```

---

### Дополнительные материалы

1. [promisejs.org](https://www.promisejs.org/)

## Далее →
