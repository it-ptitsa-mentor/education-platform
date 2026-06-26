---
title: "HTML-дерево"
module: "Модуль 3"
topic: "JS: Деревья"
buildin_id: bd187792-566c-4cd4-bf8c-9823806fbb6d
source: platform
rewritten_at: 2026-06-26
reviewed_by:
---

# HTML-дерево

Деревья встречаются везде — от генеалогии до файловой системы. В веб-разработке постоянно под рукой **дерево разметки HTML**.

```javascript
<html>
  <body>
    <h1>Сообщество</h1>
    <p>Общение между пользователями Хекслета</p>
    <hr>
    <input>
    <div class='hexlet-community'>
      <div class='text-xs-center'></div>
      <div class='fa fa-spinner'></div>
    </div>
  </body>
</html>
```

Корень — тег `html`. Часть тегов не может содержать вложенную разметку, например `hr` и `input`.

Удобнее описать дерево в структуре, с которой просто работать в коде. Для тега нужны как минимум имя, тип, класс и дети; в реальности полей больше, но для примера хватит этих. Дерево в объектном виде:

```javascript
const htmlTree = {
  name: 'html',
  type: 'tag-internal',
  children: [
    {
      name: 'body',
      type: 'tag-internal',
      children: [
        {
          name: 'h1',
          type: 'tag-internal',
          children: [
            {
              type: 'text',
              content: 'Сообщество',
            },
          ],
        },
        {
          name: 'p',
          type: 'tag-internal',
          children: [
            {
              type: 'text',
              content: 'Общение между пользователями Хекслета',
            },
          ],
        },
        {
          name: 'hr',
          type: 'tag-leaf',
        },
        {
          name: 'input',
          type: 'tag-leaf',
        },
        {
          name: 'div',
          type: 'tag-internal',
          className: 'hexlet-community',
          children: [
            {
              name: 'div',
              type: 'tag-internal',
              className: 'text-xs-center',
              children: [],
            },
            {
              name: 'div',
              type: 'tag-internal',
              className: 'fa fa-spinner',
              children: [],
            },
          ],
        },
      ],
    },
  ],
}
```

Главное у каждого узла — **тип**. В дереве есть теги и текст; текст — **листовой узел**, потомок тега. У тегов два типа: `tag-internal` (**внутренний узел**, может иметь детей) и `tag-leaf` (**листовой узел**, детей не бывает). Итого три типа:

- `tag-internal` — тег с возможными детьми, внутренний узел

- `tag-leaf` — тег без детей, листовой узел

- `text` — текстовый листовой узел

Дальше — фильтрация пустых тегов. Правила по типам:

- `tag-internal` — пустой, если нет детей или все дети пустые

- `tag-leaf` — всегда оставляем

- `text` — отбрасываем при пустом `content`

```javascript
const filterEmpty = (tree) => {
  const filtered = tree.children
    .map((node) => {
      // Перед фильтрацией отфильтровываем всех потомков
      if (node.type === 'tag-internal') {
        // Тут самый важный момент. Рекурсивно вызываем функцию фильтрации.
        // Дальнейшая работа не завершится, пока функция фильтрации не отфильтрует вложенные пустые узлы.
        return filterEmpty(node)
      }
      return node
    })
    .filter((node) => {
      const { type } = node
      // Каждый тип фильтруется по-своему, удобно для этого использовать switch
      switch (type) {
        case 'tag-internal': {
          // К этому моменту в текущем узле отфильтрованы потомки (остались только те, которые имеют своих детей)
          const { children } = node
          // Проверяем текущий узел, если он не пустой, возвращаем true (узел остается)
          return children.length > 0
        }
        case 'tag-leaf':
          // Листовые узлы всегда выводятся
          return true
        case 'text': {
          const { content } = node
          // Для текстовых узлов просто проверяем существование контента,
          return !!content // Для однозначности приводим значение к булевому типу
        }
      }
    })
  return { ...tree, children: filtered }
}
```

Фильтр принимает узел `tag-internal`, рекурсивно обрабатывает вложенные внутренние узлы, затем `filter()` отсекает пустые по правилам выше.

После фильтрации:

```javascript
{
  name: 'html',
  type: 'tag-internal',
  children: [
    {
      name: 'body',
      type: 'tag-internal',
      children: [
        {
          name: 'h1',
          type: 'tag-internal',
          children: [
            {
              name: '',
              type: 'text',
              content: 'Сообщество',
            },
          ],
        },
        {
          name: 'p',
          type: 'tag-internal',
          children: [
            {
              name: '',
              type: 'text',
              content: 'Общение между пользователями Хекслета',
            },
          ],
        },
        {
          name: 'hr',
          type: 'tag-leaf',
        },
        {
          name: 'input',
          type: 'tag-leaf',
        },
      ],
    },
  ],
};
```

Вложенный `div` с блоком сообщества исчез: у него не осталось непустых потомков после фильтрации. Соберём строку HTML:

```javascript
// Для удобства определим отдельную функцию для формирования вывода класса
const buildClass = node => node.className ? ` class=${node.className}` : ''

// Основная функция для сборки страницы
const buildHtml = (node) => {
  const { type, name } = node
  // Каждый тип формируется по-своему, как и в фильтрации используем switch
  switch (type) {
    case 'tag-internal': {
      // Этот тип может иметь детей, формируем вывод детей
      const childrenView = node.children.map(buildHtml).join('')
      // Собираем всё, вместе с родительским узлом
      return `<${name}${buildClass(node)}>${childrenView}</${name}>`
    }
    case 'tag-leaf':
      // Листовые узлы формируются просто
      return `<${name}${buildClass(node)}>`
    case 'text':
      // В текстовых узлах выводится сам контент
      return node.content
  }
}

// Получаем отфильтрованное дерево
const filteredTree = filterEmpty(htmlTree)

// Формируем результат
const html = buildHtml(filteredTree)
console.log(html) // => <html><body><h1>Сообщество</h1><p>Общение между пользователями Хекслета</p><hr><input></body></html>
```

С отступами и переносами строк:

```javascript
<html>
   <body>
      <h1>Сообщество</h1>
      <p>Общение между пользователями Хекслета</p>
      <hr>
      <input>
   </body>
</html>
```

Код компактный, потому что дерево HTML описано явными типами узлов: для каждого типа — своя ветка логики, внутренние узлы обрабатываются той же функцией рекурсивно. Удачная модель сильно упрощает обход.

## Дополнительные материалы

- [Введение в HTML (MDN)](https://developer.mozilla.org/ru/docs/Learn_web_development/Core/Structuring_content)

- [Оператор двойного отрицания `!!` (MDN)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Logical_NOT)

- [Figma plugin API: diving into advanced algorithms & data structures](https://evilmartians.com/chronicles/figma-plugin-api-dive-into-advanced-algorithms-and-data-structures)
