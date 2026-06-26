---
title: "Механизм Entity Adapter"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: b1074fcb-f7a7-4f1b-bf9c-c5f431fcf0ea
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Механизм Entity Adapter

Большая часть фронтенда — CRUD над сущностями: создать, прочитать, обновить, удалить. Например, в учебном проекте с комментариями к урокам те же операции повторяются для постов, авторов и лайков. Эта часть фронтенда работает с постами, комментариями, авторами и лайками. Благодаря нормализации данных, код по обработке этих сущностей выглядит идентично:

```javascript
const addPost = (state, post) => {
  state.entities[post.id] = post
  state.ids.push(post.id)
}

const addLike = (state, like) => {
  state.entities[like.id] = like
  state.ids.push(like.id)
}
```

Точно такой же код будет использоваться и для всех остальных сущностей. Можно ли как-то переиспользовать его? Конечно! Redux Toolkit делает это с помощью механизма **Entity Adapter**. Он предоставляет набор готовых редьюсеров и селекторов для основных операций над сущностями. Сначала разберём пример:

```javascript
import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter()

// По умолчанию: { ids: [], entities: {} }
const initialState = usersAdapter.getInitialState()

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: usersAdapter.addOne,
    addUsers: usersAdapter.addMany,
    // Если нужна дополнительная обработка, то создаем свою функцию
    removeUser: (state, { payload }) => {
      // ...
      // Внутри можно вызвать метод адаптера
      usersAdapter.removeOne(state, payload)
    },
    updateUser: usersAdapter.updateOne,
  },
})

// Где-то в приложении

// По соглашению, в передаваемых данных должен быть id для правильной работы
dispatch(addUser(user))
// Данные передаются в формате: { id, changes }
dispatch(updateUser({ id: user.id, changes: data }))
// Достаточно передать идентификатор
dispatch(removeUser(user.id))
```

Буквально четыре строчки в редьюсерах, и мы получили полноценную реализацию стандартных операций над пользователем. Но это еще не все. Кроме готовых редьюсеров, Entity Adapter дает нам набор готовых селекторов для извлечения данных из хранилища. Для этого их нужно сгенерировать и экспортировать из файла со слайсом:

```javascript
// file: usersSlice.js

// Колбек определяет базовый селектор
// Селектор извлекает нужную часть состояния из глобального состояния Redux
// Для слайса users — это state.users
export const selectors = usersAdapter.getSelectors(state => state.users)
```

Разберём пример использования в приложении:

```javascript
import { useSelector, useDispatch } from 'react-redux'

import { selectors } from '../slices/usersSlice.js'

const MyComponent = (props) => {
  // Извлекаем всех пользователей в виде массива
  // Внутри происходит выборка данных из state.users.entities
  // Выборка отсортирована по state.users.ids
  const users = useSelector(selectors.selectAll)

  // Здесь логика вывода
}
```

Кроме `selectAll(state)`, мы получаем:

- `selectIds(state)` – возвращает `ids`

- `selectEntities(state)` – возвращает `entities`

- `selectTotal(state)` – возвращает общее количество

- `selectById(state, id)` – возвращает конкретную сущность или `undefined`, если ничего не найдено

```javascript
// id — это какой-то идентификатор
const user = useSelector(state => selectors.selectById(state, id))
```

## Дополнительные материалы

- [Что такое CRUD?](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)

- [Документация createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)

- [Создание своих селекторов](https://github.com/reduxjs/reselect)

## **Далее → **
