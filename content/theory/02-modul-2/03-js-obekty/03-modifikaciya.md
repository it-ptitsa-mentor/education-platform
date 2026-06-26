---
title: "Модификация"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: 888dda58-0e7e-4c15-b1ca-622f88f138cb
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Модификация

Создание и обновление свойств — одна и та же операция присваивания. Для нового ключа запишется значение, для существующего — перезапишется:

```javascript
const user = { name: 'Vasya', married: true, age: 25 }

user.married = false
// Изменение существующего свойства
// То же самое
// user['married'] = false;

user.surname = 'Petrov'
// Добавление нового свойства
// То же самое
// user['surname'] = 'Petrov';

console.log(user)
// => { name: 'Vasya', married: false, age: 25, surname: 'Petrov' }
```

Объект объявлен через `const`, но меняется — по той же причине, что и массивы: в константе хранится ссылка, а не сам объект. Менять содержимое можно, подменить объект целиком — нельзя:

```javascript
const user = { name: 'Maria' }
user.name = 'Igor'

// Возникнет ошибка
user = { name: 'Mike' } // Boom!
```

Подробнее об этом — в одном из следующих уроков.

Изменяемость позволяет наращивать объект по шагам: сначала пустой, потом нужные поля:

```javascript
const course = {}

course.name = 'IT Птица — JS: Объекты'
course.description = 'Самый классный курс на свете, не проходите мимо, дети!'

console.log(course.name) // 'IT Птица — JS: Объекты'

console.log(course)
// {
//   name: 'IT Птица — JS: Объекты',
//   description: 'Самый классный курс на свете, не проходите мимо, дети!'
// }
```

Удалить свойство можно оператором `delete`:

```javascript
const user = { name: 'Vasya', wrongProp: 'bug' }

delete user.wrongProp

console.log(user)
// => { name: 'Vasya' }
```

Несмотря на `delete`, удалять поля из объекта — плохая привычка. Дальше вы увидите, что те же задачи решаются без удаления, и такой код обычно чище.

---

## Далее →
