---
title: "Promise.all"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: f5669d2d-665e-4cee-b4be-58b99d2c772d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Promise.all

Промисы, как и колбеки, позволяют гонять асинхронные операции параллельно — и умеют делать это без ручного учёта «кто уже закончил». Достаточно собрать массив промисов и передать в `Promise.all`: вернётся обычный промис, цепочку можно продолжать; в первом `then` — массив результатов всех операций.

```
import fsp from 'fs/promises'

const unionFiles = (inputPath1, inputPath2, outputPath) => {
  const promise1 = fsp.readFile(inputPath1, 'utf-8')
  const promise2 = fsp.readFile(inputPath2, 'utf-8')
  // На вход идет МАССИВ из промисов
  const promise = Promise.all([promise1, promise2])
  // Обязательно делать возврат!
  return promise.then(([data1, data2]) => fsp.writeFile(outputPath, `${data1}${data2}`))
}
```

Код короткий и понятный, без лишних переменных. `Promise.all` отдаёт данные в том же порядке, что промисы в массиве, но порядок **завершения** операций не гарантирует — всё стартует сразу, кто раньше закончит — неизвестно.

`Promise.all` не важно, как вы получили коллекцию — нужен только массив промисов. Легко сочетается с `map` и другими функциями. Ниже: массив путей, читаем файлы и выводим содержимое:

```
// promises – массив промисов
const promises = filepaths.map(filepath => fsp.readFile(filepath, 'utf-8'))
const promise = Promise.all(promises)
// Выводим на экран содержимое каждого файла
promise.then(contents => contents.map(console.log))
```

`map` обходит пути; каждый `fsp.readFile()` возвращает промис. Массив сразу после `map`:

```
const promises = filepaths.map((filepath) => fsp.readFile(filepath, 'utf-8'));
console.log(promises);
[
  Promise { <pending> },
  Promise { <pending> },
  Promise { <pending> },
  Promise { <pending> },
  ...
]
```

`Promise.all` запускает операции одновременно; они друг от друга не зависят. Ошибка в одном промисе не остановит остальные запросы, но весь `Promise.all` станет rejected — управление уйдёт в ближайший `catch`. Чтобы этого избежать, в массив можно класть промисы с `catch`, возвращающим пометку успеха/ошибки:

```
const promises = filepaths.map(filepath => fsp.readFile(filepath, 'utf-8')
  .then(v => ({ result: 'success', value: v }))
  .catch(e => ({ result: 'error', error: e })))
const promise = Promise.all(promises)
```

---

### Дополнительные материалы

1. [Promise.all](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

## Далее →
