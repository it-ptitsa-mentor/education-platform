---
title: "Теория: Контекст (This)"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: 214d255e-3929-48ab-9afc-e58b1bce37f1
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: Контекст (This)

Чтобы уверенно работать с ООП в JavaScript, нужно понять контекст `this`. На нём держится почти всё остальное — в том числе поведение методов и классов.

Усложняет картину то, что у обычных и стрелочных функций контекст ведёт себя по-разному. Стрелочные появились позже, поэтому логично начать с обычных. Напоминание, как они выглядят:

```
// Определение стрелочной функции и присваивание константе
const f = () => 'i am an arrow function';

// Определение обычной анонимной функции
function() {
  return 'i am a regular function without name';
}

// Определение обычной именованной функции
function f() {
  return 'i am a regular function with name';
}
```

В этом уроке — только обычные функции; стрелочные разберём отдельно. Для контекста именованные и анонимные обычные функции ведут себя одинаково.

В JavaScript функции — полноценные значения: их можно класть в переменные, константы и свойства объектов. Функция в свойстве объекта называется методом:

```
const company = { name: 'Рога и копыта' }
// Создание функции, которая сразу же присваивается свойству getName и становится методом
company.getName = function () {
  return 'Рога и копыта'
}

// Вызов метода
company.getName() // "Рога и копыта"
```

Это лишь один способ «посадить» функцию в объект. Ещё варианты:

```
// При создании объекта
const obj = {
  getName: function () {
    return 'Рога и копыта'
  },
}

// Через присваивание константы
const company = { name: 'Рога и копыта' }

function getCompany() {
  return 'Рога и копыта'
};
// Имя не принципиально
company.getName = getCompany

company.getName() // "Рога и копыта"
```

Все примеры эквивалентны по результату, но есть нюанс. Метод возвращает строку и не читает данные объекта. Смените `name` — метод всё равно вернёт захардкоженное значение, а не актуальное имя в объекте.

```
company.getName() // "Рога и копыта"
company.name = 'Рога без копыт'
// Имя поменяли, но очевидно, что возврат остался прежний
company.getName() // "Рога и копыта"
```

Чтобы метод видел состояние объекта, внутри него используют `this` — контекст. В методах `this` указывает на объект, из которого вызвали метод.

```
const company = { name: 'Рога и копыта', employees: [] }
company.getName = function getName() {
  return this.name
}

company.getName() // "Рога и копыта"
company.name = 'Рога без копыт'
company.getName() // "Рога без копыт"
```

Через `this` можно не только читать поля, но и менять их:

```
company.setName = function setName(name) {
  this.name = name
}

company.getName() // "Рога и копыта"
company.setName('Рога без копыт')
company.getName() // "Рога без копыт"
```

Ещё пример — правка внутреннего массива:

```
// Добавление нового сотрудника
company.addEmployee = function addEmployee(user) {
  // Важно, что на момент вызова, employees уже добавлен в company
  this.employees.push(user)
}

const user = { name: 'Petya' }
company.addEmployee(user)
company.employees // [{ name: 'Petya' }]

// Или через метод

company.getEmployees = function () {
  return this.employees
}

company.getEmployees() // [{ name: 'Petya' }]
```

Свойства можно менять напрямую или через методы — выбор зависит от задачи. С опытом и следующими курсами станет яснее, когда что уместнее.

## Контекст

Раньше говорили: `this` ссылается на объект, к которому «привязан» метод. Здесь важное отличие JavaScript от многих языков: у метода `this` может меняться:

```
const company1 = { name: 'Рога и копыта', getName: function getName() { return this.name } }
const company2 = { name: 'Рога без копыт' }

company1.getName() // "Рога и копыта"

company2.getName = company1.getName

// В обоих случаях одна и та же функция
company2.getName() // "Рога без копыт"
company1.getName() // "Рога и копыта"
```

Та же функция, вызванная из другого объекта, получила другой `this`. Это позднее связывание: `this` — тот объект, с которого идёт вызов.

Понять проще, если знать, как движок вызывает функции. У функций-объектов есть метод `call()` — им и пользуются при вызове:

```
const sayHi = () => 'Hi!'
sayHi.call() // "Hi!"
```

Первый аргумент `call()` — контекст, на который внутри функции смотрит `this`. Функция не обязана быть методом:

```
const getName = function getName() {
  return this.name
}

const company1 = { name: 'Рога и копыта' }
// Функция вызывается напрямую, она не является методом
getName.call(company1) // "Рога и копыта"

const company2 = { name: 'Рога без копыт' }
getName.call(company2) // "Рога без копыт"
```

Мы подменили контекст `getName()` через `call()`. В этом суть `this`: ссылка на контекст, который можно задать явно. При вызове метода движок подставляет контекст сам — тогда `this` совпадает с объектом слева от точки. Например, у `company.getName()` контекст — `company`:

```
const company = { name: 'Рога и копыта', getName: function getName() { return this.name } }
```

Проверьте себя: что выведется?

```
const company = {
  name: 'Рога и копыта',
  country: {
    name: 'Finland',
    getName: function getName() {
      return this.name
    },
  },
}

console.log(company.country.getName()) // => ?
```

Ответ: `"Finland"`. Контекст `getName()` — `country`, не `company`. Яснее так:

```
const { country } = company
console.log(country.getName()) // "Finland"
```

## Сокращенное определение методов

Из-за обычных функций в литералах объектов появился короткий синтаксис методов:

```
const company = {
  name: 'Рога и копыта',
  getName() {
    return this.name
  },
  // То же самое что
  // getName: function getName() {
  //   return this.name;
  // },
}
```

Это синтаксический сахар: запись короче, поведение то же. Важно: это обычная функция, не стрелочная. Дальше будем писать методы так.

## Дополнительные материалы

- [Объекты первого класса](http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%8A%D0%B5%D0%BA%D1%82_%D0%BF%D0%B5%D1%80%D0%B2%D0%BE%D0%B3%D0%BE_%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%B0)

- [YDKJS: This](https://github.com/azat-io/you-dont-know-js-ru/blob/master/this%20%26%20object%20prototypes/ch1.md)

## Далее →
