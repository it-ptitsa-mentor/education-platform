---
title: "Навигация по DOM-дереву"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: d8899a73-0c3d-4590-ac19-2ac5cd4c654a
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Навигация по DOM-дереву

- [childNodes](https://buildin.ai/d8899a73-0c3d-4590-ac19-2ac5cd4c654a#93774372-8500-4400-96e5-39897e9f7cf9)

- [Иерархия](https://buildin.ai/d8899a73-0c3d-4590-ac19-2ac5cd4c654a#d2f99bd1-81c0-4247-b3df-ee6370345e58)

- [Элементы](https://buildin.ai/d8899a73-0c3d-4590-ac19-2ac5cd4c654a#1f426175-c693-40d0-b25e-bb050d0889f2)

- [Специальная навигация](https://buildin.ai/d8899a73-0c3d-4590-ac19-2ac5cd4c654a#ce644828-1ea5-4195-8775-f5521c02f6f1)

- [Заключение](https://buildin.ai/d8899a73-0c3d-4590-ac19-2ac5cd4c654a#75752516-3be7-40dd-9c6d-17852ed26b36)

DOM удобнее понимать через структуру дерева узлов.

Дерево состоит из **узлов** (node). Они повторяют иерархию HTML. Узлы бывают:

- листовые — без потомков;

- внутренние — с дочерними узлами.

Чаще узел соответствует тегу и хранит его атрибуты. **Тип** узла задаёт доступные свойства и методы — ниже разберём основные.

Корень документа — узел `<html>`:

```
const html = document.documentElement
// Свойство tagName узла содержит имя тега в верхнем регистре
console.log(html.tagName) // => 'HTML'

// Содержимое тега HTML в виде узлов DOM-дерева
// Текст тоже представлен узлом
html.childNodes // [head, text, body]

// Потому что head выше body
html.firstChild // <head>...</head>
html.lastChild // <body>...</body>

// Второй узел, обращение по индексу
html.childNodes[1] // #text
```

<!-- IMG (из Buildin, перезалить отдельно) -->
`<head>` и `<body>` всегда есть в документе — для них на `document` вынесены сокращения:

```
document.head
document.body
```

По дереву можно подниматься к родителю:

```
// Родитель body это html
document.documentElement === document.body.parentNode // true
document.body === document.body.childNodes[2].parentNode // true
```

Движение возможно вверх-вниз и «вбок» между соседями:

<!-- IMG (из Buildin, перезалить отдельно) -->
## childNodes

`childNodes` возвращает **дочерние узлы** — потомков первого уровня.

Нюансы:

1. Свойство только для чтения — присвоение по индексу ничего не меняет:
```
// Ошибки не будет, но ничего не поменяется
document.body.childNodes[0] = 'hey'
```

  Менять дерево нужно методами вставки и удаления (отдельный урок).

1. `childNodes` — не массив, а `NodeList`: нет `map`/`filter`, но есть `forEach`:
```
// Тип NodeList
const nodes = document.documentElement.childNodes

nodes.forEach(el => console.log(el))
```

  При необходимости преобразуйте в массив:

```
const list = Array.from(nodes)
// Теперь у нас обычный массив и доступные методы, например, filter
// Можем отфильтровать нужные элементы
const filtered = list.filter(item => item.textContent.includes('Навигация по DOM-дереву'))
// И извлечь из них данные, например, имена тегов
const filteredTags = filtered.map(item => item.tagName)
console.log(filteredTags) // => ['HEAD', 'BODY']
```

## Иерархия

Типы узлов выстроены в иерархию: подтипы наследуют поля родителя и добавляют свои:

<!-- IMG (из Buildin, перезалить отдельно) -->
```
// Самый простой способ посмотреть тип
document.body.toString() // "[object HTMLBodyElement]"
document.body instanceof HTMLBodyElement // true
```

`Text` и `Comment` — листья без потомков. С тегами чаще работают через `Element` и его подтипы.

У вложенного тега все внутренние узлы — **потомки**. Пример:

```
const html = `
  <html>
    <head></head>
    <body>
      <div id="parent-div">
        <h1>Заголовок</h1>
        Привет!
        <div class="child-div">
          <span>Какой-то <b>текст</b></span>
          <ol>
            <li>1</li>
            <li>2</li>
          </ol>
          <!-- End List -->
        </div>
      </div>
    </body>
  </html>
`
```

У `<div id="parent-div">` четырнадцать потомков и три **дочерних** узла на первом уровне.

**Дочерние** — только прямые дети:

- `<h1>`

- текст `"Привет!"`

- `<div class="child-div">`

**Потомки** — все вложенные узлы на любой глубине.

<!-- IMG (из Buildin, перезалить отдельно) -->
Каждый дочерний узел — потомок, но не каждый потомок — дочерний: `<span>` внутри вложенного `div` — потомок `parent-div`, но не его прямой ребёнок.

## Элементы

На практике чаще нужны именно **элементы**, а не текстовые узлы. Для них есть параллельный набор свойств:

<!-- IMG (из Buildin, перезалить отдельно) -->
Они возвращают `Element` и пропускают `Text`/`Comment` — в отличие от `childNodes`:

```
const node = document.documentElement
node.children // [head, body]
```

Тип коллекции тоже разный:

- `childNodes` → `NodeList`

- `children` → `HTMLCollection`

Подробности сравнения — когда дойдём до селекторов.

## Специальная навигация

У форм и таблиц есть удобные свойства:

```
<table>
  <tr>
    <td>1.1</td>
    <td>1.2</td>
    <td>1.3</td>
  </tr>
  <tr>
    <td>2.1</td>
    <td>2.2</td>
    <td>2.3</td>
  </tr>
</table>
```

```
const table = document.body.firstElementChild
table.rows[0].cells[2] // <td>1.3</td>
```

`rows` и `cells` — сокращения для табличной разметки, не замена общей навигации.

## Заключение

Зубрить все свойства не нужно. Важны идея дерева, иерархия типов и разница между узлами и элементами. Конкретные имена всегда в документации.

В реальных проектах чаще используют селекторы, а не ручной обход соседей — их разберём дальше.

---

### Самостоятельная работа

1. Откройте консоль в своем браузере

1. Начиная от `document.body`, доберитесь до самых глубоких узлов, содержащих этот текст

---

### Дополнительные материалы

1. [Node](https://developer.mozilla.org/ru/docs/Web/API/Node)

## Далее →
