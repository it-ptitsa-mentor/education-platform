---
title: "AJAX"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: 7d581e19-9be9-49b7-b53c-d50ee05d9b9c
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# AJAX

- [Fetch](https://buildin.ai/7d581e19-9be9-49b7-b53c-d50ee05d9b9c#593f63e7-7045-41bf-bc7b-fd146980a69b)

- [Полный пример отправки формы](https://buildin.ai/7d581e19-9be9-49b7-b53c-d50ee05d9b9c#64c1a0bc-d445-4ad9-aa6f-cb39e80a34bb)

- [Работа с параметрами запроса (query params)](https://buildin.ai/7d581e19-9be9-49b7-b53c-d50ee05d9b9c#21c07ce4-6143-4617-b4cb-a1556ebed91b)

- [HTTP access control (CORS)](https://buildin.ai/7d581e19-9be9-49b7-b53c-d50ee05d9b9c#7420a2fc-bf7d-4abc-965f-954ca757d4af)

Простой калькулятор в браузере может обойтись без сети: JS рисует UI и обновляет DOM по кликам.

<!-- IMG (из Buildin, перезалить отдельно) -->
В продакшене чаще есть клиент и сервер, связанные HTTP. Запросы с клиента исторически называли **Ajax**; сейчас чаще говорят **Fetch** или **XHR**.

На учебной платформе с редактором кода при нажатии «Проверить» браузер шлёт код на сервер, там гоняются тесты, результат возвращается в интерфейс.

Ответ не мгновенный: кнопку блокируют, показывают индикатор загрузки. Сеть — задержки, обрывы, непредсказуемое время. Нужна обработка ошибок.

<!-- IMG (из Buildin, перезалить отдельно) -->
В DevTools на вкладке Network видны все запросы. Фильтр **XHR/Fetch** оставляет только API-вызовы.

*Откройте любой урок на учебной платформе с проверкой кода, включите Network и запустите проверку — в списке появится запрос к API. Изучите заголовки, тело запроса и ответ.*

Ошибочные запросы браузер подсвечивает красным.

<!-- IMG (из Buildin, перезалить отдельно) -->
В современных браузерах HTTP из JS делают через глобальную функцию `fetch()` (**Fetch API**).

## Fetch

`fetch()` асинхронно выполняет HTTP-запрос. Пример в консоли на том же домене:

```
const response = await fetch('/pages/about')
console.log(response.status) // => 200
console.log(response.headers.get('Content-Type'))
const data = await response.text()
```

Скопируйте фрагмент в консоль на открытом сайте.

<!-- IMG (из Buildin, перезалить отдельно) -->
Замечания:

- По умолчанию метод *GET*.

- Без домена запрос идёт на текущий origin.

- Тело ответа читают отдельным асинхронным вызовом (поддержка потоковой отдачи).

```
const data = await response.text()
```

`text()` — для HTML и plain text. Для JSON — `json()`:

```
const response = await fetch('some/api/call')
// Тут будет объект полученный через JSON.parse(body), где body - тело ответа
const data = await response.json()
```

Отправка данных — второй аргумент с `method`, `headers`, `body`. Для JSON укажите `Content-Type` и `JSON.stringify()`:

```
const url = /* урл запроса */
const data = /* Данные формы */
fetch(url, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: JSON.stringify(data), // тип должен соответствовать заголовку "Content-Type"
});
```

## Полный пример отправки формы

Форма регистрации:

```
<form action="/users/new" id="myForm">
  <label for="name">Имя:</label>
  <input type="text" id="name" name="name" required />

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />

  <button type="submit">Отправить</button>
</form>

<p id="result"></p>
```

Шаги:

1. Асинхронный обработчик `submit`.

1. `FormData` из формы.

1. `fetch()` на `action` формы.

1. Показать результат пользователю.

```
const formElement = document.getElementById('searchForm')
// Обработчик стал асинхронным
formElement.addEventListener('submit', async function (event) {
  event.preventDefault() // Предотвращаем перезагрузку страницы

  const form = event.target
  const formData = new FormData(form) // Собираем данные формы
  const jsonData = Object.fromEntries(formData.entries()) // Преобразуем FormData в объект

  const response = await fetch(form.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
  })

  const result = await response.json()

  // В реальном приложении тут может быть много логики в том числе редирект
  document.getElementById('result').textContent = `Результат: ${JSON.stringify(result)}`
})
```

`fetch()` низкоуровневый: заголовки и `JSON.stringify()` — на вас. Библиотека axios автоматизирует рутину.

## Работа с параметрами запроса (query params)

Query-параметры добавляют в URL вручную:

```
const repsonse = await fetch('/blog_posts?page=2')
```

Так задумано: для строки запроса есть `URL` и `URLSearchParams`:

```
// https://example.com/blog_posts?page=2
const url = new URL(window.location.href)
console.log(url.searchParams.get('page')) // => 2
url.searchParams.set('page', 1)
url.searchParams.set('per', 2)
console.log(url.searchParams.get('page')) // => 1
console.log(url.toString()) // => https://example.com/blog_posts/?page=1&per=2
```

В `fetch()` можно передать объект `URL` вместо строки:

```
const response = await fetch(url)
```

## HTTP access control (CORS)

Браузер ограничивает кросс-доменные запросы из соображений безопасности. Подробнее — в материалах ниже.

---

### Дополнительные материалы

1. [Документация fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch)

1. [Документация URL](https://developer.mozilla.org/ru/docs/Web/API/URL)

## Далее →
