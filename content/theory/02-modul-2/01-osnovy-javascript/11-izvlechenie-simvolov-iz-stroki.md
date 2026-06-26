---
title: "Извлечение символов из строки"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: c6147b6b-e461-4916-9d2d-c4a238c8371f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Извлечение символов из строки

Часто нужен один символ строки — например, инициал *A.* в формате *A. Ivanov*.

```
const firstName = 'Tirion'

console.log(firstName[0]) // => T
```

Синтаксис `строка[индекс]`: индексы с **0**, последний — `длина - 1`.

```
// Длина строки 6, поэтому последний индекс — это 5
const firstName = 'Tirion'

console.log(firstName[5]) // => n

// Вопрос на самопроверку. Что выведет этот код?
const magic = '\nyou'
console.log(magic[1]) // => ?
```

Индексом может быть не только конкретное число, но и значение переменной. Вот пример, который приведет к тому же результату — выводу на экран символа *T*, но индекс внутри квадратных скобок записан не числом, а константой:

```
const firstName = 'Tirion'
const index = 0

console.log(firstName[index]) // => T
```

Индекс вне строки не ошибка — вернётся `undefined`.

```
const firstName = 'Tirion'

console.log(firstName[10]) // => undefined
```

## Далее →
