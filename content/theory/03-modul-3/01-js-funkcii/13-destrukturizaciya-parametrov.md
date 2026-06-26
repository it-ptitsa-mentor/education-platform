---
title: "Деструктуризация параметров"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: bc373290-bcd6-449c-bee4-e0bfe3980668
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Деструктуризация параметров

При вызове функции значение аргумента присваивается параметру — неявно, без отдельной строки в коде.

```
const func = (x) => {
  // параметру x будет присвоено
  // значение аргумента при вызове функции
  console.log(x)
}

func(1) // => 1
// Это можно представить так, что
// внутри функции создается параметр x,
// которому присваивается значение аргумента:
// {
//   let x = 1;
//   console.log(x);
// };

func([1, 2]) // => [1, 2]
// Пример с передачей массива:
// {
//   let x = [1, 2];
//   console.log(x);
// };
```

Раз присваивание обычное, деструктуризацию можно применить прямо в списке параметров.

## Деструктуризация массива

Функция печатает два элемента массива из двух позиций.

По индексам — менее выразительно:

```
const func = (elements) => {
  console.log(elements[0])
  console.log(elements[1])
}

// let elements = [1, 2];
func([1, 2])
// => 1
// => 2
```

Деструктуризация в теле:

```
const func = (elements) => {
  const [first, second] = elements
  console.log(first)
  console.log(second)
}

// let elements = [1, 2];
func([1, 2])
// => 1
// => 2
```

Или сразу в параметрах:

```
const func = ([first, second]) => {
  console.log(first)
  console.log(second)
}

// let [first, second] = [1, 2];
func([1, 2])
// => 1
// => 2
```

Действуют обычные правила деструктуризации массива:

```
const elements = [1, 2]

// let [first, second] = elements;
func(elements)
// => 1
// => 2

// let [first, second] = [1];
func([1])
// => 1
// => undefined

// let [first, second] = [];
func([])
// => undefined
// => undefined
```

Нехватка элементов даёт `undefined`. Можно задать значения по умолчанию:

```
const func = ([first = 666, second = 777]) => {
  console.log(first)
  console.log(second)
}

// [first = 666, second = 777] = [1];
func([1])
// => 1
// => 777

// [first = 666, second = 777] = [];
func([])
// => 666
// => 777
```

## Деструктуризация объекта

Функция выводит имя и фамилию из объекта — сразу в параметрах:

```
const func = ({ name, surname }) => {
  console.log(name)
  console.log(surname)
}

// let { name, surname } = { name: 'John', surname: 'Doe' };
func({ name: 'John', surname: 'Doe' })
// => John
// => Doe
```

Часто приходит объект с десятком полей, а нужны два — при ответе API или в конфиге достаточно выбрать нужные свойства:

```
const func = ({ surname }) => {
  // берём только значения surname
  console.log(surname)
}

const obj = { name: 'John', surname: 'Doe' }

// let { surname } = { name: 'John', surname: 'Doe' };
func(obj) // => Doe
```

---

### Дополнительные материалы

1. [Деструктуризация массива (MDN)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

1. [Деструктуризация объекта (MDN)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%D0%94%D0%B5%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0)

## Далее →
