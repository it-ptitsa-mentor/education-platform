---
title: "Управляющие инструкции"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 7e99b83a-9837-4a33-a46f-ce5895c0db85
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Управляющие инструкции

В циклах JavaScript есть две инструкции, меняющие ход выполнения: `break` и `continue`. Они не обязательны, но на практике встречаются — о них стоит знать.

## Break

`break` завершает *цикл* (не функцию). Интерпретатор прекращает текущий цикл и переходит к коду сразу после него.

```
const coll = ['one', 'two', 'three', 'four', 'stop', 'five']

for (const item of coll) {
  if (item === 'stop') {
    break
  }
  console.log(item)
}
```

Тот же эффект достижим через `while` — семантически он лучше подходит для неполного перебора:

```
const coll = ['one', 'two', 'three', 'four', 'stop', 'five']

let i = 0
while (coll[i] !== 'stop') {
  console.log(coll[i])
  i += 1
}
```

`while` уместен, когда число итераций **заранее неизвестно** — ждём условия выхода или ищем элемент:

```
let i = 0
// Бесконечный цикл! Опасно запускать!
while (true) {
  console.log(i)
  i += 1
}
```

Когда итераций **известное количество**, чаще берут `for`. В отличие от `while`, `for...of` гарантированно завершится после всех элементов, даже если `break` не сработает:

```
const coll = ['one', 'two', 'three', 'four', 'stop', 'five']
for (const item of coll) {
  if (false) {
    // Условие никогда не выполнится, но цикл все равно завершит работу
    break
  }

  console.log(item)
}
```

## Continue

`continue` пропускает оставшуюся часть текущей итерации. Пример с `myCompact()`:

```
const myCompact = (coll) => {
  const result = []

  for (const item of coll) {
    if (item === null) {
      continue
    }

    result.push(item)
  }

  return result
}
```

Без `continue` код короче:

```
const myCompact = (coll) => {
  const result = []

  for (const item of coll) {
    if (item !== null) {
      result.push(item)
    }
  }

  return result
}
```

## Выводы

`break` и `continue` добавляют гибкости обходу, но почти всегда можно обойтись без них — и код часто станет проще. По возможности избегайте.

---

### Дополнительные материалы

1. [Break](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/break)

1. [Continue](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/continue)

## Далее →
