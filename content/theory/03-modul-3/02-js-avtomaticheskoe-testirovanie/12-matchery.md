---
title: "Матчеры"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: db5d403b-c19b-449b-abd2-caff4c41c7a0
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Матчеры

Утверждения можно записывать по-разному. Популярны **матчеры** — цепочки вроде `expect(x).toEqual(y)`, похожие на короткие фразы.

Их продвигали в духе [BDD](https://ru.wikipedia.org/wiki/BDD_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)) (разработка через поведение): тест читается как описание сценария. На практике это не всегда «документация для непрограммистов», но синтаксис удобен:

```
// Проверка равенства по ссылке
// assert.equal([1, 2], [1, 2])
expect([1, 2]).toBe([1, 2]) // false

// Проверка равенства по значению
// assert.deepEqual([1, 2], [1, 2])
expect([1, 2]).toEqual([1, 2]) // true
```

Любой матчер в Jest начинается с `expect(data)` — фактическое значение. Дальше вызывают метод проверки. Матчеров много — чтобы сообщения об ошибках были точнее.

Проверим длину массива через `.length` и `toBe`:

```
const data = [1, 2, 3]
// take берет первые n элементов
// assert.equal(take(data, 2).length, 2)
expect(take(data, 2).length).toBe(2)
```

При ошибке вывод скудный:

```
const data = [1, 2, 3]
expect(take(data, 1).length).toBe(2) // тест должен упасть с ошибкой
```

```
expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 1
```

Лучше `toHaveLength` на самом массиве:

```
expect(take(data, 1)).toHaveLength(2)
```

```
expect(received).toHaveLength(expected)

Expected length: 2
Received length: 1
Received array:  [1]
```

В `expect` передан массив целиком — Jest может показать его содержимое.

Популярные матчеры:

```
expect(null).toBeNull()

// Проверяет значение на truthy (любое значение, которое приводится к true)
expect(true).toBeTruthy()
// Точное сравнение с true
expect(true).toBe(true)

expect(undefined).toBeUndefined()

// Проверка, что массив содержит элемент
expect([1, 2, 3]).toContain(2)

// Проверка, что строка содержит подстроку
expect('hello, world').toMatch('hello')

// Проверяет, что в объекте есть свойство с определённым значением
expect({ key: 'value' }).toHaveProperty('key', 'value')
```

Модификатор `.not` инвертирует матчер:

```
expect(null).not.toBeNull() // not null
expect(undefined).not.toBeUndefined() // not undefined
expect([1, 2, 3]).not.toContain(2) // not contain 2
expect('hello, world').not.toMatch('hello') // not match hello
```

`toMatchObject` проверяет **часть** объекта:

```
const user = {
  firstName: 'tolya',
  lastName: 'petrov',
  age: '33',
}

// Тест пройдёт успешно, так как проверяется только firstName
expect(user).toMatchObject({ firstName: 'tolya' })
```

Это не полный список — Jest расширяют своими матчерами. Без справочника легко застрять на `toEqual` — главный минус стиля.

## Дополнительные материалы

- [Матчеры Jest](https://jestjs.io/docs/expect)

## Далее →
