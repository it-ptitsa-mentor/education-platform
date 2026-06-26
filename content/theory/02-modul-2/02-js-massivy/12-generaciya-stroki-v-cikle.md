---
title: "Генерация строки в цикле"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 0be25fc5-b31f-48a8-8a1f-c4f3dbd10194
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Генерация строки в цикле

Собрать строку в цикле — частая задача. Пример: список дел с заголовком и напоминанием:

```
const coll = ['Покормить кота', 'Купить молоко', 'Сделать уборку']

buildTodoList(coll)
// Список дел:
//   * Покормить кота
//   * Купить молоко
//   * Сделать уборку
// Напоминание: дела нужно выполнить сегодня. Не откладывать на завтра!
```

Наивный план:

1. Переменная `result` со строкой «Список дел на сегодня:»

1. Цикл: дописывать `\n  * ` и очередной пункт

1. В конце — напоминание и `return result`

```
const buildTodoList = (coll) => {
  let result = 'Список дел на сегодня:'
  for (const item of coll) {
    result = `${result}\n  * ${item}`
    // либо так: result += `\n  * ${item}`;
  }
  result = `${result}\nНапоминание: дела нужно выполнить сегодня. Не откладывать на завтра!`

  return result
}
```

Работает, но в большинстве языков это неэффективно: конкатенация и интерполяция создают новую строку на каждой итерации, а строка растёт. Для малых данных это редко критично, но лучше сразу привыкнуть к другому способу.

В динамических языках удобнее накапливать **массив** фрагментов и склеить через `join()`:

```
const buildTodoList = (coll) => {
  const parts = []
  for (const item of coll) {
    parts.push(`* ${item}`)
  }

  // Метод join объединяет элементы массива в строку
  // В качестве разделителя между значениями
  // используется то, что передано параметром. В нашем случае — это перевод строки
  const innerValue = parts.join('\n')
  const result = `Список дел:\n${innerValue}\nНапоминание: дела нужно выполнить сегодня. Не откладывать на завтра!`
  return result
}
```

Код почти той же длины, но сначала массив, потом одна склейка через [join()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/join). Плюсы:

- Проще отлаживать — массив виден целиком

- С массивом можно ещё что-то сделать; готовая строка — почти нет

Разделитель в `join` задаёт формат:

```
const parts = ['JavaScript', 'PHP', 'Python']
const output = parts.join(', ')

console.log(output) // => JavaScript, PHP, Python
```

Каждое слово с новой строки — разделитель `'\n'`:

```
const parts = ['JavaScript', 'PHP', 'Python']

// теперь каждое слово будет начинаться с новой строки
const output = parts.join('\n')

console.log(output) // =>
// JavaScript
// PHP
// Python
```

Частая ошибка: вставлять `\n` в `push`, а не в `join`:

```
// Неправильно

const parts = []
for (const item of coll) {
  parts.push(`\n  * ${item}`)
}
const innerValue = parts.join('') // разделителя нет

// Правильно

const parts = []
for (const item of coll) {
  parts.push(`* ${item}`)
}
const innerValue = parts.join('\n') // перевод строки
```

---

### Дополнительные материалы

1. [Джоэль Спольски. Назад к основам (английская версия)](https://www.joelonsoftware.com/2001/12/11/back-to-basics/)

## Далее →
