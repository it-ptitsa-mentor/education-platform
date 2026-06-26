---
title: "Fluent Interface"
module: "Модуль 3"
topic: "Объектно-ориентированный дизайн"
buildin_id: 10012da0-6ecf-489f-bae7-878f4136399b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Fluent Interface

**Domain Specific Language** (предметно-ориентированный язык) — это язык, заточенный под конкретную предметную область. Его структура повторяет задачи, которые с ним решают. Знакомый пример — [jQuery](https://jquery.com/): через неё управляют отображением и поведением страницы:

```
// Вызов методов через точку в одной строчке
// Элементу с классом box выставляется цвет текста и высота
('.box').css('color', '#333').height(200)
```

Такой DSL часто строят через **текучий интерфейс (Fluent Interface)**: вызовы методов идут цепочкой. Технически цепочку можно собрать двумя способами.

Первый — возвращать `this` из методов, участвующих в цепочке. `this` указывает на объект, в контексте которого вызван метод, значит его можно вернуть как обычное значение.

```
class Collection {
  constructor(coll) {
    this.coll = coll
  }

  map(fn) {
    // На коллекции вызывается метод map() массива
    this.coll = this.coll.map(element => fn(element))

    return this
  }

  filter(fn) {
    this.coll = this.coll.filter(element => fn(element))

    return this
  }

  // Возвращает саму коллекцию, а не this.
  // Этот метод всегда последний в цепочке вызовов Collection.
  all() {
    return this.coll
  }
}

const cars = new Collection([
  { model: 'rapid', year: 2016 },
  { model: 'rio', year: 2013 },
  { model: 'mondeo', year: 2011 },
  { model: 'octavia', year: 2014 },
])

cars.filter(car => car.year > 2013)
  .map(car => car.model)
cars.all() // [rapid, octavia]
```

Минус подхода: объект **мутирует**. Коллекцию нельзя безопасно переиспользовать для разных выборок — фильтры и преобразования накладываются друг на друга.

На практике чаще берут второй путь, который мы уже разбирали раньше: вместо `this` возвращают **новый** экземпляр того же класса с обновлёнными данными.

```
class Collection {
  constructor(coll) {
    this.coll = coll
  }

  map(fn) {
    const newColl = this.coll.map(element => fn(element))

    return new Collection(newColl)
  }

  filter(fn) {
    const newColl = this.coll.filter(element => fn(element))

    return new Collection(newColl)
  }

  // Возвращает саму коллекцию, а не this.
  // Этот метод всегда последний в цепочке вызовов Collection.
  all() {
    return this.coll
  }
}

const cars = new Collection([
  { model: 'rapid', year: 2016 },
  { model: 'rio', year: 2013 },
  { model: 'mondeo', year: 2011 },
  { model: 'octavia', year: 2014 },
])

const filteredCars = cars.filter(car => car.year > 2013)
const mappedCars = filteredCars.map(car => car.model)
mappedCars.all() // [rapid, octavia]
cars.all()
// [
//   { model: 'rapid', year: 2016 },
//   { model: 'rio', year: 2013 },
//   { model: 'mondeo', year: 2011 },
//   { model: 'octavia', year: 2014 },
// ]
```

Каждый шаг цепочки даёт новый объект. Так проще переиспользовать коллекции: изменение одной не тянет за собой остальные.

## Дополнительные материалы

- [Текучий интерфейс](https://ru.wikipedia.org/wiki/Fluent_interface)

## Далее →
