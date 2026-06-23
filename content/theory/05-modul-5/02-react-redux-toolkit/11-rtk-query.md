---
title: "RTK Query"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: b598be44-9ef9-47cf-9458-aa97f664c157
---

# RTK Query

**RTK Query** — это инструмент для создания сервисов для запросов на сервер. Он позволяет создавать удобные интерфейсы, благодаря которым мы можем отслеживать состояния запросов и при этом не создавать много однообразного кода.

## Для чего нужен RTK Query

Часто в приложениях мы делаем запросы к серверу. Чтобы отслеживать состояние этих запросов, приходится писать много однотипного кода. Даже `createAsyncThunk()` не сильно помогает с такой задачей:

```javascript
export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (user) => {
    const response = await axios.post(getUserUrl(user))
    return response.data
  },
)

const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId) => {
    const response = await axios.get(getUserUrl(userId))
    return response.data
  },
)

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
  name: 'users',
  extraReducers: (builder) => {
    builder
      // Добавление пользователя
      .addCase(addNewUser.pending, (state) => {
        state.loadingStatus = 'loading'
        state.error = null
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action)
        state.loadingStatus = 'idle'
        state.error = null
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error
      })
      // Получение пользователя
      .addCase(fetchUserById.pending, (state) => {
        state.loadingStatus = 'loading'
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action)
        state.loadingStatus = 'idle'
        state.error = null
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error
      })
  },
})
```

На каждое изменение запроса приходится добавлять свой редюсер, при этом код не сильно отличается. А если мы захотим отслеживать состояние каждого запроса по отдельности, то придется для этого еще и расширять состояние, чтобы хранить в нем все статусы запросов и ошибки.

Для решения таких задач был создан инструмент RTK Query. Он позволяет создать API для запросов на сервер с минимумом кода. Под капотом он использует `createSlice` и `createAsyncThunk`, но делает их использование более удобным.

RTK Query имеет множество различных настроек и функций. В этом уроке мы не будем подробно разбирать весь функционал, а коснемся только основного.

## Создание API

Рассмотрим создание простого API для четырех роутов:

|  |
|  |
|  |
|  |
|  |
|  |

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '',
    }),
    getUserById: builder.query({
      query: id => id,
    }),
    addUser: builder.mutation({
      query: user => ({
        method: 'POST',
        body: user,
      }),
    }),
    removeUser: builder.mutation({
      query: id => ({
        url: id,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useRemoveUserMutation,
} = usersApi
```

Здесь мы создали API с помощью функции `createApi()`. Функция принимает объект, описывающий наше API:

- `reducerPath` — название для стейта, можно применить при создании слайса

- `baseQuery` — базовый URL для запросов. Здесь мы использовали функцию `fetchBaseQuery()` для создания URL, этот URL будут использовать все запросы в API

- `endpoints` — здесь мы описываем сами запросы. В свойство передается функция, которая принимает объект `builder` — он позволяет настраивать API. Функция возвращает объект, в котором каждое свойство описывает нужный запрос.

Разберем подробнее объект, который возвращается из функции в `endpoints`. Как следует из названия, функция создает **эндпоинты** (*конечные точки*).

Эндпоинт — это маршрут, по которому мы должны обращаться к серверу. В примере выше сервер предоставляет четыре эндпоинта для каждого действия: получение списка пользователей, получение одного пользователя, добавление и удаление пользователя.

Каждый эндпоинт настраивается с помощью объекта `builder`. Для простых эндпоинтов, которые должны сделать get-запрос, используется метод `builder.query()`. В метод передается объект со свойством `query()` — это функция, формирующая запрос.

Для формирования первого эндпоинта, получающего список пользователя, мы определили функцию `query: () => ''`. Здесь мы возвращаем строку, потому что базовый URL уже содержит адрес получения списка пользователей: `/api/users`.

Следующий эндпоинт уже изменяет этот адрес, потому что нам нужно добавить идентификатор пользователя: `query: (id) => id`. Здесь `id` добавится к базовому адресу `/api/users/:id`.

Для эндпоинтов, которые вносят изменения в данные, мы можем использовать метод `builder.mutation()`. Он работает похожим образом как `query()`, но позволяет больше настроить запрос — изменять HTTP-метод или добавлять тело запроса.

## Подключение API к стору

Разберемся, как подключить наше API к стору:

```javascript
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './usersApi.js'

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(usersApi.middleware),
})
```

Созданное API предоставляет редюсеры, а также мидлвару. Как видите, основной подход не меняется, к стору точно так же подключаются новые редюсеры и мидлвара. Здесь мы используем `reducerPath` для указания имени группы редюсеров. Нам не нужно создавать слайс и описывать редюсеры — благодаря `createApi()`, все это сделано за нас.

## Кэш

В основе состояния RTK Query лежит кэш. При первом запросе RTK Query отправляет запрос и сохраняет полученные данные в кэше. При последующих запросах к тому же эндпоинту RTK Query проверяет кэш на наличие сохраненных данных и, если они есть, возвращает их, не делая запроса. Это позволяет снизить количество запросов к API и улучшить производительность приложения.

По умолчанию кэш устаревает за 60 секунд. После этого RTK Query пометит кэш как устаревший, и при новом запросе обновит его. Можно вручную задать время жизни кэша с помощью свойства `keepUnusedDataFor`:

```javascript
const usersApi = createApi({
  reducerPath: 'users',
  keepUnusedDataFor: 30, // время жизни кэша для всех эндпоинтов
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '',
      keepUnusedDataFor: 5, // время жизни кэша отдельного эндпоинта
    }),
  }),
})
```

## Хуки для компонентов

Теперь осталось разобрать, как использовать API в компонентах. Созданное API предоставляет автоматически сгенерированные хуки для каждого действия:

```javascript
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useRemoveUserMutation,
} = usersApi
```

Это позволяет сразу использовать API в компонентах без диспатча, что очень удобно. Ниже хук, созданный `builder.query()`:

```javascript
import * as React from 'react'
import { useGetUsersQuery } from './services/usersApi.js'

export default function App() {
  const { data, error, isLoading, refetch } = useGetUsersQuery()
}
```

Пример хука для запроса с параметром:

```javascript
import * as React from 'react'
import { useGetUserByIdQuery } from './services/usersApi.js'

export default function App() {
  const { data, error, isLoading, refetch, status } = useGetUserByIdQuery(1)
}
```

Вызывая хук в компоненте, мы таким образом подписываем этот компонент на все изменения состояния. При обновлении кэша этого энпдоинта, произойдет перерисовка всех компонентов, в которых вызван хук этого эндпоинта.

Хук дает все необходимое, чтобы отслеживать запрос:

- `isLoading` — если нам нужно отследить загрузку, например, для блокирования формы на время отправки запроса

- `status` — содержит строковое значение текущего состояния запроса. Дает больше информации, чем `isLoading`

- `isError` — если во время запроса была ошибка, то будет равен `true`

- `error` — содержит данные ошибки, если возникла

- `data` — результат запроса

- `refetch()` — при вызове этой функции, RTK Query пометит текущее состояние эндпоинта как устаревшее и вызовет новый запрос для обновления кэша. Все компоненты, которые подписаны на это состояние, будут перерисованы

Это только некоторые свойства, но уже их будет достаточно для большинства задач.

Для `builder.mutation()` хук выглядит несколько сложней:

```javascript
import * as React from 'react'
import {
  useAddUserMutation,
  useRemoveUserMutation,
} from './services/usersApi.js'

export default function App() {
  const [
    addUser,
    { error: addUserError, isLoading: isAddingUser },
  ] = useAddUserMutation()

  const [
    removeUser,
    { error: removeUserError, isLoading: isRemovingUser },
  ] = useRemoveUserMutation()

  const removeUserHandler = id => removeUser(id)

  const addUserHandler = user => addUser(user)

  // ...
}
```

Такие хуки уже возвращают массив. Первый элемент массива — это функция, с помощью которой мы можем вызывать запрос. А второй элемент — уже знакомый нам объект, через который мы можем отслеживать состояние запроса. Как видите, каждый хук предоставляет свое состояние для каждого запроса. Это позволяет не писать однотипный код и вручную заполнять состояние и отслеживать процессы.

Благодаря тому, что RTK Query использует кэш, при использовании множества одинаковых хуков, происходит только один запрос на сервер. Кэш сохраняется вместе с параметрами. Например, для запросов `/user/1` и `/user/2` будут созданы разные кэши

## Функция запроса

RTK Query позволяет полностью заменить способ отправки запроса. Для этого используется свойство `queryFn`. В него передается функция, которая возвращает данные:

```javascript
const usersApi = createApi({
  reducerPath: 'users',
  endpoints: builder => ({
    getUsers: builder.query({
      queryFn: async (arg) => {
        try {
          const response = await fetch('users')
          return { data: await response.json() }
        }
        catch (e) {
          return { error: e.message }
        }
      },
    }),
  }),
})
```

Это может потребоваться, например, чтобы заменить http-клиент.

## Теги

Частая задача, когда данные зависят от других данных. Например, мы удаляем пользователя, сервер при этом удаляет все сообщения этого же пользователя. Теперь список сообщений в приложении считается устаревшим, так как может содержать сообщения удаленного пользователя. В RTK Query для такой задачи используется механизм тегов. Каждый эндпоинт мы можем пометить одним или несколькими тегами. В тех эндпоинтах, где происходит изменение состояния, мы отмечаем теги, которые зависят от изменяемого состояния. Разберем пример:

```javascript
export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  tagTypes: ['User'],
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '',
      providesTags: ['User'],
    }),
    // ...
    removeUser: builder.mutation({
      query: id => ({
        url: id,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

const commentsApi = createApi({
  reducerPath: 'comments',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/comments' }),
  tagTypes: ['User'],
  endpoints: builder => ({
    getComments: builder.query({
      query: () => '',
      providesTags: ['User'],
    }),
  }),
})
```

В примере выше для эндпоинтов `getUsers` и `getComments` задан тег `User` с помощью свойства `providesTags`, в него передается список тегов. Для эндпоинта `removeUser` передан этот же тег `User` в свойство `invalidatesTags`. Теперь, когда будет происходить запрос на удаления пользователя, RTK Query инвалидирует указанные теги. Это значит, что все кэши эндпоинтов с заданным тегом будут помечены как устаревшие, и данные будут загружены повторно. В нашем случае это будут эндпоинты `getUsers` и `getComments`.

Теги могут содержать уникальную информацию:

```javascript
export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  tagTypes: ['User'],
  endpoints: builder => ({
    getUser: builder.query({
      query: id => id,
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    // ...
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: id,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
})
```

В примере выше теги формируются с помощью функций. Каждая функция возвращает объект вида `{ type, id }`. Это позволяет манипулировать кэшами отдельных сущностей. Например, при обновлении пользователя с конкретным `id`, эндпоинт `getUser` обновит данные этого пользователя, но кэши остальных пользователей останутся без изменений.

## Дополнительные материалы

- [RTK](https://redux-toolkit.js.org/rtk-query/overview)
