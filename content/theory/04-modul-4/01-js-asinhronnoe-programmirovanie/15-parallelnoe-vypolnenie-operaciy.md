---
title: "Параллельное выполнение операций"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: f5de20f4-9185-4d2a-944b-894ac5adb851
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Параллельное выполнение операций

Запустим несколько асинхронных вызовов сразу и используем общий результат. Перепишем задачу объединения файлов:

> Предположим, что перед нами стоит задача прочитать содержимое двух файлов и записать в третий (объединение файлов)

Оба исходных файла можно читать параллельно; запись в третий — только когда оба прочитаны.

```
fs.readFile('./first', 'utf-8', (_error1, data1) => {
  // ?
})

fs.readFile('./second', 'utf-8', (_error2, data2) => {
  // ?
})
```

Результат каждой операции доступен только в колбеке. Порядок вызова колбеков непредсказуем — зависит от скорости чтения. Нужно **глобальное состояние** относительно этих операций: счётчик завершений и буфер данных. Когда всё готово — пишем файл. Данные первого и второго файла нужно различать: порядок при записи фиксирован, при чтении — нет.

```
const state = {
  count: 0,
  results: [],
}

fs.readFile('./first', 'utf-8', (_error1, data1) => {
  state.count += 1
  state.results[0] = data1
})

fs.readFile('./second', 'utf-8', (_error2, data2) => {
  state.count += 1
  state.results[1] = data2
})
```

Когда обе операции завершатся, `count` станет `2` — на это и завяжем логику:

```
import fs from 'fs'

const state = {
  count: 0,
  results: [],
}

const tryWriteNewFile = () => {
  if (state.count !== 2) {
    return // guard expression
  }

  fs.writeFile('./new-file', state.results.join(''), (error) => {
    if (error) {
      return
    }
    console.log('finished!')
  })
}

console.log('first reading was started')
fs.readFile('./first', 'utf-8', (error1, data1) => {
  console.log('first callback')
  if (error1) {
    return
  }
  state.count += 1
  state.results[0] = data1
  tryWriteNewFile()
})

console.log('second reading was started')
fs.readFile('./second', 'utf-8', (error2, data2) => {
  console.log('second callback')
  if (error2) {
    return
  }
  state.count += 1
  state.results[1] = data2
  tryWriteNewFile()
})

// Один запуск
// node index.js
// first reading was started
// second reading was started
// second callback
// first callback
// finished!

// Другой запуск
// node index.js
// first reading was started
// second reading was started
// first callback
// second callback
// finished!
```

Чтение идёт параллельно — на практике видно выигрыш перед синхронным вариантом; на больших файлах разница заметнее. Обработка результатов в JS всё равно последовательна: колбеки стартуют после опустошения стека, в порядке завершения IO (параллельный старт не значит одновременный финиш).

Писать так каждый раз утомительно — помогает библиотека [async](https://caolan.github.io/async/) с готовыми абстракциями для упорядочивания асинхронных операций:

```
import { map } from 'async'
import fs from 'fs'

map(['./first', './second'], fs.readFile, (err1, results) => {
  if (err1) {
    return
  }
  fs.writeFile('./new-file', results.join(''), (err2) => {
    if (err2) {
      return
    }
    console.log('finished!')
  })
})
```

Значительно короче — но дальше по курсу пойдём ещё проще.

---

### Дополнительные материалы

1. [async — библиотека для работы в асинхронном стиле](https://caolan.github.io/async/)

## Далее →
