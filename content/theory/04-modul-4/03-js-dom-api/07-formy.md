---
title: "Формы"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: 74d1202b-2f85-4ee7-a60c-ad3f12ce58cd
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Формы

Во фронтенде встречаются два подхода. В «живых» формах каждое поле сразу меняет данные на странице — без кнопки «Сохранить». Типичный случай — фильтры в списке.

Классический вариант — отправка по кнопке. Тогда слушают событие `submit` у формы:

```
const form = document.querySelector(/* селектор формы */)
form.addEventListener('submit', (e) => {
  // Если хотим работать с формой через javascript,
  // то нужно остановить действие по умолчанию — отправку
  e.preventDefault()
  // Что-то делаем
})
```

Почему не `click` на кнопке? Форму можно отправить с клавиатуры (Enter) — клик по кнопке при этом не обязателен. `submit` покрывает оба сценария.

Типичный сценарий обработки:

- собрать данные формы

- отправить на сервер или обновить состояние приложения

- обновить интерфейс

Пункты 2–3 — в уроке про AJAX. Здесь — извлечение данных.

**Неудобный путь** — тащить каждое поле отдельно:

```
const input = document.querySelector(/* селектор поля ввода */)
const form = document.querySelector(/* селектор формы */)
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const { value } = input
  // Что-то делаем с данными
})
```

Придётся вручную находить все поля и склеивать значения. Лучше использовать [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) — браузер сам читает поля с атрибутом `name`:

```
<form method="post">
  <input name="email" value="example@example.com">
  <input name="password" value="supersecret">
  <input type="submit" value="Sign Up">
</form>
```

```
const form = document.querySelector(/* селектор нужной формы */)
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // Данные формы извлекаются из DOM автоматически
  // На вход передается элемент формы, взятый из события
  const formData = new FormData(e.target)
  // Теперь с ними можно работать
  formData.get('email'); // example@example.com
  // values() возвращает итератор, поэтому преобразуем в массив
  [...formData.values()]; // ['example@example.com', 'supersecret']
  // Тоже итератор
  [...formData.entries()]
  // [['email', 'example@example.com'], ['password', 'supersecret']]

  // Преобразование в обычный объект
  Object.fromEntries(formData)
  // { email: 'example@example.com', password: 'supersecret' }
})
```

## Извлечение элементов формы

Иногда поля нужны по отдельности — например, валидация на `change`, а не при submit:

```
const input = document.querySelector(/* селектор поля ввода */)
input.addEventListener('change', (e) => {
  // Логика
})
```

Если полей много, у формы есть свойство `elements` — объект с ключами по `name`:

```
<form method="post">
  <input name="email" value="example@example.com">
  <input name="password" value="supersecret">
  <input type="submit" value="Sign Up">
</form>
```

```
const form = document.querySelector(/* селектор до формы */)
form.elements.email // <input name="email" ...
form.elements.password // <input name="password" ...

// Обработка
form.elements.email.addEventListener('change', () => {
  // Обработка
})
```

## Далее →
