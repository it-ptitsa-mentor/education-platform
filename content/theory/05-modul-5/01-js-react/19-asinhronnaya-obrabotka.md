---
title: "Асинхронная обработка"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 67522f67-e794-4fca-99f5-f8d118eb4b82
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Асинхронная обработка

Асинхронность — базовая часть современного веба; в React те же идеи, что в курсе по асинхронному JavaScript, но с нюансами интеграции в компоненты. Ниже — краткое напоминание на примерах.

## Асинхронные вызовы в классовых компонентах

```javascript
import React from 'react'
import axios from 'axios'

class Loader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: null }
  }

  handleClick = async () => {
    try {
      const res = await axios.get('/images/random')
      this.setState({ url: res.data })
    }
    catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  render() {
    const { url } = this.state
    return (
      <div>
        <button onClick={this.handleClick}>Load Random Image</button>
        {url && <img src={url} alt="Random" />}
      </div>
    )
  }
}
```

Здесь `handleClick()` — асинхронный обработчик: запрос к API и обновление `state`. Ошибки оборачиваем в `try/catch`.

## Асинхронные вызовы в функциональных компонентах

В функциональных компонентах подобный код был бы написан с использованием хуков `useState()` и `useEffect()`. С хуками вы подробнее познакомитесь в следующем курсе, а пока можете просто посмотреть:

```javascript
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Loader = () => {
  const [url, setUrl] = useState(null)

  const fetchImage = async () => {
    try {
      const res = await axios.get('/images/random')
      setUrl(res.data)
    }
    catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  useEffect(() => {
    fetchImage()
  }, [])

  return (
    <div>
      <button onClick={fetchImage}>Load Random Image</button>
      {url && <img src={url} alt="Random" />}
    </div>
  )
}
```

Главное: делаем обработчик `async` и дальше работаем как с обычным состоянием.

## Заключение

В классах асинхронные вызовы удобно вешать на методы жизненного цикла и обработчики. В функциональных компонентах ту же роль играют хуки — с ними вы познакомитесь дальше.

## **Далее → **
