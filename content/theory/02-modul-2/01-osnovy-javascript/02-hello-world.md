---
title: "Hello, World!"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: 40ed8b88-548d-4673-b547-c29adcb5f2b4
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Hello, World!

Начнём с классической программы «Hello, World!» — она выводит текст на экран. Для вывода в JavaScript используют команду `console.log()`:

<!-- IMG (из Buildin, перезалить отдельно) -->
```javascript
console.log('Hello, World!')
// => Hello, World!
```

Иногда в комментариях рядом с кодом показываем результат выполнения: `// => РЕЗУЛЬТАТ`, например `// => 4`.

## Комментарии

В файлах с кодом бывают **комментарии** — текст для людей, не для интерпретатора. Ими помечают пояснения, TODO и напоминания.

```javascript
// Удалить строку ниже после реализации задачи по регистрации
console.log(10)
```

В JavaScript два вида комментариев.

*Однострочный* комментарий начинается с `//`: остаток строки не выполняется. Можно занять всю строку или писать несколько подряд:

```javascript
// For Winterfell!
// For Lanisters!
```

Комментарий может находиться на строке после какого-нибудь кода:

```javascript
console.log('I am the King') // For Lannisters!
```

*Многострочный* комментарий — между `/*` и `*/`.

```javascript
/*
  The night is dark and
  full of terrors.
*/
console.log('I am the King')
```

Их часто применяют для описания функций и блоков кода.

## Далее →
