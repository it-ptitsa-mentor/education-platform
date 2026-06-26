---
title: "Подробнее о слайсах"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: 56cd2722-82df-490a-a614-3ac15b38b7b9
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Подробнее о слайсах

Начнём с **slice** — центральной абстракции Redux Toolkit. Что бы мы ни делали внутри слайсов, в конце концов они генерируют обычные редьюсеры и действия, которые затем передаются в Redux. Другими словами, слайсы не добавляют новых возможностей в сам Redux. Они автоматизируют рутину, сокращают количество кода и делают удобнее управление действиями и состоянием.

Чтобы создать слайс, нам нужно минимум три компонента — имя, начальное состояние и набор редьюсеров. Разберём подробнее:

```javascript
import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    // пример с данными
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})
```

**Имя (name)** используется как префикс в названии действия. Оно помогает в отладке — мы видим, откуда взялось действие:

<!-- IMG (из Buildin, перезалить отдельно) -->
**Начальное состояние (initialState)** — это базовая структура данных и какие-то изначальные данные, если они есть (например, значение 0 для счетчика). Данные, которые нужно выкачать по API, к начальным не относятся. Они заполняются уже потом через действия.

**Редьюсеры (reducers)** в Toolkit очень похожи на редьюсеры в самом Redux, но здесь есть несколько важных отличий. Каждый редьюсер соответствует конкретному действию, поэтому внутри нет конструкции `switch`. Сами редьюсеры при этом очень маленькие. Внутри редьюсеров происходит прямое изменение состояния. Как такое возможно?

Когда состояние становится глубоко вложенным, работать с Redux становится неудобно. Запрет на прямое изменение порождает сложные конструкции, которые приходится писать при обновлении глубоко спрятанных данных:

```javascript
{
  ...state,
  firstLevel: {
    ...state.firstLevel,
    secondLevel: {
      ...state.firstLevel.secondLevel,
      thirdLevel: {
        ...state.firstLevel.secondLevel.thirdLevel,
        property1: action.data
      },
    },
  },
}
```

Раньше для решения этой проблемы использовалось множество разных библиотек. Все библиотеки вносили еще один уровень абстракции и делали работу сложнее.

Так продолжалось до тех пор, пока не появилась библиотека Immer. Она позволяет отследить прямые изменения внутри объекта так, чтобы обновлять оригинал без мутаций — то есть создавать копию в стиле Redux:

```javascript
import produce from 'immer'

const baseState = [
  {
    title: 'Learn TypeScript',
    done: true,
  },
  {
    title: 'Try Immer',
    done: false,
  },
]

// Рассмотрим draft ниже
// Он содержит те же данные, что и baseState, но обернутые в Proxy для отслеживания изменений
// Эти изменения затем используются для обновления baseState
const nextState = produce(baseState, (draft) => {
  draft[1].done = true
  draft.push({ title: 'IT Птица teach me' })
})

// Обратите внимание, что это разные объекты
nextState !== baseState

// Новый объект с добавленным элементом
console.log(nextState)
// [
//   { title: 'Learn TypeScript', done: true },
//   { title: 'Try Immer', done: true },
//   { title: 'IT Птица teach me' }
// ]

// Исходный объект не изменился
console.log(baseState)
// [
//   { title: 'Learn TypeScript', done: true },
//   { title: 'Try Immer', done: false }
// ]
```

В отличие от прямого изменения `baseState`, Immer работает как редьюсеры в Redux, то есть в неизменяемом стиле. Еще один пример:

```javascript
import produce from 'immer'

// Для примера мы взяли список пользователей с адресами проживания
const baseState = [
  {
    login: 'user1',
    contact: {
      phoneNumber: '111-1111111',
      emailAddress: 'user1@example.com',
    },
    address: {
      streetAddress: '123',
      city: 'Some City',
      postalCode: '1111111',
    },
  },
  {
    login: 'user2',
    contact: {
      phoneNumber: '222-222222',
      emailAddress: 'user2@example.com',
    },
    address: {
      streetAddress: 'street 1',
      city: 'Old City',
      postalCode: '123456',
    },
  },
]

// Для примера представим, что один из пользователей переехал — нужно обновить адрес
// Меняем адрес, не меняя исходный объект
const nextState = produce(baseState, (draft) => {
  draft[1].address.city = 'New City'
  draft[1].address.postalCode = '33333333'
  draft[1].address.streetAddress = 'new street 2'
})

// Новое состояние с обновленным адресом
console.log(nextState)
// [
//   {
//     login: 'user1',
//     contact: { phoneNumber: '111-1111111', emailAddress: 'user1@example.com' },
//     address: { streetAddress: '123', city: 'Some City', postalCode: '1111111' }
//   },
//   {
//     login: 'user2',
//     contact: { phoneNumber: '222-222222', emailAddress: 'user2@example.com' },
//     address: {
//       streetAddress: 'new street 2',
//       city: 'New City',
//       postalCode: '33333333'
//     }
//   }
// ]

// Исходное состояние не изменилось
console.log(baseState)
// [
//   {
//     login: 'user1',
//     contact: { phoneNumber: '111-1111111', emailAddress: 'user1@example.com' },
//     address: { streetAddress: '123', city: 'Some City', postalCode: '1111111' }
//   },
//   {
//     login: 'user2',
//     contact: { phoneNumber: '222-222222', emailAddress: 'user2@example.com' },
//     address: {
//       streetAddress: 'street 1',
//       city: 'Old City',
//       postalCode: '123456'
//     }
//   }
// ]
```

[Каждый редьюсер в Toolkit работает как колбек из Immer, в который передается `draft`. Теперь мы можем мутировать состояние, но внутри все работает так, как будто мы этого не делаем.

Благодаря такому подходу сохраняются все возможности, которые предоставляет Redux, включая его DevTool — утилиту для анализа происходящего в браузере. Мы получили плюсы от обоих миров, сохранив всю экосистему Redux.

Наконец, перейдём к экспортам. Функция `createSlice()` генерирует редьюсер и действия к нему. Все это [официальная документация](https://redux-toolkit.js.org/tutorials/quick-start) рекомендует экспортировать так:

- Редьюсер — по умолчанию

- Действия — по именам

Посмотрим на таком примере:

```javascript
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

Каждый новый редьюсер нужно не забывать добавлять в хранилище:

```javascript
export default configureStore({
  reducer: {
    counter: counterReducer,
    lessons: lessonsReducer,
    // И все остальные редьюсеры
  },
})
```

Передаваемый в редьюсер объект формирует глобальное состояние Redux. В примере выше состояние будет выглядеть так:

```javascript
{ counter, lessons }
```

## Дополнительные материалы

- [Паттерны обновления данных в Immer](https://immerjs.github.io/immer/update-patterns/)

- [Как проверить state внутри reduce?](https://react.dev/)

## **Далее → **
