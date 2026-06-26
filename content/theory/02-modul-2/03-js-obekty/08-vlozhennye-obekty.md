---
title: "Вложенные объекты"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: cf2ad969-d39e-4cb3-8270-3384cdcad509
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Вложенные объекты

Значением свойства может быть что угодно — в том числе другой объект или массив:

```
const user = { name: 'Vasya', married: true, age: 25 }

// Добавим свойство friends со списком друзей
user.friends = ['Kolya', 'Petya']

// Добавим свойство children со списком детей,
// каждый ребёнок представлен отдельным объектом
user.children = [
  { name: 'Mila', age: 1 },
  { name: 'Petr', age: 10 },
]

// Добавим вложенный объект
user.company = { name: 'Pivozavr' }

console.log(user) // =>
// {
//   name: 'Vasya',
//   married: true,
//   age: 25,
//   friends: [ 'Kolya', 'Petya' ],
//   children: [ { name: 'Mila', age: 1 }, { name: 'Petr', age: 10 }],
//   company: { name: 'Pivozavr' }
// }
```

То же можно описать сразу при создании:

```
const user = {
  name: 'Vasya',
  married: true,
  age: 25,
  friends: ['Kolya', 'Petya'],
  children: [
    { name: 'Mila', age: 1 },
    { name: 'Petr', age: 10 },
  ],
  company: {
    name: 'Pivozavr',
  },
}
```

К вложенным данным обращаются цепочкой:

```
user.friends[1] // 'Petya'
user.children[0].name // 'Mila'
user.company.name // 'Pivozavr'

// Или через квадратные скобки
user['children'][0]['name'] // 'Mila'
```

## Печать на экран

У `console.log()` есть ограничение: при глубине вложенности больше второго уровня вместо вложенных объектов показывается `[Object]`, вместо массивов — `[Array]`.

```
const obj = { a: { b: { c: { key: 'value' }, e: [1, 2] } } }
console.log(obj)
// { a: { b: { c: [Object], e: [Array] } } }
```

Для полного вывода удобен JSON:

```
console.log(JSON.stringify(obj))
// {"a":{"b":{"c":{"key":"value"},"e":[1,2]}}}

// Или форматированный вывод
console.log(JSON.stringify(obj, null, '  '))
// {
//   "a": {
//     "b": {
//       "c": {
//         "key": "value"
//       },
//       "e": [
//         1,
//         2
//       ]
//     }
//   }
// }
```

## Проверки в глубину

С вложенностью усложняется проверка существования ключей — приходится выстраивать цепочку условий. Допустим, нужен четвёртый уровень, и мы не уверены в промежуточных объектах:

```
// Добираемся до obj.one.two.three
if (Object.hasOwn(obj, 'one')) {
  if (Object.hasOwn(obj.one, 'two')) {
    if (Object.hasOwn(obj.one.two, 'three')) {
      // ...
    }
  }
}
```

Так выглядит «в лоб». Ниже — более удобные варианты.

### Оператор опциональной последовательности

Если цель — прочитать данные, а не только проверить их наличие, помогает [оператор опциональной последовательности](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (optional chaining) — доступ к вложенным полям без лестницы из `if`:

```
const obj = {}
obj?.one?.two?.three // undefined
```

Оператор не бросает ошибку: работает с любыми типами и возвращает `undefined` или найденное значение.

Подход к динамическим ключам тот же:

```
const obj = {}
const key = 'one'
obj?.[key]?.two?.three // undefined
```

### Оператор нулевого слияния

Вместе с нулевым слиянием можно задать значение по умолчанию для всей цепочки:

```
const obj = {}
obj?.one?.two?.three ?? 'defaultValue' // 'defaultValue'
```

Подстановка срабатывает только при `undefined` или `null` слева — в отличие от `||`:

```
const value = false

value ?? 'default' // false
value || 'default' // 'default'
```

### get (lodash)

Длинные цепочки `?.` и `??` перегружают текст. Альтернатива — `get()` из Lodash:

```
import _ from 'lodash'

const obj = {}

const value = _.get(obj, 'one.two.three', 'defaultValue') // 'defaultValue'
```

При динамических ключах вторым аргументом передают массив:

```
_.get(obj, ['one', 'two', 'three'], 'defaultValue') // 'defaultValue'
```

---

### Дополнительные материалы

1. [Функция get из библиотеки Lodash](https://lodash.com/docs/#get)

1. [Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

## Далее →
