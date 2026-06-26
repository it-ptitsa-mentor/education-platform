---
title: "Rest и деструктуризация"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 85e776c5-048e-477b-a028-86c2ca10e194
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Rest и деструктуризация

Деструктуризация раскрывается полностью вместе с синтаксисом rest. Rest «сворачивает» оставшиеся элементы при разложении — например, первый элемент отдельно, всё остальное в массив:

```
const fruits = ['apple', 'orange', 'banana', 'pineapple']

// ... – rest
const [first, ...rest] = fruits
console.log(first) // 'apple'
console.log(rest) // ['orange', 'banana', 'pineapple']
```

Запись `...rest` забирает все элементы, не разобранные ранее, в массив `rest` (имя любое). Rest срабатывает в конце, когда остальные позиции уже заняты — отсюда название *rest* (остаток).

Так можно разложить массив на несколько именованных значений плюс «хвост». У rest есть ограничение: он допустим только в конце списка слева.

```
const [head, ...tail] = fruits
// tail = ['orange', 'banana', 'pineapple']

const [first, second, ...rest] = fruits
// rest = ['banana', 'pineapple']

const [first, second, third, ...rest] = fruits
// rest = ['pineapple']

// Если элементов нет, то в rest окажется пустой массив
const [first, second, third, oneMore, ...rest] = fruits
// rest = []

// Можно пропускать элементы, ничего не указывая между запятыми. Ниже пропущен второй элемент
const [first, , third, ...rest] = fruits
// rest = ['pineapple']
```

Когда важна не первая часть, а «хвост», удобнее `slice()`:

```
// slice возвращает новый массив, а не изменяет старый
const rest = fruits.slice(1)
console.log(rest) // ['orange', 'banana', 'pineapple'];
```

Rest применим и к строкам при деструктуризации.

```
const [first, second, ...rest] = 'some string'
console.log(first) // => 's'
console.log(second) // => 'o'
console.log(rest) // => [ 'm', 'e', ' ', 's', 't', 'r', 'i', 'n', 'g' ]
```

После упаковки хвоста строки в `rest` получается массив символов, а не строка.

## Далее →
