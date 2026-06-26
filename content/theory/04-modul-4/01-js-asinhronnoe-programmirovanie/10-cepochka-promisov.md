---
title: "Цепочка промисов"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: a574d7a2-4063-43b0-81db-a94a0e621787
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Цепочка промисов

С промисами не всегда очевидно, как выстроить асинхронный код. Разберём практики на задаче объединения двух файлов:

```
import fs from 'fs'

const unionFiles = (inputPath1, inputPath2, outputPath, cb) => {
  fs.readFile(inputPath1, 'utf-8', (error1, data1) => {
    if (error1) {
      cb(error1)
      return
    }
    fs.readFile(inputPath2, 'utf-8', (error2, data2) => {
      if (error2) {
        cb(error2)
        return
      }
      fs.writeFile(outputPath, `${data1}${data2}`, cb)
    })
  })
}
```

Проведём рефакторинг к каноническому промис-стилю. Первая версия:

```
import fsp from 'fs/promises'

const unionFiles = (inputPath1, inputPath2, outputPath) => {
  // Промисы всегда должны возвращаться и строиться в цепочку!
  const result = fsp.readFile(inputPath1, 'utf-8')
    .then((data1) => {
      const promise = fsp.readFile(inputPath2, 'utf-8')
        .then(data2 => fsp.writeFile(outputPath, `${data1}${data2}`))
      return promise
    })
  return result // это промис
}
```

Код короче, обработка ошибок уходит к вызывающему через `catch()`. Но структура всё ещё «лесенка» — не использовано свойство возврата из `then()`.

```
import fsp from 'fs/promises'

const unionFiles = (inputPath1, inputPath2, outputPath) => {
  const result = fsp.readFile(inputPath1, 'utf-8')
    .then(data1 => fsp.readFile(inputPath2, 'utf-8'))
    // then ниже берется от промиса readFile
    .then(data2 =>
      // как сюда может попасть data1?
      fsp.writeFile(outputPath, `${data1}${data2}`),
    )
  return result
}
```

Цепочка плоская — к этому стремятся. Проблема: `data1` из верхнего шага недоступна при записи. Решение — переменная снаружи:

```
import fsp from 'fs/promises'

const unionFiles = (inputPath1, inputPath2, outputPath) => {
  let data1
  return fsp.readFile(inputPath1, 'utf-8')
    .then((content) => {
      data1 = content
    })
    .then(() => fsp.readFile(inputPath2, 'utf-8'))
    .then(data2 => fsp.writeFile(outputPath, `${data1}${data2}`))
}
```

Менее изящно, но плоско; выигрыш растёт с длиной цепочки.

## Контроль асинхронных операций

Частая ошибка — потеря контроля:

```
import fsp from 'fs/promises'

// Чего здесь не хватает?
const unionFiles = (inputPath1, inputPath2, outputPath) => {
  const result = fsp.readFile(inputPath1, 'utf-8')
    .then((data1) => {
      const promise = fsp.readFile(inputPath2, 'utf-8')
        .then(data2 => fsp.writeFile(outputPath, `${data1}${data2}`))
    })
  return result
}
```

Внутренний промис не возвращён — цепочка оборвана. Ошибки там не дойдут до вызывающего; нет гарантии завершения к ожидаемому моменту.

Нарушение непрерывности встречается и у опытных разработчиков: иногда падает сразу, иногда — «плавающие» сбои. Каждое завершение должно к чему-то привязано; кто-то всегда ждёт.

## Динамическая цепочка

Число шагов может быть неизвестно, но порядок строгий. Подойдут цикл или `reduce`; принцип тот же — *then().then().then()...*

Нужен стартовый промис. Если его нет — `Promise.resolve()`:

```
const filePaths = /* список путей до файлов */;

// Эта функция принимает на вход необязательное значение,
// которое появится в promise.then((<тут>) => ...)
// Начальное значение в данном случае – массив,
// в котором накапливаются данные из файлов
const initPromise = Promise.resolve([]);

// В then отдается функция, а не ее вызов!
const promise = filePaths.reduce((acc, path) => {
  // Аккумулятор – всегда промис, внутри которого массив с содержимым файлов
  const newAcc = acc.then((contents) =>
    // Читаем файл и добавляем его данные в аккумулятор
    fsp.readFile(path, 'utf-8').then((data) => contents.concat(data)));
  return newAcc;
}, initPromise);

// Если надо, продолжаем обработку
promise.then((contents) => /* обрабатываем все данные полученные из файлов */);
```

## Дополнительные материалы

- [Promise.prototype.then — return value (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#return_value)

## Далее →
