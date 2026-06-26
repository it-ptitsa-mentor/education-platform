---
title: "Проверка существования свойства"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: 9650e3e2-db6f-46e7-a3ca-9baaace25be1
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Проверка существования свойства

Иногда нужно убедиться, что свойство есть, и выполнить отдельную логику, если его нет. Проще всего сравнить значение с `undefined`, но это не универсальный приём — в отдельных случаях он даст неверный результат.

```
if (obj.key === undefined) {
  // логика
}
```

Возьмём функцию, считающую, сколько раз каждый элемент встречается в массиве:

```
// Вход

const fruits = [
  'apple', 'banana', 'pear',
  'apricot', 'apple', 'banana',
  'apple', 'orange', 'pear',
]

// Выход

const result = {
  apple: 3,
  banana: 2,
  pear: 2,
  orange: 1,
  apricot: 1,
}
```

Алгоритм простой, но есть нюанс. При обходе массива функция берёт объект-результат, читает свойство по имени фрукта и увеличивает счётчик — если свойство уже было. Если нет — создаёт его со значением 1. Реализация:

```
const countFruits = (fruits) => {
  const result = {}

  for (const name of fruits) {
    // Проверка на существование
    if (result[name] === undefined) {
      result[name] = 1
    }
    else {
      result[name] += 1
    }
  }

  return result
}
```

Здесь сравнение с `undefined` сработает, потому что в счётчике не бывает `undefined` как осмысленного значения. Но представьте другой случай:

```
const obj = {
  key: doSomething(),
}
```

Значением `key` станет результат `doSomething()`. Если функция вернёт `undefined`, ключ формально есть, а значение — `undefined`.

Надёжнее проверять наличие свойства без сравнения значений — метод [Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn). С ним `countFruits` выглядит так:

```
const countFruits = (fruits) => {
  const result = {}

  for (const name of fruits) {
    // Проверка на существование
    if (Object.hasOwn(result, name)) {
      result[name] += 1
    }
    else {
      result[name] = 1
    }
  }

  return result
}
```

## Оператор нулевого слияния

В задаче с фруктами в результирующем объекте не может оказаться «просто так» `undefined` — там всегда число от единицы. Более того, отдельная проверка избыточна: достаточно читать текущее значение с подстановкой по умолчанию. Для этого есть [оператор нулевого слияния](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing): он подставляет значение справа, если слева `null` или `undefined`.

```
let value

value ?? 'wow' // 'wow'

value = null
value ?? 'wow' // 'wow'

value = true
value ?? 'wow' // true
```

```
for (const name of fruits) {
  result[name] = (result[name] ?? 0) + 1
}
```

---

### Дополнительные материалы

1. [Функция has из библиотеки Lodash](https://lodash.com/docs/#has)

1. [Оператор for...of](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/for...of)

## Далее →
