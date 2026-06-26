---
title: "Создание новых объектов и spread"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: 87ce7829-8abe-4bf9-aeb0-adc3285b9c2e
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Создание новых объектов и spread

Поверхностное копирование и слияние можно совместить в одну операцию. Так удобно обновлять данные в функциональном стиле: вместо правки старого объекта создаётся новый на его основе. Подробнее с такими задачами мы столкнёмся ближе к концу профессии, когда пойдёт речь о фреймворках. Пример:

```
const user = { name: 'Tirion', email: 'support@email.io', age: 44 }
const data = { name: 'Tirion 2', age: 33 }

// Новый объект: данные user дополнены полями из data
const copyOfUser = Object.assign({}, user, data)
```

В современном JavaScript для той же задачи есть **spread-оператор** (три точки `...` перед объектом в литерале). Копирование выглядит короче и нагляднее:

```
// Поверхностное копирование
const copyOfUser = { ...user }
// Object.assign({}, user);
```

Три точки «раскладывают» свойства переменной внутрь нового объекта. Получается только копия — существующий объект spread не меняет.

Им же удобно дополнять объект новыми полями:

```
const user = { name: 'Vasya', age: 11 }

const newUser = { ...user, married: true, age: 25 }
// Возраст поменялся
console.log(newUser) // => { name: 'Vasya', married: true, age: 25 }
```

Всё, что стоит справа от spread, при конфликте имён побеждает — как в `Object.assign()`. То, что слева, имеет меньший приоритет:

```
const user = { name: 'Vasya', age: 11 }

const newUser = { age: 25, married: true, ...user }
// Возраст остался тем же
console.log(newUser) // => { name: 'Vasya', married: true, age: 11 }
```

Свойства могут быть и слева, и справа от оператора:

```
const user = { name: 'Vasya', age: 11 }

const newUser = { age: 25, ...user, married: true }
// Возраст остался тем же
console.log(newUser) // => { name: 'Vasya', married: true, age: 11 }
```

В одном литерале spread можно использовать несколько раз:

```
const user = { name: 'Vasya', married: true, age: 25 }
const user2 = { name: 'Irina', surname: 'Petrova' }

const mergedObject = { ...user, ...user2 }
console.log(mergedObject)
// => { name: 'Irina', married: true, age: 25, surname: 'Petrova' }

// В обратном порядке
const mergedObject2 = { ...user2, ...user }
console.log(mergedObject2)
// => { name: 'Vasya', surname: 'Petrova', married: true, age: 25 }
```

Можно смешивать новые поля и несколько spread:

```
const user = { name: 'Irina', age: 25, married: false }
const user2 = { name: 'Petya', surname: 'Ivanov' }

const newUser = { ...user, married: true, ...user2 }
console.log(newUser)
// => { name: 'Petya', age: 25, married: true, surname: 'Ivanov' }
```

## Далее →
