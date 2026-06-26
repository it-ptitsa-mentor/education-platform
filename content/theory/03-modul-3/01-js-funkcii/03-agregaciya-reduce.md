---
title: "Агрегация (reduce)"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: 164057f8-fcdb-4c5c-abf6-8e161ce80f8f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Агрегация (reduce)

Третья функция из «тройки» — `reduce()` («свертка») — служит для **агрегации**: одно итоговое значение, зависящее от всей коллекции (сумма, среднее, минимум, максимум и т.д.). Похожие приёмы уже встречались в теме про массивы.

`reduce()` сложнее `map()` и `filter()`, но тоже принимает функцию-колбек. Пример: сумма денег у группы людей.

```
const users = [
  { name: 'Igor', amount: 19 },
  { name: 'Danil', amount: 1 },
  { name: 'Ivan', amount: 4 },
  { name: 'Matvey', amount: 16 },
]

let sum = 0
for (const user of users) {
  sum += user.amount
}

console.log(sum) // => 40
```

У агрегации результат может быть любого типа — число, объект, массив. Часто нужно **начальное значение** — аккумулятор. В примере это `let sum = 0`: переменная накапливает итог.

Ещё пример — группировка имён по возрасту:

```
const users = [
  { name: 'Petr', age: 4 },
  { name: 'Igor', age: 19 },
  { name: 'Ivan', age: 4 },
  { name: 'Matvey', age: 16 },
]

const usersByAge = {}
for (const { age, name } of users) {
  // Проверяем добавлено ли уже свойство age в результирующий объект или нет
  if (!Object.hasOwn(usersByAge, age)) {
    usersByAge[age] = []
  }
  usersByAge[age].push(name)
}

console.log(usersByAge)
// => { 4: [ 'Petr', 'Ivan' ], 16: [ 'Matvey' ], 19: [ 'Igor' ] }
```

Итог — объект с массивами в свойствах; старт — пустой `{}`. Накопитель (`sum`, `usersByAge`) и есть аккумулятор.

Тот же подсчёт суммы через `reduce()`:

```
const users = [
  { name: 'Igor', amount: 19 },
  { name: 'Danil', amount: 1 },
  { name: 'Ivan', amount: 4 },
  { name: 'Matvey', amount: 16 },
]

const sum = users.reduce((acc, user) => {
  const newAcc = acc + user.amount
  return newAcc
}, 0)
// const sum = users.reduce((acc, user) => acc + user.amount, 0);

// Распишем
// user: Igor, acc = 0, return value 0 + 19
// user: Danil, acc = 19, return value 19 + 1
// user: Ivan, acc = 20, return value 20 + 4
// user: Matvey, acc = 24, return value 24 + 16
console.log(sum) // => 40
```

`reduce()` принимает колбек и начальное значение аккумулятора; финальный аккумулятор — и есть результат.

<!-- IMG (из Buildin, перезалить отдельно) -->
Колбек получает текущий аккумулятор и элемент коллекции и должен вернуть **новый** аккумулятор. `reduce()` не анализирует его содержимое — только передаёт по цепочке вызовов. Возвращать аккумулятор нужно всегда, даже если он не изменился.

Второй пример с `reduce()`:

```
const users = [
  { name: 'Petr', age: 4 },
  { name: 'Igor', age: 19 },
  { name: 'Ivan', age: 4 },
  { name: 'Matvey', age: 16 },
]

// предварительно подготовим функцию-обработчик
const cb = (acc, user) => {
  if (!Object.hasOwn(acc, user.age)) {
    acc[user.age] = []
  }
  acc[user.age].push(user.name)
  return acc // обязательно вернуть!
}

// Начальное значение аккумулятора – пустой объект
const usersByAge = users.reduce(cb, {})
```

Цикл ушёл; осталась та же логика плюс явный `return acc`.

Пошагово для колбека `(acc, user)`:

1. На первой итерации `acc` — пустой объект (второй аргумент `reduce`), `user` — `{ name: 'Petr', age: 4 }`. Создаётся ключ `4` с массивом `['Petr']`; возвращается `{ 4: ['Petr'] }` — это `acc` на следующем шаге.

1. `acc` = `{ 4: ['Petr'] }`, `user` = `{ name: 'Igor', age: 19 }`. Добавляется ключ `19`; возвращается `{ 4: ['Petr'], 19: ['Igor'] }`.

1. `acc` = `{ 4: ['Petr'], 19: ['Igor'] }`, `user` = `{ name: 'Ivan', age: 4 }`. Ключ `4` уже есть — имя дописывается в массив; возвращается `{ 4: ['Petr', 'Ivan'], 19: ['Igor'] }`.

1. Последний шаг: `user` = `{ name: 'Matvey', age: 16 }`, добавляется ключ `16`; итог `{ 4: ['Petr', 'Ivan'], 16: ['Matvey'], 19: ['Igor'] }` — результат всего `reduce()`.

`reduce()` очень мощный: формально им можно заменить и `map`, и `filter`. Но агрегация явно ведёт состояние — код тяжелее читать. Если задачу закрывают `map` или `filter`, лучше ими и пользоваться.

## Как думать о редьюсе

Алгоритм для задач со сверткой. Допустим, есть список курсов с уроками, нужно посчитать общее число уроков (например, для оценки длительности программы). Такие задачи на учебной платформе встречаются часто.

```
// Упрощенная структура, чтобы не перегружать
// В реальности тут была бы куча дополнительных данных о курсе и об уроках
const courses = [
  {
    name: 'Arrays',
    lessons: [{ name: 'One' }, { name: 'Two' }],
  },
  {
    name: 'Objects',
    lessons: [{ name: 'Lala' }, { name: 'One' }, { name: 'Two' }],
  },
]
```

Два курса, пять уроков суммарно. Это агрегация: сводим коллекцию к одному числу. Начальный аккумулятор — `0` (см. урок про агрегацию в теме массивов). Алгоритм:

1. Инициализируем накапливаемый результат нулем

1. Обходим коллекцию курсов по одному
  - Прибавляем к аккумулятору количество уроков в текущем курсе

Один и тот же алгоритм в цикле и в `reduce`:

```
// loop
let result = 0
for (const course of courses) {
  result += course.lessons.length
}
console.log(result) // => 5

// reduce
const result = courses.reduce((acc, course) => acc + course.lessons.length, 0)
console.log(result) // => 5
```

## Реализация

Своя `myReduce()`:

```
const myReduce = (collection, callback, init) => {
  let acc = init // инициализация аккумулятора
  for (const item of collection) {
    acc = callback(acc, item) // Заменяем старый аккумулятор новым
  }
  return acc
}

const users = [
  { name: 'Petr', age: 4 },
  { name: 'Igor', age: 19 },
  { name: 'Ivan', age: 4 },
  { name: 'Matvey', age: 16 },
]

const oldest = myReduce(
  users,
  (acc, user) => (user.age > acc.age ? user : acc),
  users[0],
)
console.log(oldest) // => { name: 'Igor', age: 19 }
```

---

### Дополнительные материалы

1. [Метод reduce](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

1. [Функция has из библиотеки Lodash](https://lodash.com/docs/#has)

1. [Метод forEach](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

## Далее →
