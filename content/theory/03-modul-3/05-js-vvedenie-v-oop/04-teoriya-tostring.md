---
title: "Теория: toString()"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: 26f58b3d-e43f-4a1d-919e-7966b81d9252
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: toString()

В прототипе объектов JavaScript есть «магический» метод `Object.prototype.toString()`. Магия в том, что он вызывается сам, когда объект нужен как строка. На практике это даёт знакомое `'[object Object]'`:

```
const company = { name: 'Рога и копыта' }
company.toString() // "[object Object]"
// Использование объекта в строке приводит к автоматическому вызову
console.log(`I love ${company}!`) // "I love [object Object]!"
```

Зачем он нужен? В вебе объекты часто превращают в строку — для UI или обмена между приложениями. Список курсов: имя можно вывести так:

```
// Синтаксис фреймворка React
<h2>{course.name}</h2>
// вывод
// <h2>Рога и копыта</h2>
```

Если определить `toString()`, запись короче:

```
// Синтаксис фреймворка React
<h2>{course}</h2>
// вывод
// <h2>Рога и копыта</h2>
```

Выигрыш не только в краткости: вариантов вывода обычно много (лог, UI, API). Один `toString()` избавляет от явного преобразования везде; поменяли реализацию — обновился вывод во всех местах.

`toString()` — обычный метод прототипа, его можно переопределить:

```
const company = {
  name: 'Рога и копыта',
  toString() {
    return this.name
  },
}

company.toString() // "Рога и копыта"
console.log(`Я работаю в ${company}!`) // "Я работаю в Рога и копыта"
```

То же в прототипе конструктора:

```
function Company(name) {
  this.name = name
};

Company.prototype.toString = function toString() {
  return this.name
}

const company = new Company('Рога и копыта')
console.log(`Я работаю в ${company}!`) // "Я работаю в Рога и копыта"
```

Нужен вывод «как есть», без кастомного `toString()`? Получите бесполезный `[object Object]`. Тогда помогает JSON:

```
const company = new Company('Рога и копыта')
// JSON – это строка!
console.log(JSON.stringify(company)) // => '{"name":"Рога и копыта"}'
```

## Дополнительные материалы

- [Документация](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

## Далее →
