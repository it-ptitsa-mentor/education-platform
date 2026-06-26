---
title: "Композиция компонентов"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 4d37be12-34df-4732-8701-75b2a824362f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Композиция компонентов

`memo` — крайняя мера. Проблемы производительности чаще из плохой компоновки и размазанного состояния.

Ниже — приёмы, которые снижают лишние рендеры без `memo`.

При смене state в родителе перерисовывается и `Greeting`:

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

Вынесите state в отдельный компонент — `Greeting` перестанет обновляться при наборе текста:

```javascript
import { useState, useEffect } from 'react'

const Form = () => {
  const [name, setName] = useState('')

  return <input value={name} onChange={e => setName(e.target.value)} />
}

const Greeting = () => {
  useEffect(() => {
    console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)
  })

  return <h3>Hello, world!</h3>
}

const App = () => {
  return (
    <>
      <Form />
      <Greeting />
    </>
  )
}
```

Лишний компонент на вид усложняет дерево, но state оказывается там, где используется, и соседи не рендерятся зря.

Не всегда так просто — родитель тоже читает state:

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
    <div data-name={name}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Greeting />
    </div>
  )
}
```

Нельзя просто вынести только input — обёртке нужен `data-name={name}`.

Решение — компонент с `children`:

```javascript
import { useState, useEffect } from 'react'

const Form = ({ children }) => {
  const [name, setName] = useState('')

  return (
    <div data-name={name}>
      <input value={name} onChange={e => setName(e.target.value)} />
      {children}
    </div>
  )
}

const Greeting = () => {
  useEffect(() => {
    console.log(`Компонент Greeting отрисован в ${new Date().toLocaleTimeString()}`)
  })

  return <h3>Hello, world!</h3>
}

const App = () => {
  return (
    <Form>
      <Greeting />
    </Form>
  )
}
```

State и зависящие от него узлы — внутри `Form`; независимые части приходят через `children` и не перерисовываются при каждом символе в поле. Перед `memo` имеет смысл попробовать такую композицию.

## Дополнительные материалы

- [React re-renders guide: everything, all at once](https://www.developerway.com/posts/react-re-renders-guide)

## **Далее → **
