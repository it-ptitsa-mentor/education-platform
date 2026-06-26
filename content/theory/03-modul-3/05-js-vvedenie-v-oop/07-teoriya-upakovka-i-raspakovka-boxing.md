---
title: "Теория: Упаковка и Распаковка (Boxing)"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: 9c2d7608-397d-42aa-896c-bb0d21a0ee29
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: Упаковка и Распаковка (Boxing)

Метод — функция в свойстве объекта. Вызов метода — вызов этой функции:

```
const obj = {
  sayHello: () => console.log('hello!'),
}

obj.sayHello()
```

Но в JavaScript методы можно вызывать и на примитивах:

```
'hello'.toUpperCase() // "HELLO"
```

Кажется, строка — объект. На самом деле нет: строки, булевы значения, `null` и числа — примитивы, у них нет собственных методов.

При вызове метода на примитиве движок временно упаковывает значение в объект, вызывает метод и распаковывает обратно.

Для каждого примитивного типа есть конструктор, создающий объект-обёртку — он и участвует в упаковке.

Разберём вручную на примере выше. Конструктор строк — `String`:

```
const name = new String('hello')
console.log(`${name}`) // "hello"
```

Создали объект `name` и упаковали в него `'hello'`.

Распаковка — через `valueOf()`:

```
const name = new String('hello')
// Его можно вызвать самостоятельно
name.valueOf() // "hello"
```

То же для других типов:

```
const number = new Number(100)
number.valueOf() // 100

const bool = new Boolean(true)
bool.valueOf() // true
```

`valueOf()` вызывается при разных операциях над объектом:

```
const number = new Number(100)

const newName = `${number + 0} is a big number` // "100 is a big number!"
```

Здесь `number + 0` заставляет движок вызвать `valueOf()` для сложения.

`valueOf()` можно переопределить:

```
const number = new Number(100)
number.valueOf = () => 99999

const newName = `${number + 0} is a big number` // "99999 is a big number!"
```

## Итог

Вызов метода на примитиве — автоматическая упаковка, вызов метода на обёртке и распаковка. Распаковка бывает и у обычных объектов в вычислениях.

В уроке — `valueOf()`, который вызывается при распаковке.

## Дополнительные материалы

- [Документация по valueOf на MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

- [Обертки](https://github.com/azat-io/you-dont-know-js-ru/blob/master/types%20%26%20grammar/ch3.md#user-content-%D0%BE%D0%B1%D0%B5%D1%80%D1%82%D0%BA%D0%B8)

## Далее →
