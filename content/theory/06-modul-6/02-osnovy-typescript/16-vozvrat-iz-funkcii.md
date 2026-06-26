---
title: "Возврат из функции"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 07addbce-6354-4a1d-8c3e-17bd46cf5ac0
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Возврат из функции

Разберём тип `never`.

## Использование типа never

Тип `never` используется, когда функция гарантированно ничего не возвращает. Например, если внутри функции есть бесконечный цикл:

```javascript
function infiniteLoop(): never {
  while (true) {
    // Какая-то логика
  }
}
```

Еще тип `never` используется, если функция выбрасывает исключение:

```javascript
function stop(message: string): never {
  throw new Error(message)
}
```

Также тип `never` используется, когда функция завершает программу:

```javascript
function exit(code: number = 0): never {
  process.exit(code)
}
```

Важным условием для `never` является отсутствие нормального завершения функции. Например, в примере ниже компилятор выдаст ошибку:

```javascript
// A function returning 'never' cannot have a reachable end point.
function printSomething(): never {
  console.log('hexlet')
}
```

Функция `printSomething()` ничего не возвращает явно. Но потому что она завершается в принципе, JavaScript подставляет неявный возврат `undefined`.

Автоматически `never` выводится даже там, где прописан явный возврат. Но компилятор видит, что этот возврат невозможен:

```javascript
function fail() { // Автоматически выводится never
  // Определенная выше функция exit имеет возвращаемый тип never
  return exit(1)
}
```

## **Далее → **
