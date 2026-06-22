---
title: "8. Объектные типы"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 2656ad7d-fa62-4cd9-8768-f27124280009
---

# 8. Объектные типы

В этом уроке разберем типы объекта. Они состоят из типов всех входящих в него свойств. Выводятся типы автоматически:

```javascript
// Тип: { firstName: string, pointsCount: number }
const user = {
  firstName: 'Mike',
  pointsCount: 1000,
}

// Поменять тип свойств нельзя
// Type 'number' is not assignable to type 'string'.
user.firstName = 7
```

TypeScript не позволяет обращаться к несуществующим свойствам. Это значит, что структура любого объекта должна быть задана при его инициализации:

```javascript
// Property 'age' does not exist on type '{ firstName: string, pointsCount: number; }'.
user.age = 100
```

Чтобы принять такой объект в функцию как параметр, нужно указать его структуру в описании функции:

```javascript
// Свойства в описании типа разделяются через запятую
function doSomething(user: { firstName: string, pointsCount: number }) {
  // ...
}
```

Теперь внутрь можно передавать любой объект, который совпадает по свойствам:

```javascript
doSomething({ firstName: 'Alice', pointsCount: 2000 })
doSomething({ firstName: 'Bob', pointsCount: 1800 })

// Так нельзя
doSomething({ firstName: 'Bob' })
// И так тоже
doSomething({ firstName: 'Bob', pointsCount: 1800, key: 'another' })
```

Как и в случае примитивных типов данных, `null` и `undefined` по умолчанию не разрешены. Чтобы изменить это поведение, нужно добавить опциональность:

```javascript
// firstName может быть undefined
// pointsCount может быть null
function doSomething(user: { firstName?: string, pointsCount: number | null }) {
  // ...
}
```

Объекты могут быть полезными инструментами при разработке программного обеспечения.

## **Далее → **
