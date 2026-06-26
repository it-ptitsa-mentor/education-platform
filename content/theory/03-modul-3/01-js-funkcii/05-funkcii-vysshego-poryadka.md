---
title: "Функции высшего порядка"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 2a4fb7a4-c632-45f6-870a-35c2ad0b185f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Функции высшего порядка

В JavaScript есть [sort](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/sort): по умолчанию элементы приводятся к строкам и сравниваются по Unicode — для простых чисел сойдёт, для массива объектов уже нет.

Допустим, нужно отсортировать пользователей по возрасту:

```
const users = [
  { name: 'Igor', age: 19 },
  { name: 'Danil', age: 1 },
  { name: 'Vovan', age: 4 },
  { name: 'Matvey', age: 16 },
]
```

Встроенная сортировка не знает, по какому полю и в каком порядке сравнивать — это решает вызывающий код. Сигнатура `sort`:

```
elements.sort([compareFunction])
```

Необязательный `compareFunction` задаёт правило сравнения. Алгоритм перестановки один; меняется только то, *что* сравнивать:

```
const users = [
  { name: 'Igor', age: 19 },
  { name: 'Danil', age: 1 },
  { name: 'Vovan', age: 4 },
  { name: 'Matvey', age: 16 },
]

// Функция принимает на вход сравниваемые элементы массива
const compare = (a, b) => {
  if (a.age === b.age) {
    return 0
  }

  return a.age > b.age ? 1 : -1
}

users.sort(compare)

console.log(users)
// => [ { name: 'Danil', age: 1 },
//      { name: 'Vovan', age: 4 },
//      { name: 'Matvey', age: 16 },
//      { name: 'Igor', age: 19 } ]
```

`sort()` двигает элементы; колбек получает пару элементов и возвращает `-1`, `0` или `1`. В примере сравнение идёт по `age`; вызовов колбека много — по одному на каждое сравнение внутри сортировки.

Такие функции называют **функциями высшего порядка** (higher-order functions): они принимают и/или возвращают другие функции, реализуют общий алгоритм и делегируют детали колбеку. Колбек — любая функция, которую вызывает не ваш код напрямую, а обёртка (`sort`, `map` и т.д.).

Колбек часто передают анонимно:

```
users.sort((a, b) => {
  if (a.age === b.age) {
    return 0
  }
  return a.age > b.age ? 1 : -1
})

// То же самое, но используя функцию Math.sign
users.sort((a, b) => Math.sign(a.age - b.age))
```

Разберитесь, где заканчивается внешний вызов и начинается колбек — такой стиль станет основным дальше по курсу.

Вызов колбека изнутри:

```
const say = (fn) => {
  const message = fn()
  console.log(message)
}
// или так:
// const say = (fn) => console.log(fn());

const myCallbackFn = () => 'hi!'
say(myCallbackFn) // => hi!
// или так:
// say(() => 'hi!');
```

`say()` вызывает функцию из параметра `fn` и печатает её результат.

Функции высшего порядка во многих языках заменяют явные циклы. Идиоматичный фрагмент на JS:

```
// Просто демонстрация
// Разбирать его не надо
users
  .filter(user => user.age >= 16)
  .map(user => `${user.name} is ${user.age} years old`)
  .join('\n')
// => Igor is 19 years old
//    Matvey is 16 years old
```

Здесь два прохода (`filter`, `map`), два колбека и цепочка без `for`. Дальше разберём `map`, `filter` и `reduce` — ими закрывается большинство задач над коллекциями.

Постепенно циклы в учебных задачах уступают место этой тройке. В JavaScript бизнес-логика часто строится на функциях высшего порядка — к ним стоит привыкнуть. В [примере реального кода на GitHub](https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js) обратите внимание, как редко встречаются явные циклы в пользу цепочек методов.

---

### Дополнительные материалы

1. [Функция высшего порядка](https://ru.wikipedia.org/wiki/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F_%D0%B2%D1%8B%D1%81%D1%88%D0%B5%D0%B3%D0%BE_%D0%BF%D0%BE%D1%80%D1%8F%D0%B4%D0%BA%D0%B0)

## Далее →
