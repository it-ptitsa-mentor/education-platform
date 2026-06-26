---
title: "Стек вызовов (Call Stack)"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 64681c68-6479-45a6-9ad1-41dbc3758672
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Стек вызовов (Call Stack)

Перед асинхронностью разберём, как выполняется обычный код:

```
const data = [16, 64, 4]
const data2 = data.map(Math.sqrt) // [4, 8, 2]
const predicate = v => v > 2
const data3 = data2.filter(predicate) // [4, 8]
```

Каждая строка ждёт завершения предыдущей — это **синхронное** выполнение. Отдельная строка при этом может быть сколь угодно сложной.

Во второй строке `map()` внутри вызывает `Math.sqrt()`. В реальных программах вложенность достигает сотен уровней. При исполнении формируется **стек вызовов** (call stack): каждый вложенный вызов кладёт функцию в стек до самой глубокой; при возврате стек раскручивается в обратном порядке.

<!-- IMG (из Buildin, перезалить отдельно) -->
Цепочка *one() → two() → three() → four()*:

```
const four = () => console.log('END!')
const three = () => four()
const two = () => three()
const one = () => two()

one() // Запускаем
```

Порядок:

```
one
=> two
   => three
      => four
   => three
=> two
one
```

Сначала погружение до самого глубокого вызова, затем подъём к корню стека.

В сообщениях об ошибках мы видим **backtrace** — стек вызовов в обратном порядке. Допустим опечатку в третьей строке:

```
const data = [16, 64, 4]
const data2 = data.map(Math.sqrt) // [4, 8, 2]
const predicate = v => unknown > 2
const data3 = data2.filter(predicate) // ReferenceError
```

Запуск (*index.js*):

```
node index.js

index.js:3
const predicate = (v) => unknown > 2;
                               ^

ReferenceError: unknown is not defined
    at predicate (index.js:3:32)
    at Array.filter (<anonymous>)
    at Object.<anonymous> (index.js:4:21)
```

Стек растёт только при вызовах **вглубь**. В backtrace нет первых двух строк — там только путь от `filter` вниз.

Исключения в JS опираются на стек: ошибка поднимается вверх до *try/catch* или до опустошения стека.

```
const data = [16, 64, 4]
const data2 = data.map(Math.sqrt) // [4, 8, 2]
const predicate = v => unknown > 2

try {
  const data3 = data2.filter(predicate) // ReferenceError
}
catch (e) {
  console.log('Catch it')
  console.log(e.stack)
}
```

`predicate` объявлена вне *try/catch*, но вызывается внутри блока — ошибка всё равно поймается:

```
node index.js

Catch it
ReferenceError: unknown is not defined
    at predicate (index.js:3:32)
    at Array.filter (<anonymous>)
```

Есть инструменты визуализации стека при **профайлинге** — поиске узких мест.

<!-- IMG (из Buildin, перезалить отдельно) -->
С асинхронным кодом картина меняется — в следующем уроке.

---

### Дополнительные материалы

1. [Стек](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B5%D0%BA)

1. [Стек вызовов](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B5%D0%BA_%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%BE%D0%B2)

1. [Concurrency model and Event Loop (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)

## Далее →
