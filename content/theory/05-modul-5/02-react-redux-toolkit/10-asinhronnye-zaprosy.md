---
title: "Асинхронные запросы"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: 096bc29e-0d34-4a1c-a63a-c0534a221181
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Асинхронные запросы

## Проблематика работы с асинхронными запросами

Сложная зона фронтенда — сетевые запросы и синхронизация ответа с store. Трудности приходят с двух сторон.

С одной стороны, асинхронность сама по себе порождает неоднозначности, перестают работать стандартные механизмы. Redux не умеет работать в асинхронном режиме, поэтому вся обработка запросов происходит снаружи. В таком случае любая нетривиальная логика обработки асинхронных действий будет появляться внутри компонентов React:

```javascript
const MyComponent = (props) => {
  const onClick = async (todoId) => {
    const response = await axios.get(`https://ru.IT Птица.io/api/todos/${todoId}`)
    const todos // Извлекаем и преобразуем данные из response
    = dispatch(todosLoaded(todos))
  }

  // Рендер
}
```

С другой стороны, сеть — это вещь ненадежная. Запросы могут выполняться долго или не выполниться вообще, и все это нужно отслеживать для правильной реакции:

- При долгих запросах — показывать спиннер

- При обрыве запроса — выводить соответствующее предупреждение

Добавим к примеру выше обработку ошибок и отслеживание статуса загрузки:

```javascript
const onClick = async (todoId) => {
  // Здесь мы работаем с конечным автоматом по обработке любого http-запроса
  try {
    // Начинаем процесс загрузки
    dispatch(todosLoadingStarted())
    const response = await axios.get(`https://ru.IT Птица.io/api/todos/${todoId}`)
    const todos // Извлекаем и преобразуем данные из response
    = dispatch(todosLoaded(todos))
  }
  catch (e) {
    // Все еще сложнее — нужно отслеживать, что конкретно пошло не так
    dispatch(todosLoadingFailed(e.message))
  }
}
```

Как мы видим, даже для небольшого числа вызовов придется написать очень много похожего кода. В реальных приложениях количество вызовов может измеряться многими десятками и даже сотнями. Поэтому без готового решения тут не обойтись. Для автоматизации HTTP-запросов к нам на помощь приходят два механизма:

- Мидлвара *redux-thunk*, которая уже включена в Redux Toolkit

- Механизм `createAsyncThunk()`

## Мидлвара redux-thunk

Мидлвара — это код, который встраивается в обработку. Можно представить ее в виде цепочки функций, где каждая функция принимает данные из предыдущего обработчика и передает данные в следующую функцию. Каждая такая функция и будет мидлварой. Самый простой пример — это вывод логов. Такая функция будет выводить в лог данные и передавать дальше, никак их не меняя:

```javascript
const loggerMiddleware = store => next => (action) => {
  // Вывод информации о действии в консоль
  console.log('Dispatching action:', action)

  // Передача действия дальше по цепочке middleware
  return next(action)
}
```

Мидлвара *redux-thunk* добавляется в Redux и позволяет использовать асинхронный код внутри `dispatch()`. С ее помощью выносят логику выполнения запросов и обновления хранилища в отдельные функции (*thunks*). Вот пример такой функции:

```javascript
// Обратите внимание на вложенную функцию, принимающую dispatch
// Эта функция будет храниться вне компонента — например, в слайсе
export const fetchTodoById = todoId => async (dispatch) => {
  const response = await axios.get(`https://ru.IT Птица.io/todos/${todoId}`)
  // Здесь нужно выполнить необходимую нормализацию и обработать ошибки
  dispatch(todosLoaded(response.todos))
}

// Использование
const TodoComponent = ({ todoId }) => {
  const dispatch = useDispatch()

  const onFetchClicked = () => {
    // Передали асинхронную функцию
    dispatch(fetchTodoById(todoId))
  }

  // Где-то здесь используем onFetchClicked
}
```

Вообще thunk необязательно должен быть асинхронным. Thunk — это всего лишь функция, которая возвращает другую функцию и принимает dispatch и getState (при необходимости) в качестве параметров. Thunk может выполнять синхронные действия или комбинации синхронных и асинхронных операций, но в этом разделе нам это не так важно.

Код из примера выше можно реализовать и без *redux-thunk*, просто написав асинхронную функцию. Ей на вход мы передадим `dispatch`:

```javascript
export const fetchTodoById = async (todoId, dispatch) => {
  try {
    const response = await axios.get(`https://ru.IT Птица.io/todos/${todoId}`)
    // Выполнить необходимую нормализацию и обработать ошибки
    dispatch(todosLoaded(response.data.todos))
  }
  catch (error) {
    // Обработка ошибок
    dispatch(todosLoadingFailed(error.message))
  }
}
```

Разница проявляется в более продвинутых вариантах использования — например, когда мы работаем с состоянием или глобальными объектами. В этом случае не обойтись без *redux-thunk*:

```javascript
// (dispatch, getState, extraArgument)
export const fetchTodoById = todoId => async (dispatch, getState, extraArgument) => {
  // Любые данные, переданные на этапе конфигурации мидлвары
  const { serviceApi } = extraArgument
  const response = await serviceApi.getTodo(todoId)
  dispatch(todosLoaded(response.todos))
}
```

Основное отличие здесь — это возможность передачи дополнительных параметров в thunk-функцию через extraArgument, а также быстро получить текущее состояние хранилища с помощью функции getState.

## Механизм createAsyncThunk()

Несмотря на удобства *redux-thunk*, сами по себе thunks не уменьшают количество кода. Та же обработка ошибок всё еще составляет большую его часть. Здесь на помощь приходит инструмент `createAsyncThunk()`, появившийся вместе с redux-toolkit:

```javascript
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
// Чтобы не хардкодить URL-адреса, делаем модуль, в котором они создаются
import { getUserUrl } from './routes.js'

// Создаем thunk
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById', // Id отображается в dev tools и должен быть уникальный у каждого thunk
  async (userId) => {
    // Здесь только логика запроса и возврата данных
    // Никакой обработки ошибок
    const response = await axios.get(getUserUrl(userId))
    return response.data
  },
)

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
  name: 'users',
  // Добавляем в состояние отслеживание процесса загрузки
  // { ids: [], entities: {}, loadingStatus: 'idle', error: null }
  initialState: usersAdapter.getInitialState({ loadingStatus: 'idle', error: null }),
  reducers: {
    // Любые редьюсеры, которые нам нужны
  },
  extraReducers: (builder) => {
    builder
      // Вызывается прямо перед выполнением запроса
      .addCase(fetchUserById.pending, (state) => {
        state.loadingStatus = 'loading'
        state.error = null
      })
      // Вызывается, если запрос успешно выполнился
      .addCase(fetchUserById.fulfilled, (state, action) => {
        // Добавляем пользователя
        usersAdapter.addOne(state, action)
        state.loadingStatus = 'idle'
        state.error = null
      })
      // Вызывается в случае ошибки
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        // https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors
        state.error = action.error
      })
  },
})

// Где-то в приложении
import { fetchUserById } from './slices/usersSlice.js'

// Внутри компонента
dispatch(fetchUserById(123))
```

Каждый thunk, созданный через `createAsyncThunk()`, содержит внутри себя три события:

- *pending*

- *fulfilled*

- *rejected*

Они соответствуют состояниям промиса и вызываются в Redux Toolkit в тот момент, когда промис переходит в одно из этих состояний. Нам не обязательно реагировать на все. Мы сами выбираем, что нам важно в приложении.

## Применение thunk

Thunk выходит за рамки обработки асинхронных запросов. Этот механизм можно использовать в различных сценариях, где требуется вынос сложной логики или побочных эффектов из компонентов. Thunk также оказывается полезным для написания логики, зависящей от состояния в Redux. Ещё одним важным аспектом использования Thunk является возможность отправки нескольких действий в определенный момент или в течение заданного времени.

При этом Thunk дополняет, а не заменяет `useEffect`, который по-прежнему может использоваться для работы с побочными эффектами в компонентах. Если необходимо выделить какую-то логику из компонента, чтобы сделать его более универсальным для повторного использования, эту логику можно перенести в Thunk вместо использования `useEffect`.

На практике `useEffect` и `createAsyncThunk` часто используются вместе. Например, вызов `dispatch(fetchData())` внутри `useEffect` с пустым массивом зависимостей позволяет подгрузить данные при инициализации компонента, обеспечивая эффективное взаимодействие между асинхронными операциями и жизненным циклом компонента.

## Что дальше

В современной разработке вместе с React часто используется TypeScript. Вы можете познакомиться с ним в курсе [О](теме «Основы TypeScript»)[сновы Typescript.]()

## Дополнительные материалы

- [Как работает Redux Thunk](https://redux.js.org/usage/writing-logic-thunks)

- [Документация createAsyncThunk](https://redux.js.org/usage/writing-logic-thunks#using-createasyncthunk)

- [Автоматное программирование](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers)

## **Далее → **
