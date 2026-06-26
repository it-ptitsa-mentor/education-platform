---
title: "Деструктуризация"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: fb34d121-cc3d-4c99-b00f-f4fce8fae298
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Деструктуризация

В реальных приложениях объекты часто многоуровневые: поля внутри полей, снова внутри полей. Обращаться к таким данным напрямую неудобно, если одни и те же вложенные части нужны многократно:

```
const greeting = `${user.company.name} was founded in ${user.company.createdAt}`
console.log(greeting)
```

Чтобы не повторять длинные цепочки, выносят промежуточные константы:

```
const company = user.company
const greeting = `${company.name} was founded in ${company.createdAt}`
console.log(greeting)
```

Чем больше вложенных полей, тем заметнее выигрыш — но само извлечение разрастается, когда данных много. Пример из практики:

```
const response = {
  data: {
    type: 'photos',
    id: '550e8400-e29b-41d4-a716-446655440000',
    attributes: {
      title: 'Ember Hamster',
      src: 'http://example.com/images/productivity.png',
    },
    relationships: {
      author: {
        links: {
          related: 'http://example.com/articles/1/author',
        },
      },
    },
    links: {
      self: 'http://example.com/photos/550e8400-e29b-41d4-a716-446655440000',
    },
  },
}
```

Это ответ вымышленного API в формате [jsonapi](https://jsonapi.org/) — такой формат часто встречается в веб-приложениях для обмена данными между сервером и клиентом. На клиенте из ответа достают нужные поля и показывают их в интерфейсе. Без деструктуризации извлечение выглядело бы так:

```
const user = response.data.attributes
const links = response.data.links
const author = response.data.relationships.author
```

Чем глубже структура и чем больше фрагментов нужно, тем больше однотипного кода. Раньше так и писали; в современном JavaScript есть более короткий способ.

**Деструктуризация** (destructuring) — синтаксис извлечения частей из составных значений. Объект «раскладывается» на отдельные переменные:

```
const person = { firstName: 'Rasmus', lastName: 'Lerdorf', manager: true }

const { firstName, manager } = person

console.log(firstName) // => 'Rasmus'
console.log(manager) // => true
```

Синтаксис похож на литерал объекта, но работает в обратную сторону. Извлекать нужно не всё сразу — в примере три свойства, а вынимаем два. Порядок имён в фигурных скобках не важен.

Имена можно менять — если нужное имя уже занято:

```
const manager = /* ... */; // имя занято

const person = { firstName: 'Rasmus', lastName: 'Lerdorf', manager: true };

const { manager: isManager } = person;

console.log(isManager); // => true
```

Если свойства нет, можно задать значение по умолчанию:

```
const person = { firstName: 'Rasmus', lastName: 'Lerdorf' }

console.log(person.manager) // undefined
const { manager = false } = person
console.log(manager) // => false
```

Деструктуризация бывает вложенной — извлекать можно на любую глубину. Пример с `response` выше:

```
// const user = response.data.attributes;
// const links = response.data.links;
// const author = response.data.relationships.author;

const { links, attributes: user, relationships: { author } } = response.data
```

У spread есть «обратный» оператор **rest**: при деструктуризации оставшиеся свойства собираются в один объект:

```
const user = { name: 'Tirion', email: 'support@email.io', age: 44 }

const { name, ...rest } = user

console.log(rest)
// => { email: 'support@email.io', age: 44 }
```

Деструктуризация не обязательна для архитектуры программы, но при умеренном использовании делает код короче и читабельнее.

## Далее →
