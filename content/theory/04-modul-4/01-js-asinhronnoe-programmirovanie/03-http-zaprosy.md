---
title: "HTTP-запросы"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 1f5de4b8-0d0d-4575-a93c-6abfc4939755
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# HTTP-запросы

Асинхронность неизбежна там, где есть ввод-вывод: не только файлы, но и сеть. Фронтенд в основном состоит из HTTP-запросов к серверу.

Для этого урока полезно понимать, как устроен HTTP API. Если тема новая — начните с [обзора HTTP (MDN)](https://developer.mozilla.org/ru/docs/Web/HTTP/Overview).

Сетевой запрос по своей природе асинхронен: серверу нужно время принять запрос, обработать и ответить. Ответ может не дойти из-за сбоя сети.

На низком уровне запрос и ответ — текст, который клиент и сервер обменивают по сети:

```
GET / HTTP/1.1
HOST: ru.email.io

HTTP/1.1 200 OK
Date: Mon, 27 Jul 2020 12:28:53 GMT
Server: Nginx/2.2.14 (Win32)
Last-Modified: Wed, 22 Jul 2020 19:15:56 GMT
Content-Length: 666
Content-Type: text/html
Connection: Closed
```

В прикладном коде детали протокола скрыты за HTTP-клиентами. В экосистеме JavaScript часто берут [axios](https://github.com/axios/axios):

```
import axios from 'axios'

// Не забываем, что функция асинхронная
const fn = async () => {
  // GET-запрос GitHub
  const response = await axios.get('https://github.com/')
  console.log(response.status) // код ответа
  console.log(response.headers) // напечатает заголовки
  console.log(response.data) // тело ответа
}
```

У axios есть метод под каждый HTTP-глагол: `get()`, `post()`, `delete()` и т.д. Первый аргумент — URL, остальные зависят от метода. Вызовы асинхронны, поэтому их удобно сочетать с *async/await*.

Результат запроса — объект Response: статус в `response.status`, тело в `response.data`, заголовки в `response.headers`.

POST отправляют через `post()`. Второй аргумент — объект с данными; axios сам сериализует тело и выставит заголовки вроде `content-type`:

```
const fn = async () => {
  const data = {
    email: 'mysuper@email.com',
    firstName: 'Ivan',
  }
  // axios сам упакует данные в json
  const response = await axios.post('https://ru.email.io/u/new', data)
}
```

В типичном UI один пользовательский жест — один запрос. Сложности мало: с *async/await* код читается почти как синхронный.
