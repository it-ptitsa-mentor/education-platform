---
title: "Переменные"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 295a9bb6-864d-42a7-9002-b65ffbaa14e9
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Переменные

Разберём отличия TypeScript от JavaScript при работе с переменными: вывод типов и когда аннотации не обязательны.

## Вывод типов

Переменные и константы в TypeScript определяются так же, как и в JavaScript:

```javascript
const age = 10

const company = 'Hexlet'
const user = {
  firstName: 'Miro',
}
const fruits = ['apple', 'banana']
```

TypeScript связывает имя с типом начального значения — это **вывод типов**. Тип переменной после этого фиксирован:

```javascript
let age = 10
// Все нормально, тип тот же (Number)
age = 11.1

// Type 'string' is not assignable to type 'number'.
age = 'some string' // Error!
```

Если мы попытаемся передать эту переменную в метод, который ожидает другой тип, то это тоже приведет к ошибке:

```javascript
// Argument of type 'number' is not assignable to parameter
// of type '(substring: string, ...args: any[])
'hexlet'.replace('xl', age)
```

Массивы в статической типизации хранят элементы одного типа:

```javascript
const items = [1, 2, 3]
items.push(4) // Все хорошо

// Argument of type 'string' is not assignable to parameter of type 'number'.
items.push('code-basics') // Error!
```

С объектами правила жёстче: нельзя менять тип полей и добавлять новые свойства «на лету»:

```javascript
const user = {
  firstName: 'Miro',
}

// Property 'lastName' does not exist on type '{ firstName: string; }'.
user.lastName = 'Smith'
```

## Явное указание типа

Тип можно указать явно, но чаще достаточно вывода:

```javascript
const name: string = 'Alice'
const count: number = 100
const canPlay: boolean = true
```

## Null

По умолчанию в переменную нельзя записать `null`, если тип этого не допускает:

```javascript
let age = 30
age = null // Error!
```

Такое поведение защищает нас от большого числа ошибок, связанных с отсутствием проверок на `null`. При этом `null` иногда является допустимым значением. В этом случае используется специальный Union Type:

```javascript
let age: number | null = 30
age = null
```

Здесь мы указали, что тип у переменной `age` — это `number | null`. Читается это так: «число или null».

Union Type — интересная и удобная концепция, которую мы разберём подробнее позже.

Итог: переменные в TypeScript похожи на JavaScript, но типы выводятся и проверяются компилятором; ручные аннотации часто не нужны.

## **Далее → **
