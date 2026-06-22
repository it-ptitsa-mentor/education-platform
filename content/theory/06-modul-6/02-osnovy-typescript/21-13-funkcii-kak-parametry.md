---
title: "13. Функции как параметры"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 9a293d45-54e8-48b0-bab2-c155611c3c3c
---

# 13. Функции как параметры

В TypeScript используется несколько способов типизировать функции, которые передаются как параметры. В этом уроке мы научимся работать с ними.

## Как типизировать функции, которые передаются как параметры

Самый простой способ типизировать функции как параметры — использовать тип `Function`. Он описывает функцию JavaScript со всеми ее особенностями, включая свойства `bind`, `call` и `apply`.

```javascript
function process(callback: Function) {
  const value = callback()
  // ...
}
```

Здесь видно, что `Function` отключает проверку типов для вызываемой функции. В итоге количество и тип входных аргументов не проверяются, а результатом работы такой функции будет `any`. Поэтому рекомендуем избегать `Function`.

```javascript
// Сработает, хотя по смыслу не должно
// Внутри Math.round вызовется без аргументов
process(Math.round)
```

Другой способ описывать функции — использовать стрелочную функцию с указанием входных и выходных типов:

```javascript
function process(callback: () => string) {
  // value имеет тип string
  const value = callback()
  // ...
}

process(Math.round)
// Argument of type '(x: number) => number' is not
// assignable to parameter of type '() => string'.
```

Определение типа стрелочной функции похоже на обычное определение функции, но тут важно не перепутать. Здесь мы видим именно описание типа, а не определение функции.

Рассмотрим еще несколько примеров для закрепления:

```javascript
function process(callback: () => number)
function process(callback: () => string[])
function process(callback: () => { firstName: string })
```

Пример с параметрами:

```javascript
function process(callback: (n: number) => string) {
  const value = callback(10)
  // ...
}
```

Если определение функции встречается часто, то для него можно создать псевдоним:

```javascript
type myFunction = (n: number) => string

function process(callback: myFunction) {
  const value = callback(10)
  // ...
}
```

## **Далее → **
