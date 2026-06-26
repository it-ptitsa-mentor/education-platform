---
title: "Массивы"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 70c5e899-c6e3-46ae-a45a-448a19790d2d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Массивы

Массивы в TypeScript, как и примитивы, получают тип по выводу:

```javascript
const fruits = ['banana', 'mango', 'apple']
// Все работает
const upperFruits = fruits.map(name => name.toUpperCase())

// А теперь не работает
// Property 'key' does not exist on type 'string'.
const upperFruits = fruits.map(name => name.key)
```

**Массив** — это составной тип данных, который представляет собой контейнер для другого типа. Например, массив может быть контейнером для строк или чисел. Чтобы обозначить массив, используются квадратные скобки: `number[]`, `string[]`.

Определение массива выше можно было бы записать так:

```javascript
const fruits: string[] = ['banana', 'mango', 'apple']
```

Так же описываются типы в определении функций:

```javascript
function toUpperArray(items: string[]): string[] {
  return items.map(s => s.toUpperCase())
}
```

В итоге можно сказать, что массивы могут быть полезными инструментами при работе с данными.

## **Далее → **
