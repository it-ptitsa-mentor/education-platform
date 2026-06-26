---
title: "Spread и создание новых массивов"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: c24d4bc4-ef9b-491f-b4a1-92a3b444c8fe
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Spread и создание новых массивов

У rest есть пара — spread. Синтаксис тот же (`...`), но задача обратная: не собирать остаток, а «развернуть» элементы. Им копируют и склеивают массивы.

Нужно собрать новый массив из элементов другого — типичная задача со значениями по умолчанию:

```
const frenchCities = ['paris', 'marseille']
const cities = ['milan', 'rome', ...frenchCities]
// ['milan', 'rome', 'paris', 'marseille']

// Массив frenchCities при этом никак не меняется

// То же самое без spread
const cities = ['milan', 'rome'].concat(frenchCities)
```

Здесь `...` — spread: он разворачивает `frenchCities` внутрь нового литерала. Отличить от rest помогает контекст: rest слева от `=` при деструктуризации, spread справа при создании массива.

В отличие от rest, spread можно ставить в любой позиции литерала — в начале:

```
const cities = [...frenchCities, 'milan', 'rome']
// ['paris', 'marseille', 'milan', 'rome']

// То же самое без spread
const cities = frenchCities.concat(['milan', 'rome'])
```

И посередине:

```
const cities = ['milan', ...frenchCities, 'rome']
// ['milan', 'paris', 'marseille', 'rome']

// Без spread подобный код нельзя выразить одной операцией
```

Spread принимает сколько угодно массивов:

```
const frenchCities = ['paris', 'marseille']
const italianCities = ['rome', 'milan']
// слияние двух массивов
const cities = [...frenchCities, ...italianCities]
// ['paris', 'marseille', 'rome', 'milan']

// То же самое без spread
const cities = frenchCities.concat(italianCities)
```

## Копирование массива

Spread часто копируют массив, чтобы менять копию, не трогая оригинал:

```
const frenchCities = ['paris', 'marseille']
const copy = [...frenchCities]
copy.push('lyon')
console.log(copy) // => [ 'paris', 'marseille', 'lyon' ]
console.log(frenchCities) // => [ 'paris', 'marseille' ]

// То же самое без spread
const frenchCities = ['paris', 'marseille']
const copy = frenchCities.slice()
```

## Далее →
