---
title: "Таймеры"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 1cdf9148-ffec-49c6-9356-102c62296eee
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Таймеры

Таймеры — отдельный класс асинхронных механизмов: они откладывают запуск функции на потом. Главный API — `setTimeout(f, delay)`:

```
const f = () => console.log('hey!')
setTimeout(f, 1000)
```

Функция `f` сработает не раньше чем через секунду — второй аргумент задаёт задержку в миллисекундах.

Зачем они нужны? В браузере — автоскрывающиеся уведомления, периодические Ajax-запросы за новыми данными. На сервере встречаются реже: ими иногда дробят тяжёлую синхронную работу на части, чтобы другой код успевал выполняться.

*В ОС это похоже на кооперативную многозадачность: создаётся иллюзия параллельности, хотя поток один.*

Колбек таймера выполняется не в текущем стеке — те же правила, что для остального асинхронного кода. Ошибки в таймере *try/catch* не поймает, нужны колбеки.

```
const f = () => console.log('hey!')
console.log('before timeout')
setTimeout(f, 1000)
console.log('after timeout')
// скрипт не заканчивается, а дожидается выполнения таймеров
```

Запуск:

```
node index.js

before timeout
after timeout
hey!
```

Могут ли таймеры гарантировать точный интервал? Нет. Рантайм проверяет таймеры, когда стек вызовов пуст. Долгое синхронное вычисление отодвинет все отложенные колбеки — задаётся минимальная задержка, а не точная.

Отсюда два вывода:

- Старайтесь не блокировать поток длинными вычислениями; дробите их на шаги.

- Не полагайтесь на точное время срабатывания — оно почти всегда больше заданного.

Таймер можно отменить: `setTimeout` возвращает идентификатор, `clearTimeout` его гасит:

```
const f = () => console.log('hey!')
console.log('before timeout')
// В браузере идентификатор таймера это числовое значение
// В node.js это объект
const timerId = setTimeout(f, 1000)
console.log('after timeout')
clearTimeout(timerId)
```

Запуск:

```
node index.js

before timeout
after timeout
```

*Идентификатор таймера возвращается синхронно внутри `setTimeout`, хотя сам колбек — асинхронен. Это не противоречит правилу «асинхронная функция не возвращает результат операции».*

Частая ошибка — передать в таймер не функцию, а результат её вызова:

```
const f = message => console.log(message)
console.log('before timeout')
setTimeout(f('hey!'), 1000)
console.log('after timeout')
```

Запуск:

```
node index.js

before timeout
hey!
timers.js:390
    throw new ERR_INVALID_CALLBACK();
    ^

TypeError [ERR_INVALID_CALLBACK]: Callback must be a function
```

До последнего лога не дошли: `setTimeout` ждал функцию, а получил `undefined`.

Передать аргументы в колбек можно тремя способами:

**Дополнительные параметры в setTimeout**

Аргументы после второго (времени) попадут в колбек таймера:

```
const f = (a, b) => console.log(a + b)
setTimeout(f, 1000, 5, 8)
// =>  13
```

**Функция-обёртка**

Самый прозрачный вариант:

```
const f = (a, b) => console.log(a + b)
setTimeout(() => f(5, 8), 1000)
// =>  13
```

**bind**

`bind` меняет контекст, но также задаёт частично применённые аргументы:

```
const f = (a, b) => console.log(a + b)
// Первый параметр null потому что контекст не меняется
setTimeout(f.bind(null, 5, 8), 1000)
// =>  13
```

Таймер не делает асинхронной саму операцию внутри колбека — он лишь откладывает её старт. Синхронная работа в колбеке по-прежнему блокирует поток.

## setInterval

`setInterval` совпадает по сигнатуре с `setTimeout`, но вызывает функцию снова и снова, пока не вызовут `clearInterval`:

```
const id = setInterval(() => console.log(new Date()), 5000)
setTimeout(() => clearInterval(id), 16000)

// node index.js
// 2019-06-05T19:05:28.149Z
// 2019-06-05T19:05:33.172Z
// 2019-06-05T19:05:38.177Z
```

Остановить интервал можно изнутри колбека по его *id*:

```
let counter = 0
const id = setInterval(() => {
  counter += 1
  if (counter === 4) {
    clearInterval(id)
    return
  }
  console.log(new Date())
}, 5000)
```

---

### Дополнительные материалы

1. [setTimeout](https://developer.mozilla.org/ru/docs/Web/API/WindowTimers/setTimeout)

1. [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)

## Далее →
