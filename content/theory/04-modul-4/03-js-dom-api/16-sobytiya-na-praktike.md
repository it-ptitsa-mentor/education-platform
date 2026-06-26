---
title: "События на практике"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: de7a85f0-598f-4bc9-b86e-78f911e519c5
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# События на практике

Типичная задача: меню, где по клику подсвечивается активный пункт — у ссылки появляется класс `active`, у предыдущей он снимается.

Наивный путь — найти все ссылки и повесить на каждую свой обработчик:

```
// Извлекаем все ссылки
const links = document.querySelectorAll('a')
// На каждую кнопку вешаем событие
// Для этого обходим все ссылки и на каждую вешаем обработчик
links.forEach((link) => {
  link.addEventListener('click', () => {
    // Деактивируем предыдущий выбранный элемент
    // алгоритм деактивации разберем ниже

    // Выделяем текущий
    link.classList.add('active')
  })
})
```

Как снять выделение с прошлого пункта? Можно хранить ссылку на текущий активный элемент — появляется состояние, плюс на первой загрузке активный пункт уже задан в HTML, а скрипт об этом не знает.

Проще сделать операцию **идемпотентной**: снять `active` со всех ссылок, затем добавить текущей. `classList.remove('active')` на элементе без класса не падает:

```
links.forEach((link) => {
  link.addEventListener('click', () => {
    // Удаляем активный класс со всех ссылок
    links.forEach(link => link.classList.remove('active'))
    link.classList.add('active')
  })
})
```

Код чуть избыточен по работе, но заметно проще.

Остаётся проблема: скрипт трогает **любое** меню на странице. Не каждое должно управляться JS. Принято помечать такие блоки атрибутом `data-*`:

```
<ul class="nav">
  <li>
    <a class="active" data-toggle="tab" href="#home">Home</a>
  </li>
  <li>
    <a data-toggle="tab" href="#profile">Profile</a>
  </li>
  <li>
    <a data-toggle="tab" href="#contact">Contact</a>
  </li>
</ul>
```

Выборка сужается:

```
const links = document.querySelectorAll('[data-toggle="tab"]')
```

Но если на странице несколько меню, клик в одном снимает `active` в другом — из-за строки:

```
// links относится вообще ко всем ссылкам всех меню на странице
links.forEach(link => link.classList.remove('active'))
```

Нужно обновлять только ссылки **текущего** меню:

1. Найти корень меню от кликнутой ссылки.

1. Снять `active` только внутри этого корня.

```
links.forEach((link) => {
  link.addEventListener('click', () => {
    // closest находит ближайшего родителя среди подходящих по указанному селектору
    // Наше меню имеет класс .nav
    const nav = link.closest('.nav')
    // Находим активный элемент внутри меню
    const activeElement = nav.querySelector('.active')
    activeElement.classList.remove('active')
    link.classList.add('active')
  })
})
```

---

## Далее →
