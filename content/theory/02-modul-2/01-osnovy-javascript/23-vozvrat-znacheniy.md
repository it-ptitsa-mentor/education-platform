---
title: "Возврат значений"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: d2605217-981e-465d-885f-6c1c4024eb1f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Возврат значений

Функции из прошлых уроков часто только выводили данные в консоль:

```
const greeting = () => {
  console.log('Hello, World!')
}
```

Такой результат сложно использовать дальше в коде. Разберём на примере.

Возьмём регистрацию по email. Пользователь может ввести адрес по-разному:

- Добавив случайно пробелы в начале или в конце `_support@email.io__`

- Использовав буквы в разном регистре `SUPPORT@email.io`

Если сохранить строку как есть, вход может не сработать из‑за пробелов или регистра. Перед записью email обычно приводят к нижнему регистру и обрезают пробелы по краям — это пара строк:

```
const saveEmail = () => {
  // В реальности email приходит из формы
  const email = '  SuppORT@email.IO'
  // обрезаем пробельные символы
  const trimmedEmail = email.trim()
  const preparedEmail = trimmedEmail.toLowerCase()
  console.log(preparedEmail)
  // здесь будет запись в базу данных
}
```

Здесь работает **возврат значения**: `trim()` и `toLowerCase()` не пишут в консоль, а отдают новую строку — её можно положить в константу. Если бы они только печатали, присвоить результат было бы нельзя — как у `greeting()` ниже:

```
const message = greeting()
console.log(message) // => undefined
```

Переделаем `greeting()`: вместо вывода в консоль вернём строку через `return`

```
const greeting = () => {
  return 'Hello, World!'
}
```

`return` — инструкция возврата: значение справа уходит вызывающему коду, а функция на этом останавливается.

<!-- IMG (из Buildin, перезалить отдельно) -->
```
// Теперь мы можем использовать результат работы функции
const message = greeting()
console.log(message) // => Hello, World!
// И даже выполнить какие-то действия над результатом
console.log(message.toUpperCase()) // => HELLO, WORLD!
```

Код после `return` не выполняется:

```
const greetingWithCodeAfterReturn = () => {
  return 'Hello, World!'
  console.log('Я никогда не выполнюсь')
}
```

Возврат не запрещает вывод в консоль — можно и печатать, и возвращать:

```
const greetingWithReturnAndPrinting = () => {
  console.log('Я появлюсь в консоли')
  return 'Hello, World!'
}

// И напечатает текст на экран и вернет значение
const message = greetingWithReturnAndPrinting()
```

Справа от `return` может быть любое выражение — ориентируйтесь на читаемость:

```
const greeting = () => {
  const message = 'Hello, World!'
  return message
}
```

Возвращается не «переменная», а значение в ней. Пример с вычислением:

```
const doubleFive = () => {
  // или return 5 + 5
  const result = 5 + 5
  return result
}
```

Самопроверка: что вернёт `run()` в примере ниже?

```
// Определение
const run = () => {
  return 5
  return 10
}

// Что будет выведено на экран?
console.log(run())
```

---

### Дополнительные материалы

1. [return (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return)

## Далее →
