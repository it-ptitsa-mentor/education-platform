---
title: "Отрисовка (рендеринг) состояния"
module: "Модуль 4"
topic: "JS: Архитектура фронтенда"
buildin_id: 0a7b0a07-94b1-45a1-83d2-5aab0e1cc617
---

# Отрисовка (рендеринг) состояния

Наличие выделенного состояния позволяет легче видеть данные с которыми мы работаем и создает единый источник правды, но не избавляет нас от сложной логики в обработчиках. Там все равно, помимо изменения состояния приходится обновлять UI. Для полной картины нужно поправить и эту часть, отделив логику работы с UI от логики работы с состоянием.

Обновление внешнего вида на основе состояния обычно выносят в отдельный слой, который называется представлением (View). В простейшем случае представлением является функция, которая принимает на вход состояние, анализирует его и производит необходимые изменения в DOM.

Возьмем пример с формой из прошлого урока и изменим его так, что обновление UI будет изолировано в функции `render()`.

```
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Форма с явным состоянием</title>
    <style>
      .error {
        border: thick solid red;
      }
    </style>
  </head>
  <body>
    <form>
      <input type="text" class="phone" name="phone" value="" />
      <div class="error-message"></div>
      <input type="submit" class="submit" disabled value="Save" />
    </form>

    <script>
      const state = {
        registrationForm: {
          value: "",
          valid: null,
          errors: [],
        },
      };

      const input = document.querySelector(".phone");
      const submit = document.querySelector(".submit");
      const errorMessage = document.querySelector(".error-message");

      // Заодно изолировали валидацию
      const validate = (value) => {
        if (/^\d+$/.test(value)) {
          return { valid: true, errors: [] };
        }
        return { valid: false, errors: ["Неправильный формат"] };
      };

      const render = () => {
        const { value, valid, errors } = state.registrationForm;
        input.value = value;
        submit.disabled = !valid;
        errorMessage.textContent = errors.join(", ");
        input.classList.toggle("error", !valid);
      };

      input.addEventListener("input", (e) => {
        state.registrationForm.value = e.target.value;
        Object.assign(
          state.registrationForm,
          validate(state.registrationForm.value),
        );
        render(); // Последующие отрисовки
      });

      render(); // Первоначальная отрисовка
    </script>
  </body>
</html>
```

[Попрактиковаться](https://codepen.io/hexlet/pen/jEEYNPq)

**Разбор изменений**

- **Валидация вынесена в отдельную функцию validate(value)**. Теперь можно использовать эту функцию повторно в других местах.

- **Функция render() отвечает за отрисовку интерфейса**. Вся логика обновления DOM теперь отделена от логики обновления состояния.

- **Используется classList.toggle для управления стилями**. Вместо ручной установки style.border, теперь применяем CSS-классы.

Преимущество такого подхода начинает проявляться как только у нас добавляются новые обработчики, влияющие на ту же часть UI. Для примера добавим поле `email`.

```
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Форма с явным состоянием</title>
    <style>
      .error {
        border: thick solid red;
      }
      .error-message {
        color: red;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <form>
      <label>
        Телефон:
        <input type="text" class="phone" name="phone" value="" />
      </label>
      <div class="error-message phone-error"></div>

      <label>
        Email:
        <input type="text" class="email" name="email" value="" />
      </label>
      <div class="error-message email-error"></div>

      <input type="submit" class="submit" disabled value="Save" />
    </form>

    <script>
      const state = {
        registrationForm: {
          fields: {
            phone: "",
            email: "",
          },
          valid: false,
          errors: {
            phone: [],
            email: [],
          },
        },
      };

      const inputPhone = document.querySelector(".phone");
      const inputEmail = document.querySelector(".email");
      const submit = document.querySelector(".submit");
      const phoneErrorMessage = document.querySelector(".phone-error");
      const emailErrorMessage = document.querySelector(".email-error");

      const validatePhone = (value) => {
        if (/^\d+$/.test(value)) {
          return { valid: true, errors: [] };
        }
        return { valid: false, errors: ["Неправильный формат номера"] };
      };

      const validateEmail = (value) => {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          return { valid: true, errors: [] };
        }
        return { valid: false, errors: ["Некорректный email"] };
      };

      const validateForm = () => {
        const phoneValidation = validatePhone(
          state.registrationForm.fields.phone,
        );
        const emailValidation = validateEmail(
          state.registrationForm.fields.email,
        );

        state.registrationForm.errors.phone = phoneValidation.errors;
        state.registrationForm.errors.email = emailValidation.errors;
        state.registrationForm.valid =
          phoneValidation.valid && emailValidation.valid;
      };

      const render = () => {
        const { fields, valid, errors } = state.registrationForm;

        inputPhone.value = fields.phone;
        inputEmail.value = fields.email;
        phoneErrorMessage.textContent = errors.phone.join(", ");
        emailErrorMessage.textContent = errors.email.join(", ");
        inputPhone.classList.toggle("error", errors.phone.length > 0);
        inputEmail.classList.toggle("error", errors.email.length > 0);
        submit.disabled = !valid;
      };

      const handleInput = (field, event) => {
        state.registrationForm.fields[field] = event.target.value;
        validateForm();
        render();
      };

      inputPhone.addEventListener("input", (e) => handleInput("phone", e));
      inputEmail.addEventListener("input", (e) => handleInput("email", e));

      render(); // Первоначальная отрисовка
    </script>
  </body>
</html>
```

[Попрактиковаться](https://codepen.io/hexlet/pen/GggyKJL)

**Что изменилось?**

- Добавили поле `email`
  - Теперь у нас два поля с независимой валидацией.

- Вынесли `validatePhone` и `validateEmail` в отдельные функции
  - Теперь легко добавить дополнительные правила или другие поля.

- Создали `validateForm()`

- Проверяет все поля разом.
  - Записывает ошибки в `state.registrationForm.errors`.
  - Определяет, можно ли отправлять форму.

- Обновили `render()`
  - Универсально обновляет состояние формы. Обратите внимание, что она вызывается два раза, для первой отрисовки когда никаких событий не было и по событию.
  - Теперь ошибки и стили обновляются централизованно.

- Добавили `handleInput()`
  - Одна универсальная функция для обновления полей.
  - Упрощает код обработчиков событий.

Несмотря на то, что кода стало больше, уровень его сложности почти не вырос. Внутри мы работаем с отдельными частями (управление состоянием, отрисовка, обработчики), которые сами по себе достаточно простые и односложные. Такое разделение логики масштабируется даже на большие формы с десятками полей.

## Частичное обновление VS Полное обновление

С ростом приложения увеличивается и количество обработчиков. Каждый из них может приводить к изменению только части страницы. Как поступать в таком случае? Создавать по рендеру на каждую ситуацию или описывать все возможные изменения в одной функции `render()`?

Наиболее простым решением будет привязка таких функций к элементам состояния. Предположим, что у нас есть страница управления списком уроков в курсе. В состоянии это выглядит так:

```
const state = {
  lessons: [
    /* список уроков */
  ],
  // остальная часть состояния
}
```

Для отрисовки этого списка подойдет одна функция `renderLessons()`, которая будет вызываться во всех обработчиках, изменяющих этот список: удаляющих или добавляющих элементы.

```
// Добавление
el1.addEventListener('submit', (e) => {
  // логика добавления
  renderLessons(state.lessons)
})

// Удаление
el2.addEventListener('submit', (e) => {
  // логика удаления
  renderLessons(state.lessons)
})
```

Что происходит внутри этой функции? Кажется, что внутри функции `render()` нужно соотносить данные в объекте состояния и то, что отображено на экране, а затем менять необходимую часть DOM, например, удалить какой-то элемент, которого больше нет. Посмотрите на то, как бы тогда выглядела функция `renderLessons()`:

```
const lessonList = document.querySelector('.lesson-list')

const renderLessons = () => {
  const currentElements = Array.from(lessonList.children)
  const stateLessons = state.lessons

  // Удаление лишних элементов
  currentElements.forEach((li, index) => {
    if (!stateLessons[index]) {
      li.remove()
    }
  })

  // Обновление существующих и добавление новых элементов
  stateLessons.forEach((lesson, index) => {
    let li = lessonList.children[index]

    if (!li) {
      // Если элемента нет — создаем новый
      li = document.createElement('li')
      lessonList.appendChild(li)
    }

    // Обновляем содержимое li
    li.textContent = lesson
    li.dataset.index = index

    // Проверяем, есть ли уже кнопка удаления
    let removeButton = li.querySelector('button')
    if (!removeButton) {
      removeButton = document.createElement('button')
      removeButton.textContent = 'Удалить'
      removeButton.addEventListener('click', () => {
        state.lessons.splice(index, 1) // Удаление из состояния
        renderLessons() // Рендерим изменения
      })
      li.appendChild(removeButton)
    }
  })
}
```

В реальности это очень затратный подход, его сложно программировать, так как появляется большое количество условных конструкций. Намного проще выполнять полную перерисовку на любое событие. Тогда код останется максимально простым.

```
const renderLessons = () => {
  lessonList.innerHTML = '' // Полностью очищаем список перед отрисовкой

  state.lessons.forEach((lesson, index) => {
    const li = document.createElement('li')
    li.textContent = lesson

    const removeButton = document.createElement('button')
    removeButton.textContent = 'Удалить'
    removeButton.addEventListener('click', () => {
      state.lessons.splice(index, 1)
      renderLessons() // Просто вызываем перерисовку
    })

    li.appendChild(removeButton)
    lessonList.appendChild(li)
  })
}
```

Этот код намного проще. Он в несколько раз короче и внутри него нет ни одной условной конструкции.

|  |
|  |
|  |
|  |

У такого подхода есть серьезный недостаток – производительность. Но учитывайте два важных момента. Во-первых, производительность — далеко не всегда проблема. Например, при реализации автокомплитов именно так и нужно поступать. Все будет работать быстро в любом случае. Во-вторых, именно эту проблему решают современные фронтенд-фреймворки. Они сами знают, как эффективнее всего обновить DOM.

Теперь наше приложение разделено на три независимых части: состояние (данные приложения), обработчики и рендеринг. Эта модель работы на тривиальных приложениях (в пару-тройку обработчиков) смотрится избыточной, но если обработчиков станет хотя бы 10, то вы увидите, что с приложением достаточно удобно работать. Виден поток данных, то есть движение данных в приложении от одних частей к другим, от обработчика до отрисовки в DOM. Всегда можно отследить, что изменилось, и как одни части приложения зависят от других. К тому же, сокращается дублирование. Например, изменение состояния может идти из разных частей приложения, но логика отрисовки при этом остается неизменной. В такой ситуации достаточно описать новый способ изменения уже существующего состояния, а рендеринг сделает все остальное.

Кроме наличия разделения на три части, не менее важно то, как они друг с другом взаимодействуют:

- Состояние не знает ничего про остальные части системы — оно ядро.

- Рендеринг пользуется состоянием для отрисовки (добавление, изменение или удаление элементов) и добавляет новые обработчики в DOM.

- Обработчики знают про состояние, так как обновляют его и инициируют рендеринг.

Этот способ разделения по-прежнему обладает одним важным недостатком - изменение состояние требует явного вызова функции отрисовки. Этот недостаток мы устраним в уроке посвященному MVC.

## Далее →
