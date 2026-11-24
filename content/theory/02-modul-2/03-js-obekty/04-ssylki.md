---
title: "Ссылки"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: d197f219-0527-4444-b1d8-d1c3a17e83bd
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Ссылки

Объекты — ссылочный тип: переменные и константы хранят не сами данные, а ссылку на них. Отсюда ощущение, что `const` «изменяем» — на самом деле неизменна связь со ссылкой, а не с содержимым объекта:

```
const company = {}

// Поменять объект можно
company.name = 'Summer'

// Заменить ссылку нельзя
company = {} // Ошибка!

let object = {}

// А так можно
object = {}
```

Ссылочная природа влияет и на сравнение. Объекты равны не при одинаковой структуре, а когда это один и тот же экземпляр в памяти:

```
const company = { name: 'Summer' }

company === { name: 'Summer' } // false

const copyOfCompany = company // передается ссылка

// Это одно и то же
copyOfCompany === company // true

// Меняя одно, меняем и другое
company.createdAt = 2012

console.log(copyOfCompany) // { name: 'Summer', createdAt: 2012 }
```

Обе константы содержат ссылку на один и тот же объект в памяти

![Ссылки — иллюстрация 1](course/theory/assets/restored/02-modul-2/03-js-obekty/04-ssylki/1.png)
Каждое объявление объекта (в том числе пустого), создает новый объект. Поэтому даже два пустых объекта никогда не равны друг другу:

```
{} === {}; // false
```

![Ссылки — иллюстрация 2](course/theory/assets/restored/02-modul-2/03-js-obekty/04-ssylki/2.png)
Сильнее всего ссылки проявляются в функциях. Объект в аргумент передаётся по ссылке — изменения внутри функции видны снаружи:

```
const changeObj = (o) => {
  o.key = 'value'
}

const obj = {}

changeObj(obj)
console.log(obj) // { key: 'value' };
```

## Далее →
