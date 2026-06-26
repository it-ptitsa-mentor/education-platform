---
title: "Хук useContext"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 5d3f2819-2bb6-4be2-ae9e-05ab1092fd65
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Хук useContext

React передаёт данные сверху вниз через пропсы.

Для глобальных величин — язык, тема, профиль пользователя — протаскивать их через всё дерево неудобно. React даёт контекст: данные доступны любому компоненту без цепочки пропсов.

`useContext()` подключает контекст в функциональном компоненте. Три шага:

1. Создать контекст там же, где инициализируется приложение
```javascript
// Параметром передается значение по умолчанию
// Имя контекста выбирается произвольно
const UserContext = React.createContext({})
```

1. Обернуть дерево в провайдер и передать данные в `value`.
```javascript
// user — данные которые лежат внутри контекста
<UserContext.Provider value={user}>
  <MyComponent />
</UserContext.Provider>
```

1. Прочитать контекст
```javascript
import React, { useContext } from 'react'

const MyComponent = () => {
  // Возвращает контекст целиком
  const user = useContext(UserContext)

  return <h1>{user.name}</h1>
}
```

Пример с темой оформления:

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

`React.createContext(default)` задаёт значение для компонентов вне провайдера — полезно в тестах. В проде провайдер обычно оборачивает всё приложение.

В контексте может лежать примитив или объект. Мутация полей объекта React не отслеживает; замена всего объекта (новая ссылка) вызывает перерисовку подписчиков.

Для динамики (авторизация и т.п.) в `value` передают данные и методы, а состояние держат в `useState()`. Удобный паттерн — отдельный компонент-провайдер.

Контекст в отдельном модуле:

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

Компонент провайдера:

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

В приложении:

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

В дочернем компоненте:

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

Точка входа:

```javascript
// Входной файл index.js

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'

ReactDOM.render(<App />, document.getElementById('root'))
```

Контекст уместен для особых случаев, но не должен заменять пропсы как основной транспорт данных. Он привязывает компоненты к глобальным данным и мешает переиспользованию.

## Дополнительные материалы

- [Использование хука useContext](https://react.dev/reference/react/useContext)

## **Далее → **
