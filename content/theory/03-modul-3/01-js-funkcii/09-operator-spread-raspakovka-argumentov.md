---
title: "Оператор Spread (распаковка аргументов)"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 53b7c183-cfed-415d-902e-27cfcf696832
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Оператор Spread (распаковка аргументов)

В **вызовах** функций spread-оператор выглядит так же, как rest в определении (`...`), но делает обратное. На примере `sum()`:

```
const sum = (...numbers) => {
  let result = 0
  for (let num of numbers) {
    result += num
  }
  return result
}
```

Вызов с spread по массиву:

```
const numbers = [1, 7, 4]
sum(...numbers) // 12
```

Массив раскладывается в отдельные аргументы — их столько же, сколько элементов. По сути:

```
sum(numbers[0], numbers[1], numbers[2])
// sum(1, 7, 4);
```

Как и при определении, spread сочетается с обычными аргументами:

```
const numbers = [1, 7, 4]
sum(8, ...numbers) // 20

sum(8, 10, ...numbers) // 30
sum(8, 10, 70, ...numbers) // 100
```

В отличие от rest в параметрах, spread при вызове не обязан быть последним — позиция любая:

```
const numbers = [1, 7, 4]

sum(8, 10, ...numbers) // 30
sum(8, ...numbers, 10) // 30
sum(...numbers, 8, 10) // 30
```

Spread-операторов может быть несколько, в любом порядке:

```
const numbers1 = [1, 7, 4]
const numbers2 = [5, 5]

// sum(1, 7, 4, 5, 5);
sum(...numbers1, ...numbers2) // 22

// sum(5, 5, 1, 7, 4);
sum(...numbers2, ...numbers1) // 22

// sum(8, 1, 7, 4, 10, 5, 5);
sum(8, ...numbers1, 10, ...numbers2) // 40
```

## Итог

Оба оператора пишутся как `...`. При работе с функциями:

- **rest** — в **определении**: собрать «хвост» аргументов в массив

- **spread** — в **вызове**: развернуть массив в список аргументов

## Далее →
