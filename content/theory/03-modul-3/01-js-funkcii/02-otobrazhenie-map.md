---
title: "Отображение (map)"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 0d85c417-acbc-4e9f-860a-60094f5d1cb4
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Отображение (map)

Возьмём список пользователей и получим из него только имена:

```
const users = [
  { name: 'Igor', age: 19 },
  { name: 'Danil', age: 1 },
  { name: 'Vovan', age: 4 },
  { name: 'Matvey', age: 16 },
]

const result = []
for (const user of users) {
  result.push(user.name)
}

console.log(result) // => ['Igor', 'Danil', 'Vovan', 'Matvey']
```

Здесь обычный обход `for...of` и накопление результата в массив. Если понадобится возраст — схема та же, меняется только извлекаемое поле:

```
const result = []
// Добавили деструктуризацию
for (const { age } of users) {
  result.push(age)
}

console.log(result) // => [19, 1, 4, 16]
```

В обоих примерах один проход по коллекции и сбор значений в `result`. Меняется лишь то, что мы достаём из каждого элемента.

Такую операцию называют **отображением** (mapping): исходный массив превращается в другой того же размера, применяя преобразование к каждому элементу.

Отображение в реальном коде встречается постоянно — для него есть функция высшего порядка [map()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map):

```
const names = users.map(user => user.name)
console.log(names) // => ['Igor', 'Danil', 'Vovan', 'Matvey']

const ages = users.map(user => user.age)
console.log(ages) // => [19, 1, 4, 16]

// Или что то же самое
const callback = user => user.age
console.log(users.map(callback)) // => [19, 1, 4, 16]
```

`map()` принимает функцию-колбек. Внутри метод обходит коллекцию, для каждого элемента вызывает колбек и складывает возвращённые значения в новый массив.

<!-- IMG (из Buildin, перезалить отдельно) -->
Сравните цикл и `map()`: второй вариант короче и не дублирует шаблон обхода — вы описываете только преобразование одного элемента.

В документации часто показывают арифметику над каждым элементом:

```
const numbers = [5, 2, 3]

const newNumbers = numbers.map(number => number ** 2)
console.log(newNumbers) // => [25, 4, 9]

const newNumbers2 = numbers.map(number => number + 3)
console.log(newNumbers2) // => [8, 5, 6]
```

Пример учебный, но хорошо показывает суть.

## Реализация

Своя `myMap()` по тому же принципу:

```
const myMap = (collection, callback) => {
  const result = []
  for (const item of collection) {
    // Вызов переданного колбека на каждом элементе коллекции
    const newItem = callback(item)
    // Возврат из колбека добавляется в результирующий массив
    result.push(newItem)
  }

  return result
}

const numbers = [5, 2, 3]
const newNumbers = myMap(numbers, number => number ** 2)
console.log(newNumbers) // => [25, 4, 9]
```

`myMap()` (как и встроенный `map()`) не знает, *что именно* делать с элементом — это задаёт переданный колбек. Ответственность за логику преобразования на стороне вызывающего кода.

---

### Дополнительные материалы

1. [Метод map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

## Далее →
