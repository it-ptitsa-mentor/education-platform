---
title: "Jest"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: afd81e93-4ea5-45ac-8420-858617bfbcc8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Jest

Когда тестов много, появляются вопросы: как группировать, как запустить всю папку, можно ли параллелить долгие прогоны. На помощь приходят **тестовые фреймворки** — они задают структуру и дают удобный вывод. В JavaScript чаще всего берут *Jest* (развивается сообществом вокруг экосистемы Meta).

Ниже — пошаговая настройка npm-проекта с тестами.

## Настройка и запуск

Создайте директорию *first-jest*, зайдите в неё и выполните:

```
npm init
```

Ответьте на вопросы инициализации. В корне должен появиться *package.json*.

Добавьте исходник *src/index.js*:

```
// Эта функция переворачивает переданную строку
export default str => str.split('').reverse().join('')
```

Jest — обычный npm-пакет для dev-зависимостей:

```
# В директории с проектом
npm i --save-dev jest
```

Для ESM в *package.json*:

```
"type": "module"
```

Jest ищет тесты в **__tests__** в корне проекта; внутри можно любая вложенность. Имена файлов: `<name>.test.js`, где `<name>` обычно совпадает с тестируемым модулем.

Первый тест — **__tests__/index.test.js**:

```
import reverse from '../src/index.js'

test('reverse', () => {
  expect(reverse('hello')).toEqual('olleh')
  expect(reverse('')).toEqual('')
})
```

Запуск:

```
NODE_OPTIONS=--experimental-vm-modules npx jest
 PASS  __tests__/index.test.js
  ✓ reverse (11ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.166s
Ran all test suites.
```

Поддержка ECMAScript-модулей в Jest пока экспериментальная — нужна переменная `NODE_OPTIONS`:

```
NODE_OPTIONS=--experimental-vm-modules npx jest
```

Тесты прошли.

## Структура

Файл с тестом ещё раз:

```
import reverse from '../src/index.js'

test('reverse', () => {
  expect(reverse('hello')).toEqual('olleh')
  expect(reverse('')).toEqual('')
})
```

Jest даёт глобальные `test` и `expect` без импорта.

`test` описывает один сценарий. Первый аргумент — подпись для отчёта:

```
NODE_OPTIONS=--experimental-vm-modules npx jest
 PASS  __tests__/index.test.js
  ✓ reverse (11ms) # название теста
```

Второй аргумент — функция с проверками. Она **не** выполняется сразу: Jest ставит её в очередь и сам решает, когда и как запускать (в том числе параллельно).

Проверки строятся на **матчерах**:

- `expect(actual)` — фактическое значение

- на результате вызывают матчер, например `toEqual`

Синтаксис намеренно похож на английские фразы:

```
// Ожидается, что результат выражения reverse('hello') равен 'olleh'
expect(reverse('hello')).toEqual('olleh')
```

Подробнее о матчерах — в следующем уроке.

При падении Jest показывает ожидаемое и полученное значение и фрагмент исходника с указанием строки. Сломайте функцию и перезапустите:

```
NODE_OPTIONS=--experimental-vm-modules npx jest
 FAIL  __tests__/index.test.js
  ✕ reverse (9ms)

  ● reverse

    expect(received).toEqual(expected) // Object.is equality

    Expected: "olleh"
    Received: "o|l|l|e|h"

      3 | test('reverse', () => {
      4 |   const str = 'hello';
    > 5 |   expect(reverse(str)).toEqual('olleh');
        |                        ^
      6 | })
      7 |

      at Object.toEqual (__tests__/index.test.js:5:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.683s
Ran all test suites.
```

## Самостоятельная работа

1. Выполните все шаги из этого урока

1. Залейте код на Гитхаб

## Дополнительные материалы

- [Jest](https://jestjs.io/)

- [Блоки тестов (Describe)](https://jestjs.io/docs/api#describename-fn)

## Далее →
