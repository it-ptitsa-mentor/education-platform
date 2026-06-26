---
title: "Псевдонимы типов"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: f9951301-56e3-4bc7-93e3-b91793ed794b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Псевдонимы типов

Если тип объекта повторяется во многих функциях, правки размазаны по коду. Псевдонимы типов (`type`) сокращают дублирование.

## Задаем псевдоним типа

Псевдоним (*alias*) задаёт короткое имя для составного типа:

```javascript
type User = {
  firstName: string
  pointsCount: number
}
```

Теперь можно провести замену во всех функциях:

```javascript
function doSomething(user: User) {
  // ...
}
```

Псевдоним не создаёт новый тип — это сокращённая запись; совместимость сохраняется:

```javascript
const user = {
  firstName: 'Mike',
  pointsCount: 1000,
}

// Оба вызова работают
doSomething(user)
doSomething({ firstName: 'Bob', pointsCount: 1800 })
```

При этом разработчики на TypeScript говорят «создаем тип», а не «создаем псевдоним типа». Поэтому в этом курсе мы будем придерживаться общепринятого формата.

Типы можно задавать для любых типов данных. Например, для простых:

```javascript
type SomeType = string
```

А также для составных:

```javascript
// union тип из трех возможных значений
type SomeType = string | number | null

// Функция
type Countable = (coll: number[]) => number
```

## Объекты и функции

Описание типа функции вне объекта и внутри отличается. Когда функция записывается самостоятельно, используется формат стрелочной функции:

```javascript
type Countable = (coll: number[]) => number
```

Внутри типа, который описывает объект, формат меняется на используемый для обычных свойств:

```javascript
type User = {
  firstName: string
  pointsCount: number
  count(coll: number[]): number
}
```

Но это не касается колбеков, которые могут быть использованы внутри:

```javascript
type User = {
  firstName: string
  pointsCount: number
  // Типы взяты для примера
  count(coll: (v: string) => string): number
}
```

В этом разделе мы научились использовать псевдонимы типов. Также мы узнали, как задавать псевдоним для составных типов.

## **Далее → **
