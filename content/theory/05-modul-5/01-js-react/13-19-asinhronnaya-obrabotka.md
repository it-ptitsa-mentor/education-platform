---
title: "19. Асинхронная обработка"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 67522f67-e794-4fca-99f5-f8d118eb4b82
---

# 19. Асинхронная обработка

Асинхронное программирование — важный аспект разработки современных веб-приложений, и работа с асинхронным кодом в React имеет свои особенности. Хотя основные концепции остаются такими же, как в курсе ["Асинхронное программирование"](https://ru.hexlet.io/courses/js-asynchronous-programming), для проформы стоит пробежаться.

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

В данном примере обработчик `handleClick()` является асинхронной функцией, которая выполняет запрос к API и обновляет состояние компонента. Не забываем обрабатывать ошибки, используя `try-catch`.

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

Самое главное на что надо обратить внимание в этих примерах это то, что мы просто делаем обработчик асинхронным, а дальше всё как обычно.

## Заключение

Асинхронная обработка в React — это важный аспект разработки интерактивных веб-приложений. В классовых компонентах мы можем легко интегрировать асинхронные вызовы, используя методы жизненного цикла и асинхронные функции. В функциональных компонентах аналогичные задачи решаются с помощью хуков, с которыми вы познакомитесь в дальнейшем.

## **Далее → **
