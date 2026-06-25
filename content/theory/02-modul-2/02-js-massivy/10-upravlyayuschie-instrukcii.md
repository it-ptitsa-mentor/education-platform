---
title: "Управляющие инструкции"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 7e99b83a-9837-4a33-a46f-ce5895c0db85
---

# Управляющие инструкции

- [Break](https://buildin.ai/7e99b83a-9837-4a33-a46f-ce5895c0db85#a621efd4-4bba-40a4-bef6-5c46431a7726)

- [Continue](https://buildin.ai/7e99b83a-9837-4a33-a46f-ce5895c0db85#5691840c-c3cc-45e4-97e2-62767bcbed15)

- [Выводы](https://buildin.ai/7e99b83a-9837-4a33-a46f-ce5895c0db85#e0ea3f04-0f10-4009-b5f8-9bb141489eb1)

В циклах JavaScript доступны для использования две инструкции, влияющие на их поведение: `break` и `continue`. Их использование не является необходимым, но все же они встречаются на практике. Поэтому про них нужно знать.

## Break

Инструкция `break` производит *выход из цикла*. Не из функции, а из цикла. Встретив ее, интерпретатор перестает выполнять текущий цикл и переходит к инструкциям, идущим сразу за циклом.

```
const coll = ['one', 'two', 'three', 'four', 'stop', 'five']

for (const item of coll) {
  if (item === 'stop') {
    break
  }
  console.log(item)
}
```

То же самое легко получить без `break`, используя цикл `while`. Этот цикл семантически лучше подходит для такой задачи, так как подразумевает неполный перебор:

```
const coll = ['one', 'two', 'three', 'four', 'stop', 'five']

let i = 0
while (coll[i] !== 'stop') {
  console.log(coll[i])
  i += 1
}
```

Цикл `while` идеален для ситуаций, когда количество итераций **неизвестно** заранее. Например, при ожидании условия для выхода или при поиске простого числа — как в коде выше.

Если условие в цикле `while` будет истинным, то цикл будет бесконечным. Важно помнить об этом и всегда проверять условие в таком цикле:

```
let i = 0
// Бесконечный цикл! Опасно запускать!
while (true) {
  console.log(i)
  i += 1
}
```

Когда количество итераций **известно**, предпочтительнее использовать цикл `for`. В отличие от `while`, цикл `for of` гарантированно остановится после перебора всех элементов, даже если условие **break** не будет достигнуто:

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

Инструкция `continue` позволяет пропустить итерацию цикла. Ниже пример с функцией `myCompact()`, которая удаляет `null` элементы из массива:

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

Код без `continue` получается проще:

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

`break` и `continue` призваны добавить гибкости в управление процессом обхода. На практике всегда можно построить код без них — скорее всего, он будет даже проще. По возможности избегайте этих конструкций.

---

### Дополнительные материалы

1. [Break](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/break)

1. [Continue](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/continue)

## Далее →
