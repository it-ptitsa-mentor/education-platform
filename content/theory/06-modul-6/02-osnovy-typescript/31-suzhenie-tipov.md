---
title: "Сужение типов"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: c4a97834-5998-4381-bad4-3f7e41fb0399
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Сужение типов

Сужение типов (type narrowing) после проверок.

## Использование сужения типа

В JavaScript часто встречается код, в котором в одних и тех же переменных могут быть значения разных типов. Они обрабатываются на основе логических проверок с помощью `typeof` и других подобных механизмов.

Ниже пример реализации функции, которая конвертирует любое переданное значение в `boolean`:

```
function isPresence(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }
  // Пустая строка
  if (typeof value === 'string') {
    if (value === '') {
      return false
    }
  }
  // Пустой массив
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return false
    }
  }
  // Пустой объект
  if (value instanceof Object) {
    if (Object.keys(value).length === 0) {
      return false
    }
  }

  return true
}

isPresence('') // false
isPresence({}) // false
isPresence([]) // false
isPresence([1, 3]) // true
isPresence(10) // true
```

В этом коде параметр имеет тип `unknown`. Внутри TypeScript позволяет выполнять с этим параметром разные действия. Они будут зависеть от заданных условий.

В этом случае проверка типов выполняется статически до запуска кода. А условия внутри функции — это часть кода, который выполняется в рантайме, то есть во время запуска программы. Получается, что такой код должен был бы завершиться с ошибкой, но этого не происходит.

Поскольку подобный код в JavaScript встречается часто, систему типов TypeScript пришлось доработать так, чтобы осталась возможность писать подобный код.

В данном случае оказывается, что TypeScript умеет выполнять часть условных конструкций статически, как проверку совместимости типов, без запуска кода. Затем внутри блока с условием компилятор считает, что тип значения совпадает с тем, что было в самой проверке. Этот процесс в TypeScript называется **Type Narrowing** — сужение типа.

Сужение типа работает не только для типа `unknown`. Это универсальный механизм, который работает со всеми возможными типами, например, *Union Types*:

```
function foo(value: number | string) {
  if (typeof value === 'number') {
    // Работаем как с числом
  }
  if (typeof value === 'string') {
    // Работаем как со строкой
  }
}
```

Также `switch` поддерживает сужение типа:

```
function foo(value: number | string) {
  switch (typeof value) {
    case 'number':
      // Какая-то логика
      break
    case 'string':
      // Какая-то логика
      break
  }
}
```

Внутри каждого блока `case` тип значения сужается до того, что было в самом `case`. Перегрузка функций в TypeScript — это тоже пример работы сужения типов:

```
function concat(a: number, b: number): string
function concat(a: string, b: string): string

function concat(a: any, b: any): string {
  if (typeof a === 'string') {
    return `${a}${b}` // (parameter) a: string
  }
  else {
    return `${a.toFixed()}${b.toFixed()}`
  }
}
```

Сужение типов — большая тема со множеством нюансов. Он часто встречается в TypeScript, поэтому с ним можно будет разобраться на постоянной практике. Подробнее с особенностями работы этого механизма можно ознакомиться в документации — ссылка в конце урока.

## Дополнительные материалы

- [Официальная документация](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## **Далее → **
