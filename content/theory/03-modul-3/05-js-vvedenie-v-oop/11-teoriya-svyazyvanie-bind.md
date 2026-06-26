---
title: "Теория: Связывание (bind)"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: ead5d89f-fc16-4fb0-86fd-43839d913472
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: Связывание (bind)

JavaScript асинхронен: функции часто передают как колбеки. В браузере таких вызовов особенно много. С простыми функциями проблем не было, с методами — другая картина.

*Асинхронность мы ещё не проходили, но идея проста: `setTimeout` принимает функцию и задержку, потом вызывает переданную функцию.*

Запустите код:

```
const printer = {
  name: 'Henry',
  print(greeting = 'hello') {
    console.log(`${greeting}, ${this.name}`)
  },
}

// Прямой запуск
printer.print() // => "hello, Henry"
```

Тот же метод через секунду — через `setTimeout`:

```
// Хотим запустить метод print через секунду
// Обязательно запустите этот код на своем компьютере
// чтобы почувствовать то как работает setTimeout
// 1000 - означает 1000 миллисекунд или 1 секунда
// printer.print - это не вызов, а передача функции
setTimeout(printer.print, 1000)

// Спустя секунду
// => "hello, undefined"
```

Вывод: `hello, undefined`. В `setTimeout` ушла функция `print` без объекта — связь с `printer` потеряна, `this` уже не указывает на объект. Упрощённо:

```
const print = printer.print
// Где-то внутри setTimeout
print() // => "hello, undefined"
```

Без контекста у обычной функции `this` часто оказывается `undefined` (или глобальным объектом в нестрогом режиме).

Обычно метод хотят вызвать в контексте своего объекта. Есть несколько способов. Простейший — обёртка, внутри которой вызывается метод:

```
setTimeout(() => printer.print(), 1000)
// Спустя секунду
// => "hello, Henry"

// Или без setTimeout
const fn = () => printer.print()
// Все работает потому что print() вызывается из printer
fn() // => "hello, Henry"
```

Обёртка ещё и захватывает переменные из окружения:

```
// Оборачивание в функцию помогает передать какие-то данные внутрь
const value = 'hi'
setTimeout(() => printer.print(value), 1000)
// => "hi, Henry"
```

## Связывание (Bind)

Другой способ — `bind()`: привязать функцию к контексту. `bind()` возвращает **новую функцию** с тем же телом, но с зафиксированным `this`.

```
// Контекстом является тот же объект printer, в котором определен метод
// Это довольно странно выглядит, но жизнь — сложная штука
// bind вызывается на функции и возвращает функцию
const boundPrint = printer.print.bind(printer)

// Теперь можно так
boundPrint() // => "hello, Henry"
setTimeout(boundPrint, 1000)
// Через секунду
// => "hello, Henry"

// Можно вызывать bind прямо по месту
// так как возвращается функция
setTimeout(printer.print.bind(printer), 1000)
// hello, Henry
```

Связанная функция «намертво» привязана к контексту — `this` больше не сменится.

`bind()` также принимает аргументы функции — не обязательно все сразу. Это частичное применение (partial application):

```
setTimeout(printer.print.bind(printer, 'hi'), 1000)
// Через секунду
// => "hi, Henry"
```

До стрелочных функций `bind()` был популярен; сейчас чаще обходятся стрелочными обёртками.

## Apply & Call

`bind()` нужен, когда привязка и вызов разнесены по времени — так бывает в асинхронном коде.

Иногда контекст задают и сразу вызывают — через `bind(...)()`:

```
const print = printer.print
print.bind(printer)('hi') // => "hi, Henry"
```

Или через `apply()` и `call()`:

```
// func.apply(thisArg, [ argsArray])
print.apply(printer, ['hi']) // hi, Henry

// func.call([thisArg[, arg1, arg2, ...argN]])
print.call(printer, 'hi') // hi, Henry
```

Они меняют `this` и сразу вызывают функцию. `apply()` принимает аргументы массивом, `call()` — списком.

Пример необычного использования:

```
// Если контекста нет, то передают null
const numbers = [1, 10, 33, 9, 15]
const max = Math.max.apply(null, numbers) // 33

const numbers = [1, 10, 33, 9, 15]
const max = Math.max.call(null, ...numbers) // 33
```

Это демонстрация; на практике чаще используют spread. Реальное применение `call()` и `apply()` — вместе с методами из прототипов; об этом в следующих уроках.

## Дополнительные материалы

- [apply()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

- [Квадратные скобки в сигнатурах MDN](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Howto/Write_an_API_reference#parameters)

## Далее →
