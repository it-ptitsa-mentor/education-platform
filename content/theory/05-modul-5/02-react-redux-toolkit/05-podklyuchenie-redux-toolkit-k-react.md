---
title: "Подключение Redux Toolkit к React"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: e5b55a92-d62f-4307-bc88-5446ce7aa068
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Подключение Redux Toolkit к React

Соберём минимальное приложение на Redux Toolkit: кнопки меняют значение счётчика в store. На этом примере мы увидим основные концепции Redux Toolkit. Для интеграции нам понадобятся два пакета:

- Пакет *react-redux*

- Сам Redux Toolkit из пакета *@reduxjs/toolkit*

Перейдём к установке:

```javascript
# Выполните эту команду в корневой директории проекта
npm install @reduxjs/toolkit react-redux
```

Разберём структуру директорий, от которой будем отталкиваться. Это самый простой вариант, но не единственный возможный:

```javascript
components/
  | App.jsx
slices/
  | index.js
  | counterSlice.js
index.jsx
```

Для работы с Toolkit мы выделили директорию *slices* с двумя файлами внутри — *index.js* и *counterSlice.js*.

В файле *index.js* мы будем инициализировать хранилище и объединять все редьюсеры. Сами редьюсеры разбиваются по отдельным файлам — **слайсам** или **срезам**. Каждый слайс отвечает за определенную сущность в приложении. Например, в приложении со списком товаров и покупателей можно выделить два слайса: один для товаров, другой для покупателей.

Такой подход разделяет общее состояние на отдельные модули со своей зоной ответственности. В нашем примере в состоянии находится счетчик, поэтому мы определили для него слайс *counterSlice.js*. Теперь создаем редьюсер в слайсе для счетчика:

```javascript
// file: slices/counterSlice.js

import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // Редьюсеры в слайсах меняют состояние и ничего не возвращают
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    // Пример с данными
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default counterSlice.reducer
```

Чтобы создать редьюсер, создаем начальное значение `initialState` и вызываем `createSlice()`, который выполняет всю работу. Эта функция принимает объект, в котором нам важны три свойства:

- `name` задает имя слайса

- `initialState` задает начальное состояние

- `reducers` принимает объект, в котором каждое свойство содержит редьюсеры. С их помощью мы будем менять состояние

Вызов `createSlice()` вернет готовый слайс — это объект, в котором нам важны два свойства:

- `actions` — это действия, с помощью которых мы запускаем созданные редьюсеры. Названия действий совпадают с ключами, которые мы указали в `reducers` при создании слайса. Toolkit автоматически создаст нужные действия и даст строковые имена их типам.
  В примере выше мы экспортируем объект с действиями, которые получили из этого свойства. Дальше можно импортировать действия в компонентах, чтобы вызывать их.

- `reducer` — это готовый редьюсер, который мы будем подключать в хранилище. В примере выше он экспортируется по умолчанию просто для удобства, чтобы разграничить экспорт экшенов и редьюсера.

<!-- IMG (из Buildin, перезалить отдельно) -->
Теперь редьюсер готов к использованию. Сначала подключим его в общее хранилище. Для этого передаем редьюсер в функцию `configureStore()`.

Эта функция умеет комбинировать редьюсеры самостоятельно, в отличие от такой же функции в Redux. Функция `configureStore()` принимает на вход объект с ключом `reducer`, значением которого становится объект с редьюсерами. У общего состояния `state` ключи будут такими же, как у этого объекта. Более подробно мы это разберем чуть позже. Создание хранилища выглядит так:

```javascript
// file: slices/index.js

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.js'

export default configureStore({
  reducer: {
    // Свойство counter будет внутри объекта общего состояния: state.counter
    counter: counterReducer,
  },
})
```

Здесь мы вызываем функцию `configureStore()` и передаем в нее объект со свойством `reducer`. А вот уже в `reducer` мы указываем объект с нашими редьюсерами. В нашем примере есть единственный редьюсер `counterReducer`, который мы импортируем по умолчанию из *counterSlice.js*.

Если бы у нас было несколько слайсов, можно было бы указать их под разными ключами. Это выглядело бы так:

```javascript
// file: slices/index.js

import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersReducer.js'
import tasksReducer from './tasksReducer.js'

export default configureStore({
  reducer: {
    users: usersReducer,
    tasks: tasksReducer,
  },
})
```

Выше мы видим два редьюсера, которые передаются под ключами `users` и `tasks`. Мы можем придумывать любые имена ключей, но лучше, когда имена соответствуют содержимому. Например, редьюсер для списка пользователей лучше назвать `users`, а для списка задач — `tasks`.

Теперь наше хранилище готово к использованию. Можно подключить его в приложение.

Начнем создавать приложение с верхнего уровня. Здесь понадобится компонент `<Provider>`, который содержит хранилище и прокидывает его вглубь дерева компонентов через контекст:

```javascript
// file: index.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './components/App.jsx'
import store from './slices/index.js'

const mountNode = document.getElementById('container')
const root = ReactDOM.createRoot(mountNode)
// Оборачиваем приложение в Provider и передаем хранилище в него
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

Теперь самое главное — Toolkit в действии. Здесь мы опираемся на работу хуков. Здесь все работает по-прежнему:

- Чтобы изменить состояние в хранилище, передаем действие в функцию `dispatch()`

- Чтобы получить объект `dispatch` в компоненте, используем функцию `useDispatch()`

- Чтобы извлечь данные из стора, используем хук `useSelector()`. Он принимает функцию, в которую все состояние передается через параметр. Возвращаемое значение из этой функции станет результатом выполнения `useSelector()`

Посмотрим, как это работает:

```javascript
// file: components/App.jsx

import React from 'react'
// Хуки находятся в react-redux
import { useSelector, useDispatch } from 'react-redux'
// Импортируем нужные действия
import { decrement, increment, incrementByAmount } from '../slices/counterSlice.js'

export default () => {
  // Вытаскиваем данные из хранилища
  // Здесь state — это все состояние
  const count = useSelector(state => state.counter.value)
  // Возвращает метод store.dispatch() текущего хранилища
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Прибавить
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Отнять
        </button>
        <br />
        <button onClick={() => dispatch(incrementByAmount(42))}>Прибавить 42</button>
      </div>
    </div>
  )
}
```

В компоненте может быть несколько вызовов `useSelector`, причем каждый вызов создаст подписку на изменение состояния. Срабатывание нескольких подписок одновременно приведет только к одной перерисовке компонента.

Заметьте, что переданная в `useSelector` функция принимает все состояние целиком. Если у нас несколько редьюсеров и слайсов, состояние содержит все состояния этих слайсов. Состояние хранится в объекте, где каждый ключ — это то, что мы указали в `reducer` при создании стора. В нашем случае это свойство `counter`:

```javascript
export default configureStore({
  reducer: {
    // Свойство `counter` будет внутри объекта общего состояния `state.counter`
    counter: counterReducer,
  },
})
```

Разберём интерактивный пример:

Интерактивный пример счётчика на Redux Toolkit доступен в демо CodePen.
Инициализацию store и `Provider` обычно делают один раз; дальше логика живёт в **slice** и компонентах. Благодаря слайсам и мутации данных внутри редьюсеров, кода будет значительно меньше, чем в чистом Redux. Об этом мы подробнее поговорим в следующем уроке.

Осталось разобрать подключение мидлвар:

```javascript
const logger = store => next => (action) => {
  // ...
}

const api = store => next => (action) => {
  // ...
}

export const store = configureStore({
  reducer: {
    // ...
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([logger, api]),
})
```

Мидлвары подключаются через свойство `middleware`. В это свойство мы записываем функцию, которая в свою очередь принимает другую функцию `getDefaultMiddleware()`. Вызвав ее, мы получаем список текущих мидлвар. К этим мидлварам добавляем наши мидлвары и возвращаем новый список.

## Самостоятельная работа

1. Создайте репозиторий

1. Откройте репозиторий локально и повторите в нем шаги из урока

1. Зафиксируйте изменения в репозитории

## Дополнительные материалы

- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

- [create-react-app](https://github.com/facebook/create-react-app)

## **Далее → **
