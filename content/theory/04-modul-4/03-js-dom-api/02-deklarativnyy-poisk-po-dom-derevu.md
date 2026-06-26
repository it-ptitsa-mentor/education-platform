---
title: "Декларативный поиск по DOM-дереву"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: 28df800c-a9b7-4c00-a3dd-f5732dc1010b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Декларативный поиск по DOM-дереву

- [Поиск по идентификатору](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#878726f2-6bc6-495f-8bc5-6ae5395d5f5c)

- [Поиск по классу](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#099d337b-caa9-40cf-988c-d2e86a9028e3)

- [Поиск по тегу](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#bcb96071-3ce0-4945-ab4a-3c391dbe4915)

- [Поиск по селектору](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#ec77737d-cb14-4bc7-b446-17e371c9b2c7)

- [Другие полезные методы](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#8004909b-6847-4c17-8280-4bcde932f96b)
  - [Предикат matches](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#ff73bc8c-04e5-428c-ae27-ef888fee1f95)
  - [Метод closest](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#f3d4f578-5236-40be-a3eb-75d022ea1c7b)

- [Язык XPath](https://buildin.ai/28df800c-a9b7-4c00-a3dd-f5732dc1010b#48ebafd8-ddcf-4365-b333-8976958867ea)

На практике фронтенд часто оперирует наборами элементов, разбросанных по разным веткам DOM. Например, пользователь отмечает файлы к удалению — в коде это сводится к выборке соответствующих узлов и их удалению.

Обходить дерево вручную утомительно. Браузер даёт несколько декларативных способов поиска — разберём их в этом уроке.

## Поиск по идентификатору

Самый простой вариант:

```
<p id="content">Это параграф</p>
```

```
const el = document.getElementById('content')
```

По спецификации `id` на странице должен быть уникальным, поэтому `getElementById()` возвращает один элемент. Если в разметке случайно окажется несколько одинаковых `id`, браузер вернёт первый из них.

## Поиск по классу

Для нескольких элементов удобнее поиск по классу:

```
// Поиск по всему дереву
// Возвращаются все элементы с таким классом, причем они могут быть совершенно разными
const collection = document.getElementsByClassName('row')

// Этот метод позволяет искать не только в целом документе,
// но и среди потомков любого элемента
el.getElementsByClassName('row')
```

## Поиск по тегу

Реже, но полезно знать поиск по имени тега:

```
document.getElementsByTagName('span')

// Поиск всех элементов
document.getElementsByTagName('*')

// Поиск среди потомков el
el.getElementsByTagName('span')
```

## Поиск по селектору

Универсальный способ — CSS-селекторы. Ими можно найти один или несколько элементов на любой глубине:

```
<ul id="menu">
  <li class="odd"><span>Первый</span> пункт</li>
  <li>Второй</li>
  <li class="odd"><span>Третий</span> пункт</li>
</ul>
```

```
// Этот код возвращает первый найденный элемент по указанному селектору
// Ищем элемент с id=menu
const ul = document.querySelector('#menu')

// Все спаны, вложенные в теги с классом .odd
const spans = ul.querySelectorAll('.odd > span')
```

`querySelector()` и `querySelectorAll()` работают и от `document`, и от любого элемента — поиск идёт среди его потомков.

## Другие полезные методы

### Предикат `matches`

`el.matches(css)` проверяет, подходит ли элемент под селектор `css`:

```
<p class="font-weight">This is Dragon!</p>
```

```
const el = document.querySelector('p')
el.matches('.unknown-class') // false
el.matches('.font-weight') // true
```

### Метод `closest`

`el.closest(css)` поднимается вверх по дереву (включая сам `el`) и возвращает ближайший элемент, подходящий под селектор, либо `null`:

```
<div class="row" id="one">
</div>
<div class="row" id="two">
  <div class="row" id="three">
    <span>where is the closest?</span>
  </div>
</div>
```

```
const el = document.querySelector('span')
const ancestor = el.closest('.row')
ancestor.id // 'three'
```

## Язык XPath

XPath — язык запросов к XML-документам; в браузерах его тоже поддерживают.

```
<html>
 <body>
    <div>Первый слой
      <span>блок текста в первом слое</span>
    </div>
    <div>Второй слой</div>
    <div>Третий слой
      <span class="text">первый блок в третьем слое</span>
      <span class="text">второй блок в третьем слое</span>
      <span>третий блок в третьем слое</span>
    </div>
    <span>четвертый слой</span>
    <img />
 </body>
</html>
```

Путь `/html/body/*/span/@class` здесь укажет на два элемента:

- `<span class="text">первый блок в третьем слое</span>`

- `<span class="text">второй блок в третьем слое</span>`.

В повседневной работе с HTML DOM XPath почти не используют — для полноты картины мы его упомянули. В XML-средах XPath остаётся основным инструментом навигации.

---

### Дополнительные материалы

1. [MDN — документация по селекторам](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_Selectors)

## Далее →
