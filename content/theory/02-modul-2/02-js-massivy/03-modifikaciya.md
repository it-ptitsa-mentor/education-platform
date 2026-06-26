---
title: "Модификация"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 3e906ace-af55-4394-8cae-eabfd071d98d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Модификация

Примитивные типы, с которыми мы работали раньше, изменить нельзя. Функции и методы над ними возвращают новые значения, но исходное не трогают.

```
const name = 'World'
name.toUpperCase() // 'WORLD'
// Значение name не поменялось
console.log(name) // 'World'
```

С массивами иначе: они могут расти, уменьшаться и менять значения по индексам. Ниже — основные операции.

## Изменение элементов массива

Синтаксис почти совпадает с чтением по индексу, но добавляется присваивание:

```
const animals = ['cats', 'dogs', 'birds']
// Меняется первый элемент массива
animals[0] = 'horses'
console.log(animals) // => [ 'horses', 'dogs', 'birds' ]
```

Неожиданный момент — изменение «константы». В JavaScript `const` хранит ссылку на данные (подробнее в следующих уроках), а не сами данные. Менять содержимое можно, подменить всю ссылку — нет:

```
const animals = ['cats', 'dogs', 'birds']
// Меняем данные, сам массив тот же
// Такой код работает
animals[2] = 'fish'
console.log(animals) // => [ 'cats', 'dogs', 'fish' ]

// Ошибка: попытка заменить константу целиком
animals = ['fish', 'cats']
// Uncaught TypeError: Assignment to constant variable.
```

## Добавление элемента в массив

Метод `push()` добавляет элемент в *конец*:

```
const animals = ['cats', 'dogs', 'birds']
animals.push('horses')

// массив animals изменен — стал больше
console.log(animals) // => [ 'cats', 'dogs', 'birds', 'horses' ]

// строка 'horses' была добавлена в конец массива (индекс = 3)
console.log(animals[3]) // => 'horses'
```

Метод `unshift()` добавляет в *начало*:

```
const animals = ['cats', 'dogs', 'birds']
animals.unshift('horses')

// массив animals изменен — стал больше
console.log(animals) // => [ 'horses', 'cats', 'dogs', 'birds' ]

// строка 'horses' была добавлена в начало массива (индекс = 0)
console.log(animals[0]) // => 'horses'
```

Если известен индекс, добавление по сути совпадает с присваиванием:

```
const animals = ['cats', 'dogs', 'birds']
animals[3] = 'horses'
console.log(animals) // => [ 'cats', 'dogs', 'birds', 'horses' ]
```

## Удаление элемента из массива

Удалить элемент можно оператором `delete`: `delete arr[index]`.

Пример:

```
const animals = ['cats', 'dogs', 'birds']
delete animals[1] // удаляем элемент под индексом 1
console.log(animals) // => [ 'cats', <1 empty item>, 'birds' ]
```

У этого способа есть минусы, связанные с устройством JavaScript. Например, длина массива может не измениться:

```
animals.length // 3
```

Есть и другие нюансы, в которые сейчас не углубляемся. Приводим `delete` лишь для примера — в реальном коде лучше не использовать. Уменьшение размера массива вообще нежелательная операция; об этом — в одном из следующих уроков.

## Далее →
