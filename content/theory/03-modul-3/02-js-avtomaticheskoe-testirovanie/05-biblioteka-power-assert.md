---
title: "Библиотека power-assert"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: 90ae2864-7276-47d9-8b21-33674266dde6
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Библиотека power-assert

У привычных утверждений есть усиленный вариант — [power-assert](https://github.com/power-assert-js/power-assert). Библиотека «оживляет» стандартный `assert`.

Проверка на встроенном модуле *assert*:

```
const user = {
  name: 'Madonna',
  friends: ['Kate', 'Michel'],
  email: 'madonna@example.com',
}

assert(user.name === 'Michel')

// AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
//  assert(user.name === 'Michel')
```

Видно выражение и результат, но не структуру `user` — придётся отлаживать вручную. С *power-assert* картина другая:

```
import assert from 'power-assert'

// Весь код остаётся тем же самым
const user = {
  name: 'Madonna',
  friends: ['Kate', 'Michel'],
  email: 'madonna@example.com',
}

// Интерфейс библиотеки power-assert на 100% совместим со встроенным модулем assert.
assert(user.name === 'Michel')
```

Вывод:

```
AssertionError [ERR_ASSERTION]:   # test.js:10

  assert(user.name === 'Michel')
         |    |    |
         |    |    false
         |    "Madonna"
         Object{name:"Madonna",friends:#Array#,email:"madonna@example.com"}

  --- [string] 'Michel'
  +++ [string] user.name
  @@ -1,6 +1,7 @@
   M
  -ichel
  +adonna
```

Остановитесь и разберите вывод: *power-assert* показывает значения промежуточных частей выражения и в конце — построчное сравнение строк.

Ещё пример из документации:

```
import assert from 'power-assert'

const array = [1, 2, 3]
const zero = 0
const two = 2

assert(array.indexOf(zero) === two)

// AssertionError [ERR_ASSERTION]:   # test.js:7
//
//   assert(array.indexOf(zero) === two)
//          |     |       |     |   |
//          |     |       |     |   2
//          |     -1      0     false
//          [1,2,3]
//
//   [number] two
//   => 2
//   [number] array.indexOf(zero)
//   => -1
```

Многие фреймворки не дают такой наглядности. *power-assert* подключают к разным стекам, но для «магического» вывода нужна трансформация кода — Babel, Webpack и т.д., как в [документации](https://github.com/power-assert-js/power-assert#be-sure-to-transform-test-code).

## Дополнительные материалы

- [Unified diff format (`@@ -1,6 +1,7 @@`)](https://www.gnu.org/software/diffutils/manual/html_node/Detailed-Unified.html)

## Далее →
