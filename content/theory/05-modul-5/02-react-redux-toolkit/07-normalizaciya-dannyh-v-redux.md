---
title: "Нормализация данных в Redux"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: ee4e99bb-b23a-4994-91cb-ff58b8bd7002
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Нормализация данных в Redux

Большинство приложений работают с данными, которые имеют вложенную структуру. Например, у постов в блоге есть автор и комментарии. У комментариев тоже есть авторы и могут быть лайки:

```javascript
const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....',
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
]
```

Работать с такой структурой напрямую тяжело, потому что:

- Сложно обновлять данные, потому что внутри структуры некоторые из них дублируются — например, *author*

- Чем больше вложенность, тем сложнее становится логика редьюсеров

В Redux удобно мыслить состоянием как о наборе таблиц в реляционной БД. Данные внут��и хранилища должны быть нормализованы. При таком взгляде каждый слайс, работающий с набором сущностей, можно воспринимать как отдельную таблицу в базе данных.

Основные принципы организации данных в хранилище можно сформулировать так:

- Каждый тип сущности хранится в своем редьюсере

- Коллекция сущностей одного типа хранится в виде объекта, где ключи — идентификаторы объектов, а значения — сами объекты

- Порядок данных в объекте задается отдельным массивом, состоящим только из идентификаторов

- Данные ссылаются друг на друга только по идентификаторам

Разберём такой пример:

```javascript
{
  posts: {
    entities: {
      post1: {
        id: 'post1',
        author: 'user1',
        body: '......',
        comments: ['comment1', 'comment2'],
      },
      post2: {
        id: 'post2',
        author: 'user2',
        body: '......',
        comments: [],
      },
    },
    ids: ['post1', 'post2'],
  },
  comments: {
    entities: {
      comment1: {
        id: 'comment1',
        author: 'user2',
        comment: '.....',
      },
      comment2: {
        id: 'comment2',
        author: 'user3',
        comment: '.....',
      },
    },
    ids: ['comment1', 'comment2'],
  },
  users: {
    entities: {
      user1: {
        id: 'user1',
        username: 'user1',
        name: 'User 1',
      },
      user2: {
        id: 'user2',
        username: 'user2',
        name: 'User 2',
      },
      user3: {
        id: 'user3',
        username: 'user3',
        name: 'User 3',
      },
    },
    ids: ['user1', 'user2', 'user3'],
  }
}
```

Теперь данные нормализованы. Каждый тип сущности хранится в своем собственном редьюсере. Объект `entities` хранит сами сущности, а `ids` — идентификаторы. Мы получим такие преимущества:

- Данные не повторяются, поэтому можно поменять только одно место при их изменении

- Редьюсеры не имеют вложенности

- Данные в таком виде легко извлекать и модифицировать

Теперь посмотрим, как это выглядит внутри слайсов:

```javascript
const slice = createSlice({
  name: 'users',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {
    addUser(state, action) {
      const { user } = action.payload

      state.entities[user.id] = user
      state.ids.push(user.id)
    },
    removeUser(state, action) {
      const { userId } = action.payload

      delete state.entities[userId]
      state.ids = state.ids.filter(id => id !== userId)
    },
    updateUser(state, action) {
      const { userId, data } = action.payload

      Object.assign(state.entities[userId], data)
    },
  },
})

dispatch(addUser({ user }))
dispatch(removeUser({ userId }))
dispatch(updateUser({ userId, data }))
```

## Дополнительные материалы

- [Нормализация данных в Redux](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)

## **Далее → **
