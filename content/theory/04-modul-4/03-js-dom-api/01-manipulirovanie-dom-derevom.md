---
title: "Манипулирование DOM-деревом"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: 147e5860-fce3-4c0d-9262-b56a19ae28ad
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Манипулирование DOM-деревом

- [innerHTML](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#2ad6c6e5-c2fb-4590-a804-9c0a96b8de5f)

- [Создание узлов](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#ed0251ae-c271-4df4-b61d-1a0db10d8628)

- [Вставка](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#be300208-0314-4a25-8996-5490f4ee263d)

- [Старый API](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#cfdf0b1a-64bb-41ea-859a-aeff629643b7)

- [Клонирование](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#c0176620-1659-4042-aba5-56b447e3b546)

DOM можно менять уже после того, как браузер отрисовал страницу. Именно на этом строится интерактивность веб-приложений.

В этом уроке разберём, как изменять DOM-дерево и какие задачи это решает.

## innerHTML

Самый прямой способ обновить фрагмент DOM — свойство `innerHTML`:

```
<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

```
const body = document.body
console.log(body)
// <ul><li>item 1</li><li>item 2</li></ul>

body.innerHTML = '<b>do</b> work'
console.log(body.innerHTML)
// <b>do</b> work

console.log(body.childNodes)
// [b, text]
```

При присвоении значения этому свойству все текущие потомки элемента заменяются. Строка разбирается как HTML и превращается в узлы дерева.

Если вставить обычный текст, в котором могут встретиться символы разметки, растёт риск XSS. Для «чистого» текста без разбора HTML используйте `textContent`.

`textContent` тоже полностью заменяет потомков, но трактует строку как текст, а не как разметку:

```
document.body.textContent = '<b>do</b> work'
console.log(document.body.innerHTML)
// Все специальные символы оказываются замененными
// "&lt;b&gt;do&lt;/b&gt; work"
```

`innerHTML` удобен для статичных фрагментов. Когда разметку нужно собирать по частям в рантайме, лучше подходят методы создания и вставки узлов.

## Создание узлов

```
// Создаем текстовый узел
const textNode = document.createTextNode('life is life')

// Создаем элемент p
const pEl = document.createElement('p')

// Добавляем textNode в конец списка childNodes элемента pEl
pEl.append(textNode)
// pEl.textContent = 'life is life';

const el = document.createElement('div')
el.append(pEl)

console.log(el)
// <div><p>life is life</p></div>
```

Динамическая сборка DOM похожа на вложенные контейнеры: создаёте узлы и вкладываете друг в друга. Так устроено построение деревьев в большинстве языков.

## Вставка

[ParentNode.prepend()](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend) вставляет узел первым потомком `ParentNode`:

```
const div = document.createElement('div')
div.innerHTML = '<span>Hello!</span>'

const el = document.createElement('p')
el.textContent = 'prepend'
div.prepend(el)
// <div>
//   <p>prepend</p>
//   <span>Hello!</span>
// </div>
```

[ParentNode.append()](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) добавляет узел в конец списка потомков:

```
const div = document.createElement('div')
div.innerHTML = '<span>Hello!</span>'

const el = document.createElement('p')
el.textContent = 'append'
div.append(el)
// <div>
//   <span>Hello!</span>
//   <p>append</p>
// </div>
```

[childNode.before(...nodes)](https://developer.mozilla.org/en-US/docs/Web/API/Element/before) вставляет узлы в родителя `childNode` непосредственно перед самим `childNode`:

```
const div = document.createElement('div')
div.innerHTML = '<span>Hello!</span>'
// Должен быть вставлен в DOM-дерево
document.body.append(div)

const el = document.createElement('p')
el.textContent = 'content'
div.before(el)
// <p>content</p>
// <div>
//   <span>Hello!</span>
// </div>
```

[childNode.after(...nodes) ](https://developer.mozilla.org/en-US/docs/Web/API/Element/after) вставляет узлы сразу после `childNode`:

```
const div = document.createElement('div')
div.innerHTML = '<span>Hello!</span>'
// Должен быть вставлен в DOM-дерево
document.body.append(div)

const el = document.createElement('p')
el.textContent = 'content'
div.after(el)
// <div>
//   <span>Hello!</span>
// </div>
// <p>content</p>
```

[node.replaceWith(...nodes)](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith) подменяет `node` переданными узлами. Старый узел исчезает из дерева, но ссылка на него в JS остаётся:

```
const div = document.createElement('div')
div.innerHTML = '<span>Hello!</span>'
// Должен быть вставлен в DOM-дерево
document.body.append(div)

const el = document.createElement('p')
el.textContent = 'content'
div.replaceWith(el)
// В DOM-дереве вместо div остался p
// <p>content</p>
```

[Element.remove()](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) удаляет узел из документа.

`document.createElement('div')` только создаёт объект элемента; в дерево он не попадает, пока вы явно не вставите его через `append`, `prepend` и т. п.

## Старый API

Перечисленные методы появились относительно недавно. В старом коде чаще встречаются:

- `parent.appendChild(el)` – добавляет `el` в конец списка потомков

- `parent.insertBefore(el, nextElSibling)` – добавляет `el` в список потомков `parent` перед `nextElSibling`

- `parent.removeChild(el)` – удаляет `el` из потомков `parent`

- `parent.replaceChild(newEl, el)` – заменяет `el` на `newEl`

## Клонирование

Иногда нужен элемент, похожий на уже существующий. Можно копировать свойства вручную, но проще вызвать:

```
const newEl = el.cloneNode(true)
```

`true` означает глубокое клонирование — копируются и все потомки.

## Далее →
