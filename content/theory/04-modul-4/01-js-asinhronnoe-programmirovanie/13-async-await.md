---
title: "Async/Await"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: d3ae4502-4e59-4d5d-8c22-a8812325b5a8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Async/Await

Промисы удобны, но не предел. У них остаются минусы:

- Отдельная обработка ошибок в обход *try/catch* — в одном проекте смешиваются оба стиля

- Данные с верхних шагов цепочки неудобно тащить вниз — часто нужны переменные снаружи промиса

- Без дисциплины снова появляется вложенность

*async/await* снимает эти проблемы: код с промисами читается почти как синхронный. Задача объединения двух файлов на промисах:

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

Тот же сценарий на *async/await* (механизм работает поверх промисов):

```
import fsp from 'fs/promises'

const unionFiles = async (inputPath1, inputPath2, outputPath) => {
  // Очень важный момент. Так же как и в примере выше,
  // эти запросы выполняются строго друг за другом
  // (хотя при этом не блокируется программа, это значит,
  // что другой код тоже может выполняться во время этих запросов)
  const data1 = await fsp.readFile(inputPath1, 'utf-8')
  const data2 = await fsp.readFile(inputPath2, 'utf-8')
  await fsp.writeFile(outputPath, `${data1}${data2}`)
}
```

Визуально почти как синхронный вариант — при этом операции асинхронны.

`async` перед функцией: она всегда возвращает промис (`const promise = unionFiles(...)`). Явный `return` не обязателен — результат всё равно обернётся в промис.

`await` ставят перед вызовами, возвращающими промис. При присваивании в переменную попадает разрешённое значение; без присваивания — просто ждём завершения.

Асинхронность не блокирует весь процесс, но внутри одной `async`-функции подряд идущие `await` выполняются строго по очереди, не параллельно. Удобно думать: каждый следующий шаг — как ещё один `then`.

Ошибки — обычный *try/catch*:

```
import fsp from 'fs/promises'

const unionFiles = async (inputPath1, inputPath2, outputPath) => {
  try {
    const data1 = await fsp.readFile(inputPath1, 'utf-8')
    const data2 = await fsp.readFile(inputPath2, 'utf-8')
    await fsp.writeFile(outputPath, `${data1}${data2}`)
  }
  catch (e) {
    console.log(e)
    throw e // снова бросаем,
    // потому что вызывающий код должен иметь возможность отловить ошибку
  }
}
```

Для параллельного чтения без `Promise.all` не обойтись:

```
const unionFiles = async (inputPath1, inputPath2, outputPath) => {
  // Эти вызовы начинают чтение почти одновременно и не ждут друг друга
  const promise1 = fsp.readFile(inputPath1, 'utf-8')
  const promise2 = fsp.readFile(inputPath2, 'utf-8')
  // Теперь дожидаемся, когда они оба завершатся
  // Данные можно сразу разложить
  const [data1, data2] = await Promise.all([promise1, promise2])
  await fsp.writeFile(outputPath, `${data1}${data2}`)
}
```

Итог: *async/await* выравнивает код, возвращает *try/catch* и упрощает работу с промежуточными данными.

```
// Код на колбеках
import fs from 'fs'

fs.readFile('./first', 'utf-8', (error1, data1) => {
  if (error1) {
    console.log('boom!')
    return
  }
  fs.readFile('./second', 'utf-8', (error2, data2) => {
    if (error2) {
      console.log('boom!')
      return
    }
    fs.writeFile('./new-file', `${data1}${data2}`, (error3) => {
      if (error3) {
        console.log('boom!')
      }
    })
  })
})

// Код на промисах
import fsp from 'fs/promises'

let data1
fsp.readFile('./first', 'utf-8')
  .then((d1) => {
    data1 = d1
    return fsp.readFile('./second', 'utf-8')
  })
  .then(data2 => fsp.writeFile('./new-file', `${data1}${data2}`))
  .catch(() => console.log('boom!'))

// Код на async/await
import fsp from 'fs/promises'

// В реальной жизни чтение файлов лучше выполнять параллельно,
// как в функции unionFiles выше
const data1 = await fsp.readFile('./first', 'utf-8')
const data2 = await fsp.readFile('./second', 'utf-8')
await fsp.writeFile('./new-file', `${data1}${data2}`)
```

*async/await* не заменяет промисы — это синтаксический сахар над ними.

## Далее →
