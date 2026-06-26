---
title: "Сопоставление типов"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 26b04d3e-9b8d-4230-b510-0ad6655df071
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Сопоставление типов

Чтобы не дублировать поля объектных типов, используют *Lookup Types* — доступ к типу свойства по имени:

```typescript
interface Person {
  name: string
  age: number
  location?: {
    country: string
    city: string
  }
}

interface PersonDetails {
  location: Person['location']
}
```

Запись `Type[Key]` аналогична `obj[key]` в JavaScript; точечная нотация для типов не подходит.

Также Lookup Types позволяет получить объединение типов из объекта по нескольким известным ключам, объединенным с помощью вертикальной черты `|`:

```typescript
type User = {
  id: number
  name: string
  email: string
}

type UserFields = User['id' | 'name' | 'email'] // string | number
```

Чтобы получить объединение всех ключей из объекта, можно использовать оператор `keyof`. Далее упростим наш пример:

```typescript
type User = {
  id: number
  name: string
  email: string
}

type UserFields = User[keyof User] // string | number
```

Чтобы скопировать или исключить поля типа, есть встроенные утилиты:

- `Pick<Type, Keys>` — создает объектный тип с ключами `Keys` из `Type`

- `Omit<Type, Keys>` — создает объектный тип, из которого исключаются ключи `Keys` из `Type`

Так это выглядит на практике:

```typescript
interface Person {
  name: string
  age: number
  location?: string
}

const details: Pick<Person, 'name' | 'age'> = {
  name: 'John',
  age: 42,
}

const details2: Omit<Person, 'location'> = {
  name: 'John',
  age: 42,
}
```

В этом примере мы получим один и тот же тип в итоге и `Pick<Person, 'name' | 'age'>`, и `Omit<Person, 'location'>`.

Utility Types собираются из базовых конструкций TypeScript. Разберём реализацию `Pick`:

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
```

В коде выше мы видим тип `Pick<T, K>`. Это дженерик с двумя параметрами — `T` и `K`. На `K` мы также наложили ограничение `extends keyof T`, чтобы параметр `K` содержал перечисление ключей из `T`.

Далее с помощью оператора `in` выполняется перебор по всем элементам перечисления. Каждый полученный элемент становится ключом. Для его значения мы ищем подходящий тип в объектном типе `T[P]`.

Операторы `keyof` (*Lookup Types*) и `in` (*Mapped Types*) часто идут вместе. С помощью `keyof` мы получаем доступ ко всем именам свойств объектного типа, а благодаря `in` можем циклически пройти по всем свойствам. Эти две операции являются ключевыми при создании своих вспомогательных типов при работе с объектными типами данных.

## Далее →
