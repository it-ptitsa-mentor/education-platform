---
title: "Состояние форм"
module: "Модуль 4"
topic: "JS: Архитектура фронтенда"
buildin_id: 4927391c-2019-4ba3-87e6-bc4b22798d8f
---

# Состояние форм

Состояние форм - отдельная тема для обсуждения. По умолчанию, все что мы вводим в формах, хранится внутри DOM, что немного противоречит предыдущим рассуждениям о состоянии приложения. С другой стороны, если данные нам нужны только во время сабмита формы, то такой подход вполне допустим. В этом уроке мы разберем существующие подходы в работе с формами.

Выделяют два подхода к обработке состояния формы. Один из них отдает контроль состояния самой форме, другой предполагает его хранение в пользовательском приложении. Оба подхода имеют свои плюсы и минусы, которые обязательно надо знать при выборе того или иного решения. В документации React такие подходы называют контролируемыми и неконтролируемыми формами. Эти названия довольно точно описывают происходящее, поэтому здесь мы будем использовать ту же терминологию.

## Неконтролируемые формы

Неконтролируемые формы — это подход, при котором состояние формы хранится внутри самой формы и извлекается только при её отправке. Это привычный способ работы с формами вне фреймворков:

```
form.addEventListener('submit', (e) => {
  const formData = new FormData(e.target)
  // Обработка данных, например, отправка на сервер
})
```

К достоинствам этого способа относят:

- Простоту. Мало кода, не нужно хранить состояние.

- Скорость. Браузер делает всю работу сам. Минимум вмешательства со стороны пользовательского кода.

Несмотря на легкость и очевидность, этот подход обладает одним недостатком. При таком подходе невозможно реагировать на изменения формы в процессе ее заполнения. Где это может быть нужно? Вот несколько примеров:

- Автодополнение. Выпадающие списки зависят от того, что было набрано.

- Валидация в процессе набора. Часто реализуется в виде красной рамки вокруг поля для ввода.

- Моментальная фильтрация. Такое часто используется на сервисах бронирования или поиска товаров. Достаточно выбрать какой-то пункт меню, как сразу же меняется выборка.

В такой ситуации нам понадобятся контролируемые формы.

## Контролируемые формы

Контролируемые формы предполагают хранение состояния всех элементов формы в приложении. Любое изменение в форме отслеживается, анализируется и отражается в состоянии приложения, что позволяет мгновенно реагировать на действия пользователя.

Для реализации такого поведения нам понадобится добавить в состояние структуру отражающую форму. Сделаем это для формы регистрации включающей в себя имя, email и пароль.

```
const state = proxy({
  formData: {
    name: '',
    email: '',
    password: '',
  },
  registrationProcess: {
    state: 'filling', // "processing", "failed", "success"
    errors: [],
  },
})
```

Теперь посмотрим на весь код целиком

```
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Контролируемая форма регистрации с Valtio</title>
    <script type="importmap">
      {
        "imports": {
          "valtio": "https://esm.sh/valtio"
        }
      }
    </script>
  </head>
  <body>
    <form id="registrationForm">
      <input type="text" id="nameInput" placeholder="Введите имя" />
      <input type="email" id="emailInput" placeholder="Введите email" />
      <input type="password" id="passwordInput" placeholder="Введите пароль" />
      <button type="submit" id="submitButton">Зарегистрироваться</button>
      <div id="message"></div>
    </form>

    <script type="module">
      import { proxy, subscribe, snapshot } from "valtio/vanilla";

      const state = proxy({
        formData: {
          name: "",
          email: "",
          password: "",
        },
        registrationProcess: {
          state: "filling", // "processing", "failed", "success"
          errors: [],
        },
      });

      const form = document.getElementById("registrationForm");
      const nameInput = document.getElementById("nameInput");
      const emailInput = document.getElementById("emailInput");
      const passwordInput = document.getElementById("passwordInput");
      const submitButton = document.getElementById("submitButton");
      const message = document.getElementById("message");

      function validateForm() {
        const errors = [];

        if (state.formData.name.trim().length < 2) {
          errors.push("Имя должно содержать минимум 2 символа");
        }

        if (!state.formData.email.includes("@")) {
          errors.push("Некорректный email");
        }

        if (state.formData.password.length < 6) {
          errors.push("Пароль должен содержать минимум 6 символов");
        }

        state.registrationProcess.errors = errors;
      }

      function updateUI() {
        const obj = snapshot(state);
        const { state: processState, errors } = obj.registrationProcess;

        if (processState === "processing") {
          submitButton.disabled = true;
          message.textContent = "Отправка данных...";
        } else if (processState === "failed") {
          submitButton.disabled = false;
          message.textContent = `Ошибка: ${errors.join(", ")}`;
        } else if (processState === "success") {
          submitButton.disabled = true;
          message.textContent = "Регистрация прошла успешно!";
        } else {
          submitButton.disabled = false;
          message.textContent = errors.join(", ");
        }
      }

      subscribe(state, updateUI);

      nameInput.addEventListener("input", (e) => {
        state.formData.name = e.target.value;
        // Теперь можно выполнять какую-то дополнительную логику
      });

      emailInput.addEventListener("input", (e) => {
        state.formData.email = e.target.value;
        // Теперь можно выполнять какую-то дополнительную логику
      });

      passwordInput.addEventListener("input", (e) => {
        state.formData.password = e.target.value;
        // Теперь можно выполнять какую-то дополнительную логику
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        validateForm();

        if (state.registrationProcess.errors.length > 0) {
          state.registrationProcess.state = "failed";
          return;
        }

        state.registrationProcess.state = "processing";

        setTimeout(() => {
          if (state.formData.email !== "error@example.com") {
            state.registrationProcess.state = "success";
          } else {
            state.registrationProcess.state = "failed";
            state.registrationProcess.errors = ["Ошибка при отправке данных"];
          }
        }, 2000);
      });

      updateUI();
    </script>
  </body>
</html>
```

[Попрактиковаться](https://codepen.io/hexlet/pen/gbOGeMb)

Преимущества такого подхода:

- Возможность мгновенной реакции на любые изменения формы.

- Удобная реализация динамических интерфейсов (валидация, автодополнение, фильтрация).

И недостатки:

- Больше кода и более сложная реализация.

- Меньшая производительность из-за постоянного мониторинга состояния. Актуальность этого недостатка зависит от сложности формы и производительности приложения.

В популярных фреймворках (React, Vue, Angular) для реализации контролируемых форм существуют готовые инструменты (например, React Hook Form для React, Vuelidate для Vue, Reactive Forms для Angular). Они значительно упрощают работу с контролируемыми формами, предоставляя удобные API для валидации, управления состоянием и обработки событий.

## Что использовать?

В чистом JS предпочтительнее неконтролируемые формы. Так намного проще и быстрее. И только в том случае, когда нужна мгновенная реакция, можно вводить контроль данных формы. Причем необязательно переходить от одного способа к другому целиком. Можно использовать гибрид, вводить контроль только тех данных, где без этого никак.

## Далее →
