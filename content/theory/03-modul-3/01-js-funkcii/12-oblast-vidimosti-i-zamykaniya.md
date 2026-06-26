---
title: "Область видимости и замыкания"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 84a85e99-0035-445a-87ae-49993dd02fbc
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Область видимости и замыкания

<!-- IMG (из Buildin, перезалить отдельно) -->
Химический завод изолируют от окружающей среды, чтобы не было утечек — у него своё **окружение**. В коде изоляцию называют **областью видимости**. Разберём, на какие зоны делится программа и как это влияет на выполнение.

## Области видимости

Две крупные зоны:

- **Глобальная** (внешняя)

- **Локальная** (внутренняя)

В глобальной всё, что объявлено вне функций, `if`, циклов и прочих блоков:

```
const age = 29

const multiplier = (num) => {
  const x = 10
  return num * x
}

let result = true
```

`age`, `multiplier` и `result` — глобальные.

Внутри `multiplier` константа `x` и аргумент `num` — локальные; `num` ведёт себя почти как локальная переменная.

Снаружи `x` недоступна:

```
const multiplier = (num) => {
  const x = 10
  return num * x
}

console.log(x) // ReferenceError: x is not defined
```

`console.log` в глобальной области, `x` там не объявлена — `Reference Error`.

Глобальный `x` возможен отдельно:

```
const x = 55

const multiplier = (num) => {
  const x = 10
  return num * x
}

console.log(x) // 55
```

Два разных `x` в разных областях; имя совпадает, связи нет.

Любой блок `{ ... }` — локальная область, в том числе `if`:

```
let a = 0

if (a === 0) {
  const local = 10
}

console.log(local) // => ReferenceError: local is not defined
```

То же для `while` и `for`.

Локальное не видно снаружи; глобальное видно внутри:

```
let a = 0

const changer = () => {
  a++
}

console.log(a) // 0
changer()
console.log(a) // 1
```

`changer` меняет глобальную `a` только при вызове.

Всё в глобал — плохая идея: код становится хрупким. Держите данные там, где они нужны.

## Лексическая область видимости

Кроме глобальной и локальной, в JS действует **лексическая** область: поиск значения идёт от текущего блока наружу, слой за слоем. «Лексическая» значит: по тексту программы видно, что где видно. В других языках бывает [динамическая](https://en.wikipedia.org/wiki/Scope_(computer_programming)#Lexical_scope_vs._dynamic_scope) область.

```
let a = 7
let b = 10

const multiplier = () => {
  let a = 5
  return a * b
}

multiplier() // 50
```

`a` найдена внутри (5), `b` — снаружи (10). Внешняя `a = 7` не участвует.

Вложенные функции углубляют цепочку поиска. Это **лексическая область видимости**: видимость задаётся положением в коде; внутренние блоки видят внешние.

## Замыкание

Механизм областей видимости порождает **замыкания**.

**Замыкание** — функция вместе с окружением, где она была создана. Проще: функция «помнит» внешние переменные, которые использует.

```
const f = () => {
  return 0
}
```

Константа `f` и значение-функция — разные сущности. Вызов:

```
f()
```

Пример с запоминанием окружения:

```
const createPrint = () => {
  const name = 'King'

  const printName = () => {
    console.log(name)
  }

  return printName
}

const myPrint = createPrint()
myPrint()   // King
```

`name` и `printName` локальны для `createPrint`. `printName` читает `name` из внешней области. `createPrint()` возвращает функцию; снаружи `myPrint` — это она. После завершения `createPrint` её локальная область формально «закончилась», но `myPrint` всё ещё видит `name` — **замыкание**.

Разумное использование замыканий делает код чище; возможность возвращать функции как числа или строки сильно расширяет выразительность.

---

### Дополнительные материалы

1. [Variables and scoping / Exploring JS](https://exploringjs.com/es6/ch_variables.html)

1. [Scope / Wikipedia](https://en.wikipedia.org/wiki/Scope_(computer_science))

1. [Closure / Wikipedia](https://en.wikipedia.org/wiki/Closure_(computer_programming))

1. [Замыкания в JS / Mozilla Developer Network](https://developer.mozilla.org/ru/docs/Web/JavaScript/Closures)

## Далее →
