---
title: "Вложенные объекты"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: cf2ad969-d39e-4cb3-8270-3384cdcad509
---

# Вложенные объекты

- [Печать на экран](https://buildin.ai/cf2ad969-d39e-4cb3-8270-3384cdcad509#5e64e2fe-4b38-44c3-9ed2-4f059092672f)

- [Проверки в глубину](https://buildin.ai/cf2ad969-d39e-4cb3-8270-3384cdcad509#927eb138-9e4f-4737-ab32-ee56cd8ea539)
  - [Оператор опциональной последовательности](https://buildin.ai/cf2ad969-d39e-4cb3-8270-3384cdcad509#509c9284-3bcd-4994-9e17-d8aa16179bd8)
  - [Оператор нулевого слияния](https://buildin.ai/cf2ad969-d39e-4cb3-8270-3384cdcad509#0ecec618-0186-4109-8b9d-0e2ddda4798a)
  - [get (lodash)](https://buildin.ai/cf2ad969-d39e-4cb3-8270-3384cdcad509#229d176f-d97e-499d-abec-276c4dff867f)

Значением свойства объекта может быть всё, что угодно, включая другой объект или массив:

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

Все то же самое можно определить сразу при создании объекта:

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

В этом случае обращение к вложенным элементам происходит по цепочке:

```
user.friends[1] // 'Petya'
user.children[0].name // 'Mila'
user.company.name // 'Pivozavr'

// Или через квадратные скобки
user['children'][0]['name'] // 'Mila'
```

## Печать на экран

В `console.log()` встроено одно ограничение. Если в объекте есть другие объекты на глубине больше второго уровня вложенности, то при выводе такого объекта на экран вместо объектов отобразится строка `[Object]`, а вместо массива — `[Array]`.

```
const obj = { a: { b: { c: { key: 'value' }, e: [1, 2] } } }
console.log(obj)
// { a: { b: { c: [Object], e: [Array] } } }
```

Для вывода таких объектов можно воспользоваться функцией преобразования в JSON:

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

При работе с вложенными объектами резко усложняется задача проверки существования ключей. Приходится строить цепочку из условий до нужного свойства. Представьте, что нам нужно добраться до 4 уровня вложенности и мы не уверены в том, что существуют все промежуточные объекты:

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

Так будет выглядеть решение в лоб. Однако, есть более удобный способ, речь о котором ниже.

### Оператор опциональной последовательности

Если задача состоит в том, чтобы извлечь данные, а не просто проверить их существование, то можно пойти другим путем. В Javascript встроен [оператор опциональной последовательности](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (optional chaining), который позволяет извлекать вложенные данные без проверок:

```
const obj = {}
obj?.one?.two?.three // undefined
```

Этот оператор никогда не приводит к ошибке. Он работает на любых типах данных и всегда возвращает либо `undefined`, либо значение указанного свойства, если оно существует.

Оператор не меняет общий подход работы с ключами в объектах. Этот же пример с динамическим ключом:

```
const obj = {}
const key = 'one'
obj?.[key]?.two?.three // undefined
```

### Оператор нулевого слияния

С помощью оператора нулевого слияния, можно не только получить значение цепочки любой вложенности, но и определить значение по умолчанию для него.

```
const obj = {}
obj?.one?.two?.three ?? 'defaultValue' // 'defaultValue'
```

Значение по умолчанию возвращается только в том случае, когда слева `undefined` или `null`. В этом смысле данный оператор совсем не похож на логическое сравнение `||`:

```
const value = false

value ?? 'default' // false
value || 'default' // 'default'
```

### get (lodash)

Пример выше перегружен символами и выглядит достаточно сложно. Как альтернативу можно использовать функцию `get()` библиотеки Lodash.

```
import _ from 'lodash'

const obj = {}

const value = _.get(obj, 'one.two.three', 'defaultValue') // 'defaultValue'
```

`get()` особенно удобен в случае динамических ключей. В таком случае вторым аргументом можно передать массив ключей:

```
_.get(obj, ['one', 'two', 'three'], 'defaultValue') // 'defaultValue'
```

---

### Дополнительные материалы

1. [Функция get из библиотеки Lodash](https://lodash.com/docs/#get)

1. [Чем отличаются методы hasOwn() и hasOwnProperty()](https://ru.hexlet.io/qna/javascript/questions/chem-otlichaetsya-object-hasown-i-object-prototype-hasownproperty)

## Далее →
