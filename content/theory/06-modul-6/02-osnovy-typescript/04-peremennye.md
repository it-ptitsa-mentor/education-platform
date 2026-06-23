---
title: "Переменные"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 295a9bb6-864d-42a7-9002-b65ffbaa14e9
---

# Переменные

В этом уроке мы узнаем, чем отличаются TypeScript и JavaScript в плане работы с переменными. Мы разберем, что такое вывод типов и зачем это нужно в программировании. Также узнаем, почему в TypeScript можно не указывать вручную тип переменных.

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

При этом TypeScript выполняет дополнительную работу на фоне. Он автоматически связывает переменную или константу с типом данных начального значения. В программировании такой процесс называется **выводом типов**. Тип переменной поменяться не может:

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

Статическая типизация накладывает ограничение на массивы. Внутри могут храниться данные только одного типа:

```javascript
const items = [1, 2, 3]
items.push(4) // Все хорошо

// Argument of type 'string' is not assignable to parameter of type 'number'.
items.push('code-basics') // Error!
```

С объектами ситуация еще строже. В TypeScript нельзя не только менять тип свойств внутри объекта, но и добавлять новые свойства динамически:

```javascript
const user = {
  firstName: 'Miro',
}

// Property 'lastName' does not exist on type '{ firstName: string; }'.
user.lastName = 'Smith'
```

## Явное указание типа

TypeScript позволяет явно указывать тип переменных. Но на практике это редко нужно делать вручную, потому что вывод типов работает автоматически:

```javascript
const name: string = 'Alice'
const count: number = 100
const canPlay: boolean = true
```

## Null

По умолчанию в TypeScript переменные могут содержать только указанный тип без исключений, например, мы не можем присвоить `null`:

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

Union Type — интересная и удобная концепция, которую мы рассмотрим подробнее позже.

В этом уроке мы познакомились с переменными в TypeScript. Мы узнали, чем в плане работы с ними TypeScript отличается от JavaScript. Кроме того, мы разобрались, почему в TypeScript можно не указывать тип переменных вручную.

## **Далее → **
