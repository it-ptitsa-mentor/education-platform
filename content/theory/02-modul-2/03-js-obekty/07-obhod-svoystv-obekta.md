---
title: "Обход свойств объекта"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: a39c626c-aa39-442c-b011-51da21848e19
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Обход свойств объекта

В отличие от массива, объект — не коллекция в привычном смысле: циклом *for..of* по нему не пройтись, хотя задача «обойти все поля» частая — вывести их в консоль или обработать динамически добавленные ключи.

В JavaScript для этого есть несколько подходов. Самый прямой — *for..in*, похожий на обычный цикл:

```
const course = { name: 'JS: React', slug: 'js-react' }
for (const prop in course) {
  console.log(`course.${prop} = ${course[prop]}`)
}
// course.name = JS: React
// course.slug = js-react
```

Но *for..in* ведёт себя не так наивно: он перечисляет не только собственные свойства, но и унаследованные из прототипа. Прототипы мы разберём позже; кратко — объекты могут быть связаны цепочкой, и обращение к полю иногда неявно тянет значение «выше». На практике мы уже видели похожее, пока обходя тему стороной.

В большинстве задач перечислять прототипные поля не нужно — поэтому *for..in* используют реже, чем кажется. Чаще берут список ключей: `Object.keys(obj)` возвращает массив имён собственных свойств:

```
const course = { name: 'JS: React', slug: 'js-react' }

const keys = Object.keys(course) // [ 'name', 'slug' ]
```

Дальше — цикл по ключам и чтение значений. На практике ключи часто фильтруют, а затем обрабатывают исходный объект или строят новый:

```
for (const key of keys) {
  console.log(course[key])
}
```

Если сами ключи не нужны, подойдёт `Object.values(obj)` — сразу массив значений:

```
const course = { name: 'JS: React', slug: 'js-react' }

const values = Object.values(course) // [ 'JS: React', 'js-react' ]

for (const value of values) {
  console.log(value)
}
```

Ещё вариант — `Object.entries(obj)`: пары `[ключ, значение]` в виде массива массивов:

```
const course = { name: 'JS: React', slug: 'js-react' }

const entries = Object.entries(course)
// [[ 'name', 'JS: React' ], [ 'slug', 'js-react' ]]
```

Обойти такой список в `for...of` просто; с деструктуризацией — нагляднее:

```
for (const [key, value] of entries) {
  console.log(key)
  console.log(value)
}
```

Пример: функция `findKeys()`, возвращающая ключи, у которых значение совпадает с аргументом:

```
const lessonMembers = {
  syntax: 3,
  using: 2,
  foreach: 10,
  operations: 10,
  destructuring: 2,
  array: 2,
}

findKeys(lessonMembers, 10) // ['foreach', 'operations']
findKeys(lessonMembers, 3) // ['syntax']
```

Логика:

1. Обходим свойства объекта

1. Если значение в свойстве совпадает с переданным, то добавляем ключ в результат

```
const findKeys = (obj, expectedValue) => {
  const result = []

  const entries = Object.entries(obj)
  for (const [key, value] of entries) {
    if (value === expectedValue) {
      result.push(key)
    }
  }

  return result
}
```

## Порядок ключей

У массива порядок элементов строгий и предсказуемый. У объекта порядок ключей есть, но им напрямую не управляют — он следует внутренним правилам движка. Если порядок критичен, заводят отдельный массив ключей в нужной последовательности.

## Далее →
