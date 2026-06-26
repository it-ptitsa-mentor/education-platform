---
title: "Использование интерфейсов"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: e7c325a1-472f-4342-8e1c-eb7d675b511e
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Использование интерфейсов

Интерфейсы близки к типам объектов, но у них есть отдельные приёмы — слияние деклараций, `extends` и индексные сигнатуры.

## Расширение интерфейса дополнительными полями

Повторное объявление того же имени интерфейса дополняет его полями (declaration merging):

```typescript
interface IUser {
  rating: number
}

interface IUser {
  nickname: string
  birthdate: number
}

const sergey: IUser = {
  nickname: 'Sergey',
  birthdate: 1990,
  rating: 1102,
}
```

Здесь создали интерфейс `IUser`, а затем для демонстрационных целей расширили его новыми свойствами. После этого создали на его основе объект `Sergey`.

## Расширение интерфейса с помощью другого интерфейса

Также мы можем расширить интерфейс с помощью создания другого интерфейса, который наследуется от него:

```typescript
interface IStudent extends IUser {
  group: number
}

const sergey: IStudent = {
  nickname: 'Sergey',
  birthdate: 1990,
  rating: 1102,
  group: 2,
}
```

В этом примере мы создали на основе нашего предыдущего интерфейса `IUser` еще один — `IStudent`, в который добавили свойство `group`. Так интерфейс `IStudent` имеет все свойства `IUser` и все свойства, которые мы указали при его расширении от `IUser`, то есть дополнительно `group`.

## Расширение нескольких интерфейсов

Еще интерфейсы могут расширять сразу несколько других интерфейсов:

```typescript
interface IUser {
  nickname: string
  rating: number
}

interface IEditor {
  courses: string[]
  canEdit: boolean
}

interface IAuthor extends IUser, IEditor {
  team: string
}

const sergey: IAuthor = {
  nickname: 'Sergey',
  rating: 20,
  courses: ['typescript'],
  canEdit: true,
  team: 'Het College',
}
```

В примере выше мы создали экземпляр на основе интерфейса `IAuthor`, который был создан путем расширения интерфейсов `IUser` и `IEditor`. Этот экземпляр взял в себя все свойства данных интерфейсов и свойство, которое мы указали при создании самого интерфейса `IAuthor`.

## Создание intersection types

Также TypeScript позволяет нам создавать перекрестные типы (*intersection types*) из нескольких интерфейсов с помощью литерала `&`:

```typescript
interface IOneWay {
  one: string
}

interface IOrAnother {
  another: string
}

type OneWayOrAnother = IOneWay & IOrAnother

const example: OneWayOrAnother = {
  one: 'A',
  another: 'B',
}
```

Здесь создали тип `OneWayOrAnother` на основе двух интерфейсов при помощи литерала `&`. Данный тип включил в себя все свойства указанных интерфейсов.

Между созданием перекрестных типов и расширением интерфейсов нет существенных отличий. Почти всегда эти действия будут взаимозаменяемыми, поэтому это скорее вопрос удобства. Но существуют исключения: иногда расширение интерфейса [ведет себя не так](https://stackoverflow.com/questions/52681316/difference-between-extending-and-intersecting-interfaces-in-typescript), как создание перекрестного типа.

Иногда мы не знаем заранее всех свойств, которые будут содержаться в нашем интерфейсе, но нам известно их возможное содержание. В таком случае удобно использовать специальную индексную сигнатуру, которая позволяет описать типы возможных значений:

```typescript
interface IPhoneBook {
  [index: string]: number
}

const myNotePad: IPhoneBook = {
  ivan: 55531311,
  sergey: 55500110,
  mom: 55522111,
}
```

В примере выше мы создали телефонную книгу с помощью индексной сигнатуры. Это позволило нам не указывать множество свойств с именами, а всего лишь один раз указать тип ключа и тип его значения.

Так интерфейсы — это еще один мощный инструмент в TypeScript наряду с типами. Он позволяет гибко описать наши данные. Интерфейс удобно поддается расширению и объединению с другими типами или интерфейсами.

## Далее →
