---
title: "Полифиллы"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: a2321167-30a1-4a9c-afd7-02547cd9253b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Полифиллы

- [Добавление метода](https://buildin.ai/a2321167-30a1-4a9c-afd7-02547cd9253b#1e05c1c0-2bc6-4b27-9456-f3995b2340f3)

- [Добавление свойства](https://buildin.ai/a2321167-30a1-4a9c-afd7-02547cd9253b#b2590901-6ed8-498a-8f51-6ebf73dbb6d6)

- [Ядро JavaScript](https://buildin.ai/a2321167-30a1-4a9c-afd7-02547cd9253b#709615e2-7635-4b99-a713-ac44bc564601)

DOM развивается неравномерно: одни браузеры подхватывают API быстрее, другие — медленнее. Перед использованием новинок нужно понимать, какие версии браузеров у вашей аудитории.

Обычно это видно из аналитики — например, Google Analytics собирает данные о посетителях в реальном времени.

В крайних случаях приходится поддерживать очень старые браузеры — так бывает в корпоративных и гос-средах.

Например, `matches()` в Internet Explorer есть только с девятой версии. Если в требованиях ещё IE8, вызов метода упадёт с ошибкой:

```
const div = document.querySelector('div')
div.matches('.someClass') // Uncaught TypeError: matches is not a function
```

JavaScript частично компенсирует пробелы старых движков: через прототипы можно добавить недостающие методы и свойства в DOM. Так работают **полифиллы** — разберём их в этом уроке.

Общая схема:

1. Проверить, есть ли нужный метод или свойство.

1. Если нет — добавить свою реализацию.

Скрипт с полифиллами должен загрузиться **до** остального кода — иначе приложение не может рассчитывать на полный API.

## Добавление метода

Полифилл для `Element.prototype.matches` подставляет вендорные варианты там, где стандартного метода ещё нет:

```
(function (constructor) {
  const p = constructor.prototype
  if (!p.matches) {
    p.matches = p.matchesSelector
      || p.mozMatchesSelector
      || p.msMatchesSelector
      || p.oMatchesSelector
      || p.webkitMatchesSelector
  };
})(window.Element)
```

После этого `element.matches()` можно вызывать без проверки поддержки вручную.

## Добавление свойства

Сложнее случай с `ParentNode.lastElementChild` — нужно описать логику поиска последнего элементного потомка:

```
// Свойство задаётся через defineProperty: значение вычисляется при обращении (ленивый getter)
if (!('lastElementChild' in document.documentElement)) {
  Object.defineProperty(Element.prototype, 'lastElementChild', {
    get: function() {
      for (let nodes = this.children, n, i = nodes.length - 1; i >= 0; --i) {
        if (n = nodes[i], 1 === n.nodeType) {
          return n;
        }
      }
      return null;
    }
  });
}
```

Примеры упрощены. В реальных библиотеках кода больше — покрыть все браузеры и краевые случаи непросто.

Поддержку фич по браузерам удобно смотреть на [Can I use](https://caniuse.com/):

<!-- IMG (из Buildin, перезалить отдельно) -->
Готовый набор полифиллов можно подключить через [polyfill-fastly.io](https://polyfill-fastly.io/).

На GitHub также лежат отдельные полифиллы под разные части DOM — перед внедрением их обычно ищут по названию API.

Иногда достаточно проверить наличие фичи и выполнить разный код. Для этого существует библиотека *modernizr*:

```
// Проверяется наличие flash
Modernizr.on('flash', (result) => {
  if (result) {
    // the browser has flash
  }
  else {
    // the browser does not have flash
  }
})
```

## Ядро JavaScript

Полифиллы нужны не только DOM. Сам язык тоже эволюционирует.

Современный синтаксис и встроенные объекты сильно упрощают код, поэтому почти в каждом проекте подключают [core-js](https://github.com/zloirock/core-js) — она закрывает большую часть возможностей ES.

Установите пакет и импортируйте в точке входа приложения — дальше библиотека подставляет недостающее в рантайме, и отдельная «ручная» сборка под старые браузеры часто не нужна:

```
import 'core-js/stable'
// Другие зависимости
```

В практических заданиях по курсу вы увидите такое подключение в `index.js`.

## Далее →
