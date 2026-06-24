---
title: "Хук useContext"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 5d3f2819-2bb6-4be2-ae9e-05ab1092fd65
---

# Хук useContext

React передает данные внутрь компонентов с верхних уровней на нижние, используя пропсы.

Такой подход неудобен при работе с глобальными данными, которые нужны одновременно во многих компонентах на разных уровнях иерархии. К таким данным относится текущий уровень, текущая тема (темная или светлая) и так далее. Напрямую передавать такие данные неудобно, придется протаскивать их сквозь все приложение.

В таких случаях React позволяет передать данные в приложение и получить внутри любого компонента доступ к этим данным напрямую, минуя пропсы. Этот механизм называется **контекст**.

Хук `useContext()` позволяет использовать контекст внутри компонента. Для этого нужно выполнить три действия:

1. Инициализировать контекст в том же месте, где инициализируется приложение
```javascript
// Параметром передается значение по умолчанию
// Имя контекста выбирается произвольно
const UserContext = React.createContext({})
```

1. Подключить провайдер и передать данные в контекст через пропс `value`.
```javascript
// user — данные которые лежат внутри контекста
<UserContext.Provider value={user}>
  <MyComponent />
</UserContext.Provider>
```

1. Получить данные контекста
```javascript
import React, { useContext } from 'react'

const MyComponent = () => {
  // Возвращает контекст целиком
  const user = useContext(UserContext)

  return <h1>{user.name}</h1>
}
```

Вот другой пример контекста, в котором хранится текущая тема:

```javascript
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
}

const ThemeContext = React.createContext({})
```

И где-то внутри приложения:

```javascript
<ThemeContext.Provider value={/* текущая тема */}>
  <Content />
</ThemeContext.Provider>
```

Метод `React.createContext()` принимает значение по умолчанию. Это значение будет передаваться в контекст тех компонентов, которые не обернуты в провайдер. Обычно провайдер всегда используется, чтобы оборачивать все приложение. Поэтому компоненты всегда принимают в контексте значение, переданное провайдером. Но если мы работаем с компонентом вне провайдера, может понадобиться такое значение по умолчанию. Например, такая ситуация может сложиться при тестировании компонента отдельно от приложения.

Внутри контекста может храниться как примитивное значение, так и объект. Изменение содержимого такого объекта никак не отслеживается React, поэтому не приводит к перерендеру. Но если заменить сам объект, то из-за изменившейся ссылки React узнает об изменении и выполнит перерисовку компонентов внутри провайдера.

Иногда возникает ситуация, когда в контексте нужно хранить динамические данные. Например, при авторизации. Когда пользователь авторизован, мы должны сохранить какие-то данные, чтобы пользователю предоставлялись дополнительные функции. Сам по себе контекст для этого ничего не предоставляет, но можно передать в контекст методы для манипулирования данными, а сами данные хранить с помощью `useState()`. Более продвинутый вариант — это создать провайдер в отдельном компоненте. Так мы сможем изолировать данные от всего приложения, а в компоненты передавать интерфейс для взаимодействия с данными.

Для этого создадим контекст в отдельном модуле, чтобы все компоненты могли его импортировать:

```javascript
// ThemeContext.js

import { createContext } from 'react'

// Создаём контекст и задаем значения по умолчанию для него
export default createContext({
  themes: {},
  theme: {},
  setTheme: () => {},
})
```

Создаем отдельный компонент провайдера:

```javascript
// ThemeProvider.jsx

import ThemeContext from './ThemeContext.js'

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.dark)

  const setLightTheme = () => setTheme(themes.light)

  const setDarkTheme = () => setTheme(themes.dark)

  // Передаем данные и функции в контекст провайдера
  return (
    <ThemeContext.Provider value={{ theme, setLightTheme, setDarkTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
```

И внутри приложения используем провайдер как обычный компонент:

```javascript
// App.jsx

import React from 'react'
import ThemeProvider from './ThemeProvider.jsx'
import MyComponent from './MyComponent.jsx'

// Используем провайдер для доступа к контексту внутри всего приложения
const App = () => {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  )
}

export default App
```

В самом компоненте теперь можно импортировать контекст и использовать функции из провайдера для изменения состояния в контексте:

```javascript
// MyComponent.jsx

import React, { useContext } from 'react'
import ThemeContext from './ThemeContext.js'

const MyComponent = () => {
  // Получаем доступ к контексту
  const { setLightTheme } = useContext(ThemeContext)

  return <button onClick={() => setLightTheme()}>Включить светлую тему</button>
}

export default MyComponent
```

Не забываем встроить приложение на страницу:

```javascript
// Входной файл index.js

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'

ReactDOM.render(<App />, document.getElementById('root'))
```

Контекст - удобный механизм для некоторых особых ситуаций, но он не должен становиться основным способом передачи данных внутрь приложения. Такой соблазн появляется у многих, кто использует его впервые. Главная проблема контекстов — связывание компонентов с глобальными данными, а это затрудняет их повторное использование в других ситуациях.

## Дополнительные материалы

- [Использование хука useContext](https://react.dev/reference/react/useContext)

## **Далее → **
