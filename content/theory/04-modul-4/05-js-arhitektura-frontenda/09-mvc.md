---
title: "MVC"
module: "Модуль 4"
topic: "JS: Архитектура фронтенда"
buildin_id: dd41883f-3d6b-414c-8f25-3e3a625c8bc9
---

# MVC

Вспомним пример с отправкой формы, где мы выделили отрисовку UI в отдельную функцию `updateUI()`. Она вызывается в обработчиках после каждого изменения состояния.

```
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Форма с явным состоянием</title>
  </head>
  <body>
    <form id="registrationForm">
      <input type="email" id="emailInput" placeholder="Введите email" />
      <button type="submit" id="submitButton" disabled>Отправить</button>
      <div id="message"></div>
    </form>

    <script>
      const state = {
        registrationProcess: {
          state: "filling", // "processing", "failed", "success"
          errors: [],
        },
      };

      const form = document.getElementById("registrationForm");
      const emailInput = document.getElementById("emailInput");
      const submitButton = document.getElementById("submitButton");
      const message = document.getElementById("message");

      function validateEmail(email) {
        return email.trim() !== ""; // Простая проверка: email не должен быть пустым
      }

      function updateUI() {
        const { state: processState, errors } = state.registrationProcess;

        if (processState === "processing") {
          submitButton.disabled = true;
          message.textContent = "Отправка...";
        } else if (processState === "failed") {
          submitButton.disabled = false;
          message.textContent = `Ошибка: ${errors.join(", ")}`;
        } else if (processState === "success") {
          submitButton.disabled = true;
          message.textContent = "Успешно отправлено!";
        } else {
          submitButton.disabled = state.registrationProcess.errors.length > 0;
          message.textContent = "";
        }
      }

      emailInput.addEventListener("input", () => {
        const email = emailInput.value;
        state.registrationProcess.errors = validateEmail(email)
          ? []
          : ["Некорректный email"];
        updateUI(); // !!!
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (state.registrationProcess.errors.length > 0) return;

        state.registrationProcess.state = "processing";
        updateUI(); // !!!

        setTimeout(() => {
          if (validateEmail(emailInput.value)) {
            state.registrationProcess.state = "success";
          } else {
            state.registrationProcess.state = "failed";
            state.registrationProcess.errors = ["Ошибка при отправке"];
          }
          updateUI(); // !!!
        }, 2000);
      });

      updateUI();
    </script>
  </body>
</html>
```

Технически этот способ рабочий, но при масштабировании проекта он начнет мешать. В чем недостатки текущего подхода?

Основной недостаток текущего подхода в том, что функцию `updateUI()` приходится вручную вызывать в каждом обработчике. Это делает код более уязвимым к ошибкам: легко забыть добавить вызов при появлении новых обработчиков или действий, и интерфейс перестанет правильно отображать актуальное состояние. Чем больше становится обработчиков и точек изменения состояния, тем сложнее гарантировать корректность UI, поскольку ответственность за обновление интерфейса полностью лежит на разработчике.

Дополнительно стоит учитывать, что обработчики не всегда реально меняют состояние приложения. Идеально было бы вызывать перерисовку только тогда, когда состояние действительно изменилось. Отслеживать такие изменения вручную без ошибок почти невозможно, особенно в растущих приложениях с большим количеством состояний и взаимодействий.

Существует другой способ выполнить эту задачу. Он основан на идеях реактивного программирования, где реакция на изменение состояния выполняется за счет "подписывания" на событие изменения, то есть это такой data-ориентированный [EventEmitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter). В этом случае достаточно подписаться на изменения всего состояния или его кусков только в одном месте. Любое последующее изменение состояния будет автоматически вызывать код, подписанный на эти изменения.

В JS подобный механизм можно реализовать через [Proxy](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy), но это довольно сложно. Более простым решением будет использование популярной библиотеки [valtio](https://valtio.dev/). Посмотрим пример:

```
// snapshot нужен для оптимизации производительности
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const app = () => {
  // Создаём реактивное состояние
  const state = proxy({
    posts: [],
    comments: [],
  })

  // Подписываемся на изменение всего state
  subscribe(state, () => {
    const obj = snapshot(state)
    alert('state changed!')
    console.log(obj)
  })

  // Подписываемся на изменение state.posts
  subscribe(state.posts, () => {
    const obj = snapshot(state)
    alert('state.posts changed!')
    console.log(obj.posts)
  })

  // Кнопка для изменения состояния
  document.getElementById('addPost').addEventListener('click', () => {
    state.posts.push({ text: 'новый пост' })
  })
}

// Запускаем приложение
app()
```

[Попрактиковаться](https://codepen.io/hexlet/pen/QwwaLpK)

Valtio позволяет "слушать" нужные части состояния и вызывать любой код при их изменениях. То, какие части конкретно слушать и сколько создавать подписчиков, зависит от задачи. В простых ситуациях достаточно одного вотчера на весь стейт, в реальных же ситуациях вотчеры делают так, чтобы было удобно.

Перепишем наш исходный пример используя Valtio. Получится так:

```
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Форма с использованием Valtio</title>
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
      <input type="email" id="emailInput" placeholder="Введите email" />
      <button type="submit" id="submitButton" disabled>Отправить</button>
      <div id="message"></div>
    </form>

    <script type="module">
      import { proxy, subscribe, snapshot } from "valtio/vanilla";

      // Создаем реактивное состояние
      const state = proxy({
        registrationProcess: {
          state: "filling", // "processing", "failed", "success"
          errors: [],
        },
      });

      const form = document.getElementById("registrationForm");
      const emailInput = document.getElementById("emailInput");
      const submitButton = document.getElementById("submitButton");
      const message = document.getElementById("message");

      function validateEmail(email) {
        return email.trim() !== ""; // Простая проверка: email не должен быть пустым
      }

      function updateUI() {
        const obj = snapshot(state);
        const { state: processState, errors } = obj.registrationProcess;

        if (processState === "processing") {
          submitButton.disabled = true;
          message.textContent = "Отправка...";
        } else if (processState === "failed") {
          submitButton.disabled = false;
          message.textContent = `Ошибка: ${errors.join(", ")}`;
        } else if (processState === "success") {
          submitButton.disabled = true;
          message.textContent = "Успешно отправлено!";
        } else {
          submitButton.disabled = errors.length > 0;
          message.textContent = "";
        }
      }

      subscribe(state, updateUI);

      // Только изменение состояния
      emailInput.addEventListener("input", () => {
        const email = emailInput.value;
        state.registrationProcess.errors = validateEmail(email)
          ? []
          : ["Некорректный email"];
      });

      // Только изменение состояния
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (state.registrationProcess.errors.length > 0) return;

        state.registrationProcess.state = "processing";

        setTimeout(() => {
          if (validateEmail(emailInput.value)) {
            state.registrationProcess.state = "success";
          } else {
            state.registrationProcess.state = "failed";
            state.registrationProcess.errors = ["Ошибка при отправке"];
          }
        }, 2000);
      });

      updateUI();
    </script>
  </body>
</html>
```

[Попрактиковаться](https://codepen.io/hexlet/pen/raapBez)

Благодаря Valtio мы убрали явные вызовы `updateUI()`, кроме первого, когда приложение инциализируется. Что мы получили?

- Устранен человеческий фактор. Изменение состояние гарантировано вызовет отрисовку.

- Если данные не изменились, то подписчики вызваны не будут, в отличие от исходного примера, где вызов идет в любом случае.

- Появилась возможность гибко управлять реакцией на изменения конкретных кусков состояния.

## MVC

Теперь обработчики ничего не знают про рендеринг и отвечают только за взаимодействие с состоянием. В свою очередь рендеринг следит за состоянием и меняет отображение тогда, когда это нужно и где нужно. Этот способ организации приложения считается уже классическим и носит имя MVC (Model View Controller). Каждое слово обозначает слой приложения со своей зоной ответственности. Model — состояние приложения и бизнес-логика, View — слой, отвечающий за взаимодействие с DOM, Controller — обработчики. Model, Controller или View — это ни файлы, ни классы, ни что-либо еще конкретное. Это логические слои, которые выполняют свою задачу и определенным образом взаимодействуют друг с другом.

Понимание MVC дает ответ на то, как структурировать приложение, но самостоятельно его реализуют редко. Современные фреймворки построены на различных модификациях MVC и за нас определили правила взаимодействия. Остается только разобраться и следовать им.

<!-- IMG (из Buildin, перезалить отдельно) -->
Самое важное на этой картинке – стрелки между слоями. Они определяют барьеры абстракции. Кто с кем и как может взаимодействовать, а кто нет. Например, на этой диаграмме нет стрелки из контроллера в представление. Это обозначает, что контроллер не может менять представление минуя модель. То, что отражено на экране — это отображение состояния приложения и никак иначе. Такой код считается нарушением:

```
// Предположим, что на странице есть одна форма
// с полем для ввода задачи и кнопкой для ее добавления

const form = document.querySelector('form')
const input = document.querySelector('form input')
form.addEventListener('submit', () => {
  state.registrationProcess.state = 'processing'
  // Что-то делаем с данными, например, добавляем в состояние
  input.value = '' // Очистка поля ввода напрямую - нарушение MVC!
})
```

На диаграмме также отсутствует стрелка из представления в модель. Это значит, что слой представления не может менять модель во время своей работы:

```
subcribe(state, () => {
  state.registrationProcess.state = 'failed'
})
```

И, конечно, представление не может притворяться контроллером и выполнять, например, HTTP-запросы:

```
subcribe(state, async () => {
  // Делаем HTTP-запрос - Нарушение MVC!
  if (/* проверяем что-то в стейте */) {
    await axios.post(endpoint, state.registrationProcess.data);
  }
});
```

Запросы должны выполняться в обработчиках событий. Это обеспечивает четкое разделение ответственности и предсказуемость работы приложения.

## Итого

Мы рассмотрели важный принцип разработки интерфейсов — реактивность. Реактивность позволяет интерфейсу автоматически реагировать на изменения данных, избавляя нас от необходимости вручную синхронизировать состояние и отображение. Такой подход делает код ясным, предсказуемым и легким для поддержки.

Используя реактивный подход, мы разделяем логику и представление: наше приложение становится проще расширять, тестировать и поддерживать. Современные инструменты и библиотеки, реализующие эту концепцию, помогают нам минимизировать количество служебного кода и сосредоточиться на логике самого приложения.

Важно понимать, что ценность несет именно сама концепция реактивности, а инструменты, будь то Valtio, MobX или другие решения, — лишь средства для реализации этого принципа. Освоив концепцию, вы легко сможете применять её в любом инструменте и эффективно использовать в своих проектах.

## Дополнительные материалы

- [Backbone MVC](https://backbonejs.org/#View)

- [Что такое MVC: рассказываем простыми словами](https://ru.hexlet.io/blog/posts/chto-takoe-mvc-rasskazyvaem-prostymi-slovami)

- [Как работать с библиотекой on-change](https://ru.hexlet.io/qna/javascript/questions/kak-rabotat-s-bibliotekoy-on-change)

## Далее →
