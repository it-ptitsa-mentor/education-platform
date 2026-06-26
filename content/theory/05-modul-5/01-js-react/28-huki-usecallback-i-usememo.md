---
title: "Хуки useCallback и useMemo"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 8ebc501d-67b3-430e-a528-2c1cc0e39c43
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Хуки useCallback и useMemo

Компоненты часто перерисовываются без видимой нужды — при обновлении родителя или смене пропсов. Лишний рендер может запускать эффекты или бить по производительности.

Проще всего заметить это логами или точками останова в отладчике.

Два компонента:

```javascript
import { useState, useEffect } from 'react'

const Greeting = () => {
  useEffect(() => {
    console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)
  })

  return <h3>Hello, world!</h3>
}

const App = () => {
  const [name, setName] = useState('')
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting />
    </>
  )
}
```

В `Greeting` — лог с временем. В `App` — поле ввода и дочерний `Greeting`. Каждый символ в `input` перерисовывает `Greeting`; слово `hello` даст пять рендеров.

## Расширение Profiler

Удобнее смотреть через [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi): вкладка Profiler, запись, ввод в поле, остановка.

Для строки `"hello"` видны шаги каждого рендера и время на компонент.

<!-- IMG (из Buildin, перезалить отдельно) -->
В правой верхней части можно переключаться между шагами рендера, Profiler сохраняет информацию о каждом рендере и отображает информацию сколько времени отрисовывался каждый компонент.

В больших приложениях Profiler незаменим. В production профайлер часто отключён; в create-react-app можно оставить его флагом:

```javascript
npm run build -- --profile
```

## Инструмент memo

Смена state в корне тянет перерисовку всех потомков. `Greeting` рендерится снова, хотя текст тот же.

Помогает `memo` — обёртка над компонентом:

```javascript
import { memo } from 'react'

const Memoized = memo(MyComponent)
```

Приложение:

```javascript
import { memo, useState, useEffect } from 'react'

const Greeting = memo(() => {
  useEffect(() => {
    console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)
  })

  return <h3>Hello, world!</h3>
})

const App = () => {
  const [name, setName] = useState('')
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting />
    </>
  )
}
```

При вводе в поле `Greeting` больше не перерисовывается. При смене пропса — перерисуется:

```javascript
import { memo, useState, useEffect } from 'react'

const Greeting = memo(({ name }) => {
  useEffect(() => {
    console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)
  })

  return <h3>{`Hello, ${name}!`}</h3>
})

const App = () => {
  const [name, setName] = useState('')
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting name={name} />
    </>
  )
}
```

## Мемоизация и `useMemo`

`memo` не спасёт, если меняется только ссылка на объект или функцию при тех же данных:

```javascript
import { memo, useState } from 'react'

const Button = memo(({ onClick }) => {
  console.log(`Компонент Button отрисован в ${new Date().toLocaleTimeString()}`)

  return <button onClick={onClick}>Нажми меня</button>
})

const Greeting = memo(({ name }) => {
  console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)

  return <h3>{`Hello, ${name}!`}</h3>
})

const App = () => {
  const [name, setName] = useState('')
  const buttonHandler = () => setName('world')
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting name={name} />
      <Button onClick={buttonHandler} />
    </>
  )
}
```

`buttonHandler` создаётся заново на каждом рендере `App` — `Button` перерисовывается.

`useMemo` кэширует результат функции до смены зависимостей — по духу как `useEffect` с массивом deps.

Мемоизируем функцию-обработчик:

```javascript
import { memo, useState, useMemo } from 'react'

const Button = memo(({ onClick }) => {
  console.log(`Компонент Button отрисован в ${new Date().toLocaleTimeString()}`)
  return <button onClick={onClick}>Нажми меня</button>
})

const Greeting = memo(({ name }) => {
  console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)

  return <h3>{`Hello, ${name}!`}</h3>
})

const App = () => {
  const [name, setName] = useState('')
  const buttonHandler = useMemo(() => () => setName('world'), [])
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting name={name} />
      <Button onClick={buttonHandler} />
    </>
  )
}
```

`useMemo(() => () => setName('world'), [])` запоминает одну и ту же функцию. Обычно `useMemo` берут для тяжёлых вычислений; для колбеков чаще `useCallback`.

`useMemo` не гарантирует, что кэш никогда не сбросится — React может пересчитать ради памяти. На это нельзя опираться в логике, только в оптимизации.

## useCallback

`useCallback()` мемоизирует саму функцию, а не результат её вызова:

```javascript
const buttonHandler = useCallback(() => setName('world'), [])
```

Второй аргумент — массив зависимостей, как у `useMemo`.

## Выводы

Есть `memo`, `useMemo`, `useCallback` — но не стоит размазывать их по всему коду. Оптимизация усложняет проект. В простых примерах она не нужна; сначала ищите узкие места и ошибки в архитектуре состояния.

## Дополнительные материалы

- [React.memo](https://ru.reactjs.org/docs/react-api.html#reactmemo)

- [Использование хука useMemo](https://ru.reactjs.org/docs/hooks-reference.html#usememo)

- [Использование хука useCallback](https://ru.reactjs.org/docs/hooks-reference.html#usecallback)

## **Далее → **
