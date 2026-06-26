---
title: "Фильтрация (filter)"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 031a2407-11d3-4145-ad6c-e555b855a771
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Фильтрация (filter)

Идея фильтрации знакома из быта: мы отсеиваем лишнее — в воде, в речи, в данных. В программировании фильтрация коллекции означает оставить только те элементы, которые удовлетворяют заданному условию. Типичная задача: выбрать пользователей старше 10 лет:

```
const users = [
  { name: 'Igor', age: 19 },
  { name: 'Danil', age: 1 },
  { name: 'Vovan', age: 4 },
  { name: 'Matvey', age: 16 },
]

const result = []
for (const user of users) {
  if (user.age > 10) {
    result.push(user)
  }
}

console.log(result)
// => [ { name: 'Igor', age: 19 }, { name: 'Matvey', age: 16 } ]
```

Фильтрация встречается также часто, как отображение. Общая схема кода почти совпадает с отображением, но есть два важных отличия:

- Результат фильтрации — коллекция того же типа: либо исходного размера (если ничего не отбросили), либо меньше. Возможен и пустой массив, когда ни один элемент не прошёл проверку.

- Фильтрация возвращает сами исходные элементы, а не преобразованные. На входе список пользователей — на выходе тоже список пользователей, без `map()`.

<!-- IMG (из Buildin, перезалить отдельно) -->
С методом `filter()` та же логика выглядит короче:

```
const filteredUsers = users.filter(user => user.age > 10)
```

Функция, которую передают в `filter()`, должна быть предикатом: для каждого элемента она возвращает `true` или `false`. Возвращаемое значение не попадает в результат — оно лишь решает, включать элемент в новый массив или нет. Начинающие часто путают фильтр с отображением и возвращают из колбэка то, что хотят видеть в итоге (для этого нужен `map()`).

## Реализация

Реализуем свою `myFilter` по аналогии со встроенным `filter`:

```
const myFilter = (collection, callback) => {
  const result = []
  for (const item of collection) {
    // Предикат используется только для проверки
    // Внутрь callback по очереди передается каждый элемент коллекции collection
    if (callback(item)) {
      // В результат всегда добавляется элемент исходной коллекции
      result.push(item)
    }
  }

  return result
}

const users = [
  { name: 'Igor', age: 19 },
  { name: 'Danil', age: 1 },
  { name: 'Vovan', age: 4 },
  { name: 'Matvey', age: 16 },
]

const filteredUsers = myFilter(users, user => user.age > 10)
console.log(filteredUsers)
// [
//   { name: 'Igor', age: 19 },
//   { name: 'Matvey', age: 16 },
// ]
```

---

### Дополнительные материалы

1. [Метод filter](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

## Далее →
