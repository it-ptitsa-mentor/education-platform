---
title: "Property-based тестирование"
module: "Модуль 4"
topic: "JS: Продвинутое тестирование"
buildin_id: 30d9b7e8-1ecc-44f5-af17-d1d6b1f8146b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Property-based тестирование

Property-based тестирование (проверка по свойствам) — способ функционального тестирования, при котором мы убеждаемся, что функция удовлетворяет заданному свойству. Не нужно перечислять все примеры вручную: сравниваются характеристики результата с формулировкой свойства.

Свойство можно записать псевдокодом так:

`for all (x, y, ...) such as precondition(x, y, ...) holds property(x, y, ...) is true`

Формулируем инвариант «для любых данных, при которых …, выполняется …». В отличие от классических тестов, не задаём каждый пример явно — только условия, которым входы должны соответствовать.

Пусть есть функция `divide()`, делящая одно число на другое:

```
const divide = (a, b) => a / b
```

Обычный тест:

```
const { equal } = require('assert')

equal(divide(4, 2), 2)
equal(divide(18, 3), 6)
```

Передаём 18 и 3, ждём 6 — тесты зелёные. Но проверены лишь две пары; на других входах поведение может отличаться. Нужен тест, смотрящий на свойства в целом — они должны выполняться для любой корректной реализации.

У деления есть [дистрибутивность справа](https://ru.wikipedia.org/wiki/%D0%94%D0%B8%D1%81%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D1%8C): `(a + b) / c` равно `a / c + b / c`.

В тесте не фиксируем конкретные числа — берём случайные:

```
const a = Math.random() * 1000
const b = Math.random() * 1000
const c = Math.random() * 1000

const left = divide(a + b, c)
const right = divide(a, c) + divide(b, c)
```

При многократном запуске рано или поздно выпадут три нуля. Тест упадёт: `0/0` даёт `NaN`, а `NaN` не равен `NaN`. Становится ясно, что нужна проверка на ноль.

```
AssertionError [ERR_ASSERTION]: NaN == NaN
```

Мы использовали произвольные значения и многократный прогон — проверили спецификацию, а не отдельные кейсы. Это и есть property-based testing.

Вручную крутить цикл с подстановками не принято — для этого есть фреймворки. Они генерируют данные по описанным свойствам; после N успешных прогонов тест считается пройденным, иначе — падение с ошибкой.

Плюсы property-based подхода:

- Широкий охват данных. Генераторы строят входы по свойствам; теоретически можно покрыть большие классы значений — все строки или целые в диапазоне

- Минимизация контрпримера при сбое: фреймворк сжимает пример до минимального (например, одна буквенная строка вместо длинной)

- Воспроизводимость: фиксируется seed — тот же набор можно повторить после падения

Property-тесты не заменяют модульные — это дополнительный слой, который часто быстрее выявляет ошибки в инвариантах.

## Фреймворки

Идею впервые воплотили в QuickCheck для Haskell. В JavaScript есть [fast-check](https://github.com/dubzzz/fast-check).

Установка:

```
npm install fast-check --save-dev
```

Проверим `contains()` — есть ли подстрока в строке. Два свойства:

- Строка всегда содержит саму себя

- В `a + b + c` всегда найдётся подстрока `b`, при любых `a`, `b`, `c`

```
import fc from 'fast-check'

// Тестируемый код
const contains = (text, pattern) => text.indexOf(pattern) >= 0

// Описываем свойства

test('string should always contain itself', () => {
  fc.assert(
    fc.property(
      fc.string(),
      text => contains(text, text),
    ),
  )
})

test('string should always contain its substring', () => {
  fc.assert(
    fc.property(
      fc.string(), fc.string(), fc.string(),
      (a, b, c) => contains(a + b + c, b),
    ),
  )
})
```

Структура теста

`fc.assert(<property>(, parameters))` — прогоняет свойство на сгенерированных строках `a`, `b`, `c`. При сбое сжимает контрпример. По умолчанию — 100 итераций.

`fc.property(<...arbitraries>, <predicate>)` — описание свойства. `arbitraries` задают генерацию входов, `predicate` их проверяет. `predicate` возвращает boolean или бросает/падает через expect при ошибке.

`fc.string()` — генератор строк; участвует и в создании, и в shrink.

Чтобы посмотреть сгенерированные значения, замените `fc.assert` на `fc.sample`:

```
fc.sample(
  fc.property(
    fc.string(), fc.string(), fc.string(),
    (a, b, c) => contains(a + b + c, b),
  ),
)
```

Пример вывода:

```
{a: ") | 2", b: "", c: "$ & RJh %%"}
{a: "\\\" ", b:" Y \\\ "\\\" ", c:" $ S # K3 "}
{a:" $ ", b:" \\\\ cx% wf ", c:" 't4qRA "}
{a:" ", b:" ", c:" n? H. 0% "}
{a:" 6_ # 7 ", b:" b ", c:" 4% E "}
...
```

Намеренно сломанная `contains()` покажет shrink при падении:

```
const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1
```

После сбоя фреймворк ужимает вход:

```
Error: Property failed after 20 tests
{ seed: 1783957873, path: "19:1:0:1:1", endOnFailure: true }
Counterexample: [""," ",""]
Shrunk 4 time(s)
Got error: Property failed by returning false
```

Другой стиль: `predicate` не возвращает boolean, а использует expect:

```
import fc from 'fast-check'

// Тестируемый код
const contains = (text, pattern) => text.indexOf(pattern) >= 0

// Описываем свойства
test('string should always contain its substring', () => {
  fc.assert(
    fc.property(
      fc.string(), fc.string(), fc.string(), (a, b, c) => {
        expect(contains(a + b + c, c)).toBeTruthy()
      },
    ),
  )
})
```

## Заключение

Property-тесты — мощное дополнение к классическим. Базовый функционал можно покрывать примерами, а критичные места — свойствами.

## Дополнительные материалы

- [Фреймворк для property-based тестирования](https://github.com/dubzzz/fast-check)
