---
title: "Прокси"
module: "Модуль 3"
topic: "Объектно-ориентированный дизайн"
buildin_id: 7f92cbaf-7ad1-4d78-a0eb-91486f9feb6b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Прокси

В JavaScript есть встроенный объект **Proxy** — по смыслу «действовать от имени другого». Через proxy можно управлять доступом к свойствам почти любого объекта. В прикладном коде это встречается реже, чем внутри библиотек и фреймворков: перегрузка операций, моки, передача сообщений, реактивное состояние, валидация, логирование, кеширование и т.д.

Схема такая: создаётся proxy, в конструктор передаются два аргумента (ниже), и дальше с исходным объектом работают через обёртку.

```
const proxy = new Proxy(target, handler)
```

`target` — объект, для которого нужен прокси. `handler` — объект с **обработчиками (ловушками)**, перехватывающими операции над `target`.

Простой пример: proxy подставляет значение по умолчанию, если свойства нет:

```
// Количество пользователей в разных странах
const usersCountByCountry = {}

const handlers = {
  get: (target, prop) => {
    // in проверяет наличие свойства по всей цепочке прототипов
    // В случае Proxy это правильнее чем _.has
    if (prop in target) {
      return target[prop]
    }

    return 0
  },
}

// obj – обернул исходный объект
const obj = new Proxy(usersCountByCountry, handlers)

obj.russia // 0
obj.russia += 1 // 1
obj.usa // 0
```

Proxy оборачивает объект и перехватывает обращения к нему. Обработчики называют **ловушками (trap)**; это методы объекта `handler`. Всего 13 ловушек; чаще всего — `get` и `set` для чтения и записи.

Ловушка **get** срабатывает при каждом чтении свойства. На вход — `target` и имя свойства. В примере возвращаем значение из `target`, если оно есть, иначе `0`:

```
get: (target, prop) => {
  if (prop in target) {
    return target[prop];
  }

  return 0;
},
```

Пример с ловушкой **set**:

```
const student = {
  name: 'Roman',
  age: 23,
  program: 'js-frontend',
}

const rewrite = new Proxy(student, {
  set: (target, prop, value) => {
    // если свойство есть в объекте, proxy позволяет нам его переписать
    if (prop in target) {
      target[prop] = value
      // при успешной записи, метод set() должен вернуть true
      return true
    }
    else {
      // если свойства нет в объекте, то выбросится ошибка, либо можем вернуть false
      throw new Error(`Cannot rewrite non-existed property '${prop}'`)
    }
  },
})
```

Присвоение несуществующему свойству даёт ошибку:

```
// Если попытаться изменить несуществующее свойство, то выдаст ошибку:
rewrite.country = 'Russia'
// Error: Cannot rewrite non-existed property 'country'

// Если свойство уже есть, то ошибки не будет:
rewrite.name = 'Alexandr'

console.log(student)
// => { name: 'Alexandr', age: 23, program: 'js-frontend' }
```

Идея Proxy — **прозрачность**: прикладной код не должен отличать proxy от обычного объекта. Тогда не придётся «затачивать» API под обёртку. Отсюда правила:

- У Proxy нет «своих» полей — он **проксирует** обращения

- Исходный объект нельзя достать и менять в обход ловушек

- По спецификации нельзя надёжно узнать, что перед вами proxy (технически [проверка есть](https://nodejs.org/api/util.html#util_util_types_isproxy_value), но в нормальном коде её не используют)

## Дополнительные материалы

- [Документация Proxy](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

- [on-change](https://github.com/sindresorhus/on-change)

- [Геттеры и сеттеры (MDN)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/get)

- [Приватные поля классов с # (MDN)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/Private_properties)

## Далее →
