---
title: "JavaScript в браузере"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: a748dc8b-b519-4715-9b2a-4c9cd19d80ea
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# JavaScript в браузере

- [Инлайн-скрипты](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#c7a10e37-d8e2-48da-9ff7-dcb2468f4ef9)

- [Внешние скрипты](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#30dc5549-97f0-44c1-9530-82cb6062ea64)

- [Порядок выполнения](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#432e9997-a5c3-4cbc-87a0-e3c73c66fbf5)

- [REPL](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#44ec1dd3-bda6-4067-bb41-1bf72aba47d1)

- [Особенности браузерного JavaScript](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#f8a64736-21ae-4622-8c40-828252d076ab)
  - [Объекты хост-среды](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#8437e9d7-9b30-4aef-8e0d-91dcbf5a1405)
  - [Версии](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#7813d17f-387f-4f39-9f2a-b2f896d6e51e)
  - [Браузер и контент](https://buildin.ai/a748dc8b-b519-4715-9b2a-4c9cd19d80ea#d44787f2-e123-46c2-ba16-0e0e4c88b8e1)

Здесь разберём тег `<script>` — им подключают JavaScript к HTML двумя способами:

- инлайн — код внутри страницы;

- внешний файл — атрибут `src`.

## Инлайн-скрипты

*Inline* значит, что JS лежит прямо в разметке. Подходит для коротких фрагментов:

```
<html>
  <head>
  </head>
  <body>
    <!-- JavaScript внутри тега script -->
    <script>
      const greeting = 'hello, world!';
      // Он выводит приветствие на экран в модальном окне браузера
      alert(greeting);
    </script>

    <script>
      // На странице может быть любое количество этих тегов
    </script>
  </body>
</html>
```

`alert()` показывает модальное окно с текстом. В продакшене её почти не используют, но для демонстрации она удобна.

Чаще инлайн встречается у сторонних сервисов — например, [Google Analytics](https://developers.google.com/analytics?hl=ru):

```
// Код минифицирован, чтобы занимать как можно меньше места
// Это ускоряет загрузку
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

ga('create', 'UA-XXXXX-Y', 'auto')
ga('send', 'pageview')
```

В исходнике многих сайтов в начале HTML видно несколько таких `<script>` — аналитике важно стартовать рано, чтобы не потерять события.

## Внешние скрипты

Во фронтенд-приложениях код обычно подключают файлами:

```
<html>
  <head>
    <script src="/assets/application.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/core.js"></script>
  </head>
  <body>
  </body>
</html>
```

Перед выкладкой такой код часто прогоняют через сборщик вроде [Webpack](https://webpack.js.org/): минификация, tree-shaking, разбиение на чанки для быстрой загрузки.

## Порядок выполнения

По умолчанию `<script>` выполняется в порядке появления в HTML — и для инлайна, и для `src`. От позиции зависит, когда пользователь увидит контент: скрипты чаще ставят перед `</body>`.

Порядок и момент загрузки настраивают атрибутами `defer` и `async` — см. [MDN: script](https://developer.mozilla.org/ru/docs/Web/HTML/Element/script#async).

## REPL

Третий способ — консоль DevTools как интерактивная среда (аналог REPL на сервере). Откройте инструменты (**F12** в большинстве браузеров), вкладка `Console` — там можно выполнять любой JS.

Консоль привязана к открытой странице: из неё доступны DOM и объекты окна. На вкладке **Sources → Snippets** удобно писать чуть более длинные фрагменты, почти как в редакторе.

## Особенности браузерного JavaScript

Браузерный и серверный JS — один язык в разных **хост-средах** (браузер, Node.js и др.).

`alert()` есть в браузере, в Node.js вызов упадёт. `console`, `setTimeout()`, `setInterval()`, `module`, `window`, цикл событий — тоже даёт среда, не спецификация ECMAScript. Поведение может отличаться. Сравните в браузере и в Node:

```
setTimeout(() => this, 0)
```

В чистом **V8** без оболочки Node может не быть `console` — вместо него бывает `print()`.

### Объекты хост-среды

ECMAScript описывает язык; ввод-вывод и работа с ОС — зона хоста. `alert`, `console`, `fs` (в Node) и прочее приходит из среды. Одноимённые API в браузере и Node похожи по интерфейсу, но это разные реализации; при необходимости их подменяют полифиллами или библиотеками.

### Версии

На сервере версию движка выбирает разработчик (версия Node).

На фронте вы не контролируете браузер посетителя — это может быть TV, встроенный WebView или старая сборка. Поэтому «самый новый» синтаксис без транспиляции и полифиллов рискован: часть аудитории увидит ошибку вместо страницы. Обходные пути — в следующих уроках.

### Браузер и контент

Браузерный JS должен менять страницу и взаимодействовать с окном. Для этого в среду встроены BOM и DOM — большая часть курса про них.

---

### Самостоятельная работа

1. Откройте консоль в своем браузере

1. Попробуйте запустить в ней код на выполнение — например, обычные арифметические операции

---

### Дополнительные материалы

1. [Webpack — документация](https://webpack.js.org/concepts/)

1. [MDN — атрибуты async и defer у script](https://developer.mozilla.org/ru/docs/Web/HTML/Element/script#async)

1. [MDN — отладка JavaScript](https://developer.mozilla.org/ru/docs/Learn/Tools_and_testing/Understanding_client-side_tools/What_are_browser_developer_tools)

1. [MDN — точки останова в DevTools](https://developer.mozilla.org/ru/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools)

## Далее →
