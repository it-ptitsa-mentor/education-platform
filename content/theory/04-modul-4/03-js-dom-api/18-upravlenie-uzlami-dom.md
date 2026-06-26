---
title: "Управление узлами DOM"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: fab5510b-afbd-4fb6-a4c2-369b1801464b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Управление узлами DOM

- [Атрибуты](https://buildin.ai/fab5510b-afbd-4fb6-a4c2-369b1801464b#05da5a70-4b86-46fc-9062-42164d011a7c)

- [Свойства](https://buildin.ai/fab5510b-afbd-4fb6-a4c2-369b1801464b#0bb1f1d1-f5f4-4986-ac3f-49ba785fdc0e)

Большая часть DOM API — свойства и методы конкретных элементов. Здесь — базовые приёмы; в работе остальное смотрят в документации по типу узла.

HTML: `атрибут="значение"`:

<!-- IMG (из Buildin, перезалить отдельно) -->
В DOM у того же узла — **свойства** со значениями, иногда приведёнными к другому типу:

<!-- IMG (из Buildin, перезалить отдельно) -->
## Атрибуты

У тегов есть атрибуты — общие (`id`, `class`) и специфичные для тега (`href` у ссылки):

```
<a id="aboutPage" href="/pages/about" class="simple">About</a>
```

После парсинга HTML атрибуты обычно отражаются одноимёнными свойствами:

```
// <a id="aboutPage" href="/pages/about" class="simple">About</a>
const el = document.querySelector('#aboutPage')
el.id // aboutPage
el.href // https://ru.email.io/pages/about
```

Исключение: атрибут `class` → свойство `className`. Для списка классов удобнее `classList`:

```
// У тега с таким id класс содержит строку "simple"
const el = document.querySelector('#aboutPage')
el.classList.add('page')
el.classList.remove('simple')
// После всех изменений
el.className // page
```

Дополнительно:

- `el.classList.contains("class")` — есть ли класс;

- `el.classList.toggle("class")` — переключить наличие класса.

Атрибуты и свойства — не одно и то же:

1. Атрибут в HTML — строка; свойство может быть числом:
```
<textarea rows="5"></textarea>
```

  `rows` в DOM — число.

1. Имена атрибутов в HTML нечувствительны к регистру (писать так не стоит, но знать полезно):
```
<a Id="aboutPage" hrEf="/pages/about" CLASS="simple">About</a>
```

1. Атрибут виден в разметке и в `innerHTML`; у элемента могут быть свойства без атрибута — у `<a>` есть `hash`, отдельного атрибута `hash` нет.

Для атрибутов есть отдельные методы:

- `el.hasAttribute(name)` – проверяет наличие атрибута

- `el.getAttribute(name)` – получает значение атрибута

- `el.setAttribute(name, value)` – устанавливает атрибут

- `el.removeAttribute(name)` – удаляет атрибут

- `el.attributes` – выдает список HTML-атрибутов

```
// Методы работают с атрибутами html
el.getAttribute('class')
```

Они меняют именно атрибуты в разметке, не обязательно синхронно со всеми свойствами. Обычно при смене атрибута свойство обновляется, но бывают исключения.

В коде предпочитайте свойства DOM; атрибуты — чтобы прочитать исходное значение из HTML:

```
<a id="aboutPage" href="/pages/about" class="simple">About</a>
```

```
const el = document.querySelector('#aboutPage')
el.setAttribute('class', 'page')
el.className // page
el.getAttribute('class') // page
```

Строка атрибута совпадает с тем, что в HTML; свойства иногда нормализуют (полный URL у `href`):

```
<!-- В этот момент браузер открыт на https://ru.email.io -->
<a id="link-to-courses" href="/courses">Курсы</a>
```

```
const el = document.querySelector('#link-to-courses')
el.href // https://ru.email.io/courses
el.getAttribute('href') // /courses
```

Произвольные атрибуты на «чужих» тегах не становятся свойствами — `href` на `<p>` игнорируется как семантика, но `getAttribute('href')` всё равно сработает.

Для своих данных в разметке — `data-*`:

```
<a href="#" data-toggle="tab">Мои проекты</a>
```

В JS — объект `dataset` (дефисы в имени → camelCase):

```
console.log(el.dataset.toggle) // => tab
```

```
<a href="#" data-nav-toggle="tab">Мои проекты</a>
```

```
console.log(el.dataset.navToggle) // => tab
```

## Свойства

Набор свойств зависит от типа элемента поверх наследования от `Node` и `Element`. В спецификации интерфейсы описаны так:

```
// HTMLLinkElement – просто название интерфейса
// HTMLElement – родительский тип, от которого наследуются свойства и методы
// attribute – обозначение конкретного атрибута, его типа и имени
interface HTMLLinkElement : HTMLElement {
  // Последнее слово в каждой строке — это имя свойства в объекте
  attribute USVString href;
  attribute DOMString? crossOrigin;
  attribute DOMString rel;
  attribute RequestDestination as; // (default "")
  readonly attribute DOMTokenList relList;
  attribute DOMString media;
  attribute DOMString nonce;
  attribute DOMString integrity;
  attribute DOMString hreflang;
  attribute DOMString type;
}
```

Как и с навигацией по дереву, детали запоминают на практике; справочник всегда под рукой.

---

### Дополнительные материалы

1. [MDN — classList](https://developer.mozilla.org/ru/docs/Web/API/Element/classList)

## Далее →
