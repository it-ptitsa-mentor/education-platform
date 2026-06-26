---
title: "Утверждения"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: b699d394-5f8c-420b-9289-e16a50d0c75d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Утверждения

Каждую проверку для `capitalize()` в тестах называют **утверждением** (assert). Утверждения — сердце теста: именно они сравнивают факт с ожиданием:

```javascript
import capitalize from '../src/capitalize.js'

// Первое утверждение (проверка на пустую строку)
if (capitalize('') !== '') {
  throw new Error('Функция работает неверно!')
}

// Второе утверждение (проверка на слово)
if (capitalize('hello') !== 'Hello') {
  throw new Error('Функция работает неверно!')
}
```

Паттерн один и тот же: условие → исключение. В Node.js есть встроенный модуль *assert* с функциями, упрощающими запись:

```javascript
// Такой необычный импорт связан с тем,
// что assert, экспортируемый по умолчанию, считается устаревшим
// Правильно использовать strict
import { strict as assert } from 'node:assert'
import capitalize from '../src/capitalize.js'

// Проверка сменилась с отрицательной на положительную
assert(capitalize('') === '')
assert(capitalize('hello') === 'Hello')
```

В простейшем виде `assert` — функция, принимающая выражение: `assert(true)` — ок, `assert(false)` — ошибка. При провале вы увидите что-то вроде:

AssertionError [ERR_ASSERTION]: false == true

Смысл: ожидалась истина, получилась ложь. В стеке видно, где сработало утверждение:

```javascript
// В данном случае assert сработал на 15 строчке файла capitalize.js
at first (file:///src/capitalize.js:15:19)
at default (file:///src/capitalize.js:11:3)
at file:///test.js:5:13
```

Код короче, проверки читаются как «то, что мы хотим увидеть». Зато сообщение об ошибке малополезно — без открытия файла непонять, что именно не сошлось (можно передать текст последним аргументом, но так редко делают: слишком ручная работа).

Для сравнения значений есть специализированные функции, например `assert.strictEqual(actual, expected)`:

```javascript
import { strict as assert } from 'node:assert'
// при использовании strict-режима
// проверка equal равносильна strictEqual

import capitalize from '../src/capitalize.js'

// Проверка сменилась с отрицательной на положительную
assert.equal(capitalize(''), '')
// Первый параметр actual – то, что пришло
// Второй параметр expected – то, что ожидает тест
// Правильный порядок аргументов имеет большое значение при анализе ошибки
assert.equal(capitalize('hello'), 'Hello')
```

Вывод информативнее:

Thrown: AssertionError [ERR_ASSERTION]: 'hello' == 'Hello' generatedMessage: true, code: 'ERR_ASSERTION', actual: 'hello', expected: 'Hello', operator: '=='

В сообщении есть и текст ошибки, и сами `actual` / `expected` — отладка быстрее.

Осторожно: `strictEqual(actual, expected)` сравнивает **по ссылке**. Два разных объекта с одинаковым содержимым — не равны:

```javascript
AssertionError [ERR_ASSERTION]: Values have same structure but are not reference-equal:

{
  key: 'value'
}

    at repl:1:8
    at Script.runInThisContext (vm.js:131:20)
    at REPLServer.defaultEval (repl.js:436:29)
    at bound (domain.js:429:14)
    at REPLServer.runBound [as eval] (domain.js:442:12)
    at REPLServer.onLine (repl.js:763:10)
    at REPLServer.emit (events.js:327:22)
    at REPLServer.EventEmitter.emit (domain.js:485:12)
    at REPLServer.Interface._onLine (readline.js:337:10)
    at REPLServer.Interface._line (readline.js:666:8) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: [Object],
  expected: [Object],
  operator: 'strictEqual'
}
```

Для сравнения **по содержимому** — `assert.deepEqual(actual, expected)`:

```javascript
assert.deepEqual({}, {}) // всё ок
assert.deepEqual({ key: 'value' }, { key: 'value' }) // всё ок
assert.deepEqual({ key: 'value' }, { key: 'another value' }) // Бум!
```

Правила `deepEqual` нетривиальны — подробности в документации.

Для негативных сценариев — `assert.notStrictEqual` и `assert.notDeepStrictEqual` (проверяют неравенство). Используются редко, но полезно знать:

```javascript
assert.notDeepEqual({ a: 1 }, { a: '1' }) // OK!
```

---

### Самостоятельная работа

1. Посмотрите в конце урока ссылки на документацию на библиотеки утверждений

1. Замените в вашем репозитории ручные утверждения на использование модуля *assert*

1. Запустите тесты, убедитесь что они работают. Попробуйте их сломать

1. Добавьте код на гитхаб

---

### Дополнительные материалы

1. [Asserts](https://nodejs.org/api/assert.html)

1. [Chai](https://chaijs.github.io/)

## Далее →
