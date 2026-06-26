---
title: "Интерполяция"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: b6959166-657e-4ae2-9076-dc773b94552a
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Интерполяция

Собрать приветствие из констант и знаков препинания можно конкатенацией:

```
const firstName = 'Joffrey'
const greeting = 'Hello'

console.log(greeting + ', ' + firstName + '!')
// => Hello, Joffrey!
```

С `+` легко запутаться в кавычках и пробелах.

Удобнее — **интерполяция** в шаблонных строках (бектики):

```
const firstName = 'Joffrey'
const greeting = 'Hello'

// Обратите внимание на ограничители строки, это бектики
// Интерполяция не работает с одинарными и двойными кавычками
console.log(`${greeting}, ${firstName}!`)
// => Hello, Joffrey!
```

В бектиках подставляем значения через `${переменная}` — один шаблон вместо цепочки `+`.

Интерполяция работает только со строками в бектиках. Это символ `.

С помощью интерполяции можно выводить несколько строк без указания специальных символов для перевода строк:

```
console.log(`- Are you hungry?
- Aaaarrrgh!`)
```

Результат:

```
- Are you hungry?
- Aaaarrrgh!
```

Шаблонные строки читаются лучше конкатенации и не путают `+` со сложением.

---

### Дополнительные материалы

1. [Шаблонные строки](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings)

## Далее →
