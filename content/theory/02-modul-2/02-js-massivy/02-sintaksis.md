---
title: "Синтаксис"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 6d596fa0-8964-440b-a417-023b958a5f6e
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Синтаксис

В программировании массив — это любой упорядоченный набор элементов: курсы на учебной платформе, студенты в группе или друзья в соцсети. Задача массива — представить такую коллекцию единой структурой, с которой удобно работать целиком.

## Определение массива

```javascript
// Создание пустого массива
const items = []

// Создание массива с тремя элементами
const animals = ['cats', 'dogs', 'birds']
```

Здесь объявляется массив `['cats', 'dogs', 'birds']` и присваивается константе `animals`.

Обратите внимание на имена констант с массивами: обычно они во множественном числе. Так проще читать код и сразу видеть, что переменная хранит набор.

## Получение данных

Элементы массива упорядочены слева направо. У каждого есть порядковый номер — **индекс**. Нумерация с нуля: первый элемент — индекс `0`, второй — `1` и далее. Доступ по индексу записывается так:

```javascript
const animals = ['cats', 'dogs', 'birds']
animals[0] // 'cats'
animals[1] // 'dogs'
// Последний индекс всегда на единицу меньше длины массива.
// Здесь три элемента, последний индекс — 2
animals[2] // 'birds'
```

Длину массива даёт свойство `length`.

```javascript
const animals = ['cats', 'dogs', 'birds']
// У массивов много других свойств и методов, с которыми мы познакомимся в процессе прохождения курсов.
animals.length // 3
```

На практике индекс часто вычисляется в рантайме, и обращение идёт через переменные:

```javascript
let i = 1
const animals = ['cats', 'dogs', 'birds']
animals[i] // 'dogs'
```

И так:

```javascript
let i = 1
let j = 1
const animals = ['cats', 'dogs', 'birds']
animals[i + j] // 'birds'
```

В скобках ожидается *выражение* — подойдёт всё, что можно вычислить, в том числе вызов функции:

```javascript
const getIndexOfSecondElement = () => 1
const animals = ['cats', 'dogs', 'birds']
animals[getIndexOfSecondElement()] // 'dogs'
```

Часто нужен последний элемент. Его индекс: *длина_массива − 1*:

```javascript
const animals = ['cats', 'dogs', 'birds']
animals[animals.length - 1] // 'birds'
```

## at()

Альтернатива — метод `at()`. Он принимает отрицательные индексы и позволяет брать элементы с конца без ручного расчёта:

```javascript
const animals = ['cats', 'dogs', 'birds']
animals.at(0) // 'cats'
animals.at(1) // 'dogs'
// Первый с конца
animals.at(-1) // 'birds'
// Второй с конца
animals.at(-2) // 'dogs'
```

---

### Дополнительные материалы

1. [Документация](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Далее →
