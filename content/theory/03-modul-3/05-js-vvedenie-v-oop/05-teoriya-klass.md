---
title: "Теория: Класс"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: 530f480a-e7c3-49b5-a8c4-137930f8dc17
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: Класс

Прототипы мощны, но низкоуровневы: много шаблонного кода, особенно для цепочек. Поэтому в язык добавили классы — привычнее большинству разработчиков. С классами писать на JavaScript проще, но они сильно отличаются от классов во многих других языках. Начнём с примера — обычная абстракция на JavaScript:

```
function Company(name, email) {
  this.name = name
  this.email = email
};

Company.prototype.getName = function getName() {
  return this.name
}

Company.prototype.getEmail = function getEmail() {
  return this.email
}

Company.prototype.setEmail = function setEmail(email) {
  this.email = email
}

const company = new Company('Рога и копыта')
console.log(company.getName()) // => "Рога и копыта"
```

Тот же смысл — классом:

```
// Каждый класс должен лежать в своем собственном файле
// Идеально если имя класса совпадает с именем файла с учетом регистра
class Company { // имя класса - это имя функции конструктора
  // Метод с именем constructor соответствует функции-конструктору
  // Он вызывается, когда мы делаем new Company(name, email)
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  // Это свойство getName с записанной в него обычной (function) функцией
  getName() {
    return this.name
  }

  getEmail() {
    return this.email
  }

  setEmail(email) {
    this.email = email
  }
}

// С точки зрения использования не меняется ничего
const company = new Company('Рога и копыта', 'support@me.io') // вызывается метод constructor
console.log(company.getName()) // => "Рога и копыта"
```

Метод `constructor` соответствует функции-конструктору; при `new` движок вызывает его сам. Нет конструктора — ничего страшного, это как пустой конструктор:

```
function Company() {

}

const company = new Company()
```

Классы поднимают уровень абстракции и дают привычный инструмент. На прикладном коде можно не думать о прототипах под капотом — до отладки и библиотек, где прототипы иногда нужны напрямую.

## Свойства

У объектов бывают поля со значениями по умолчанию. У компании — список сотрудников: если никого не добавляли, `getEmployees()` должен вернуть `[]`, иначе везде придётся проверять на `undefined`:

```
const company = new Company()
company.getEmployees() // []
```

Без классов — в конструкторе:

```
function Company() {
  this.employees = []
}
```

В классах так же:

```
class Company {
  constructor() {
    this.employees = []
  }
  // остальные методы
}
```

Есть и полевая запись в теле класса:

```
class Company {
  employees = []
}
```

Так инициализируется свойство у каждого экземпляра. Такой синтаксис встречается всё чаще.

## Подводные камни

Классы в JavaScript не «заморожены», как во многих статических языках. Под капотом — прототипы и функции-конструкторы. После объявления класса можно дописать прототип:

```
// В любом месте программы после определения класса
Company.prototype.greeting = function greeting() {
  return `Hello, ${this.name}!`
}

const company = new Company('Рога и копыта')
console.log(company.greeting()) // => "Hello, Рога и копыта!"
```

## Как правильно использовать классы?

Классы в JavaScript нужны не всегда. Язык мультипарадигменный (в отличие от Java): простое — просто, сложное — сложными средствами.

ООП и классы не выучить только по курсам — нужен продакшен, ошибки и разбор с более опытными коллегами.

Миф: классы «моделируют реальный мир». Иногда так и делают (компания в примере), но это узкий взгляд. В больших приложениях сотни классов без связи с «реальностью» — адаптеры БД, стратегии кеша. В следующих курсах по ООП разберём проектирование и когда вводить классы.

## Дополнительные материалы

- [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)

## Далее →
