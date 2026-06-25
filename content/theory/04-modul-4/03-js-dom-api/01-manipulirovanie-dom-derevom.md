---
title: "Манипулирование DOM-деревом"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: 147e5860-fce3-4c0d-9262-b56a19ae28ad
---

# Манипулирование DOM-деревом

- [innerHTML](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#2ad6c6e5-c2fb-4590-a804-9c0a96b8de5f)

- [Создание узлов](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#ed0251ae-c271-4df4-b61d-1a0db10d8628)

- [Вставка](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#be300208-0314-4a25-8996-5490f4ee263d)

- [Старый API](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#cfdf0b1a-64bb-41ea-859a-aeff629643b7)

- [Клонирование](https://buildin.ai/147e5860-fce3-4c0d-9262-b56a19ae28ad#c0176620-1659-4042-aba5-56b447e3b546)

DOM-дерево может изменяться, когда браузер уже выполнил его рендеринг. Именно этот факт позволяет создавать интерактивные приложения.

В этом уроке мы обсудим, как манипулировать DOM-деревьями и какие преимущества мы можем при этом получить.

## innerHTML

Самый простой способ обновить часть DOM — это свойство `innerHTML`:

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

Значение этого свойства полностью заменяет потомков элемента, на котором мы его вызвали. Весь HTML, находящийся внутри, анализируется и становится частью дерева.

Представьте, что мы пытаемся вставить обычный текст, в котором потенциально содержится HTML. Это повышает вероятность XSS-атак, поэтому мы должны использовать другое свойство - `textContent`.

Свойство `textContent` работает практически идентично, оно также заменяет всех потомков. Основное различие между этими свойствами заключается в том, что `textContent` рассматривает содержимое как обычный текст в любом случае, даже если там есть HTML:

```
document.body.textContent = '<b>do</b> work'
console.log(document.body.innerHTML)
// Все специальные символы оказываются замененными
// "&lt;b&gt;do&lt;/b&gt; work"
```

Свойство `innerHTML` работает со строками. Это удобно, только если мы работаем со статическим представлением DOM. Для динамического формирования хорошо подходят специальные функции.

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

Код, создающий DOM динамически, похож на матрешку. После создания одни элементы все время вкладываются в другие. Так выглядит код, который конструирует деревья в любом языке.

## Вставка

[ParentNode.prepend()](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend) добавляет переданный узел первым потомком в `ParentNode`:

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

[ParentNode.append()](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) добавляет переданный узел последним потомком в `ParentNode`:

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

[childNode.before(...nodes)](https://developer.mozilla.org/en-US/docs/Web/API/Element/before) – вставляет `nodes` в список потомков родительского узла `childNode` прямо перед `childNode`:

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

[childNode.after(...nodes) ](https://developer.mozilla.org/en-US/docs/Web/API/Element/after)– вставляет `nodes` в список потомков родительского узла `childNode` сразу после `childNode`:

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

[node.replaceWith(...nodes)](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith) – вставляет `nodes` вместо `node`. Сама `node` пропадает из DOM-дерева, но остается доступной в коде:

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

[Element.remove()](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) удаляет текущий узел.

Создание элемента не добавляет сразу этот элемент на страницу. Например, `document.createElement('div')` просто создаст объект элемента `div`. При этом этот объект не будет частью DOM-дерева. Поэтому нужно вставить этот объект в дерево, если нужно добавить его на страницу.

## Старый API

Описанные выше функции появились не так давно. Большая часть кода написана с использованием других функций, список которых ниже:

- `parent.appendChild(el)` – добавляет `el` в конец списка потомков

- `parent.insertBefore(el, nextElSibling)` – добавляет `el` в список потомков `parent` перед `nextElSibling`

- `parent.removeChild(el)` – удаляет `el` из потомков `parent`

- `parent.replaceChild(newEl, el)` – заменяет `el` на `newEl`

## Клонирование

Иногда нам нужно создать элемент, похожий на существующий. Конечно, это можно сделать вручную, скопировав свойства одного элемента в свойства другого. Но есть и более простой способ:

```
const newEl = el.cloneNode(true)
```

Значение `true` показывает, что мы создаем **глубокую копию** — то есть копию данного элемента со всеми его потомками.

## Далее →
