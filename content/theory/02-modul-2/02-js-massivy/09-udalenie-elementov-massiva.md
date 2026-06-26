---
title: "Удаление элементов массива"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 0b8d0754-362b-4cf0-80e2-4150761bbfc0
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Удаление элементов массива

В JavaScript нет простого «удалить элемент и сдвинуть остальные» одной командой. `delete` очищает ячейку, но слот остаётся:

```
const numbers = [1, 10]
delete numbers[0]
console.log(numbers)
// => [ <1 empty item>, 10 ]
```

Метод [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) мощнее, но синтаксис менее очевиден.

Задача удаления всё равно частая — часто по правилу, не один индекс. Классика — *compact*: убрать `null`. Как сделать правильно?

Обычно «удаление» значит **новый массив** без лишних элементов, а не дырки в старом. Пример `compact()`:

```
const compact = (coll) => {
  // Инициализация результата
  // Для пустой входной коллекции результатом будет пустой массив
  const result = []

  for (const item of coll) {
    if (item !== null) {
      result.push(item)
    }
  }

  return result
}

console.log(compact([0, 1, false, null, true, 'wow', null]))
// => [ 0, 1, false, true, 'wow' ]
console.log(compact([]))
// => []
```

Важно: `coll` не меняется. Собирается `result` только из подходящих значений. Так и стоит понимать «удалить из массива» — меньше скрытых эффектов, проще отладка, исходник остаётся для сравнения.

Это тоже агрегация, только результат — массив, не число. Прореживание по условию обычно называют **фильтрацией**.

## Далее →
