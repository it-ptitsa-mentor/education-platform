---
title: "Именованные функции"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: c1982583-c140-44ad-9650-33ad262160ea
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Именованные функции

У переменных тип часто выводится сам; у функций типы параметров указывают явно.

Разберёте необязательные параметры, значения по умолчанию и вывод типа возврата.

## Обязательный параметр

Вызовем функцию и укажем тип параметра:

```javascript
function getGreetingPhrase(name: string) {
  return `Hello, ${name.toUpperCase()}!`
}
```

При таком указании параметр будет обязательным. Если вызвать функцию без параметра, это приведет к ошибке компиляции:

```javascript
// Expected 1 arguments, but got 0.
getGreetingPhrase()
```

## Необязательный параметр

Чтобы сделать параметр необязательным, нужно добавить знак `?` после имени переменной:

```javascript
function getGreetingPhrase(name?: string) {
  return `Hello, ${name ? name.toUpperCase() : 'Guest'}!`
}

getGreetingPhrase('Mike') // Hello, MIKE!
getGreetingPhrase() // Hello, Guest!
```

В таком случае тип переменной `name` становится составным (*Union Type*). Иначе говоря, `string | undefined` — строка или `undefined`.

Необязательный параметр может быть `undefined`, но не `null`. Чтобы добавить `null`, нужно изменить определение так:

```javascript
function getGreetingPhrase(name?: string | null) {
  return `Hello, ${name ? name.toUpperCase() : 'Guest'}!`
}
```

Здесь мы расширили определение типа переменной `name` до `string | undefined | null`.

## Значение по умолчанию

Со значением по умолчанию не нужно ничего указывать дополнительно. Значение задается как в JavaScript. Сама переменная автоматически становится необязательной, и тип выводится, исходя из переданного значения:

```javascript
function getGreetingPhrase(name = 'Guest') {
  return `Hello, ${name.toUpperCase()}!`
}

getGreetingPhrase() // Hello, GUEST!
```

## Тип возвращаемого значения

Во многих случаях TypeScript выводит тип возвращаемого значения самостоятельно, но его можно указывать явно:

```javascript
function getGreetingPhrase(name: string): string {
  return `Hello, ${name.toUpperCase()}!`
}
```

Возвращаемый тип может выводиться, но иногда из этого [получается](https://stackoverflow.com/questions/70001511/why-specify-function-return-types) не то, что мы ожидаем. Поэтому мы рекомендуем всегда проставлять тип. Это упрощает документирование и защищает код от случайных изменений.

В этом разделе мы узнали, как сделать параметр необязательным, как работать со значением переменной по умолчанию и как выводить тип возвращаемого значения.

## **Далее → **
