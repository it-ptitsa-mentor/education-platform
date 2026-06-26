---
title: "Аккумулятор"
module: "Модуль 3"
topic: "JS: Деревья"
buildin_id: 809e1412-a742-47b2-a19b-b6d8a85e0050
source: platform
rewritten_at: 2026-06-26
reviewed_by:
---

# Аккумулятор

Иногда при обходе дерева нужна информация, которой нет в самом узле — её собирают по ходу обхода. Примеры: полный путь до файла или **глубина** текущего узла. Узел не знает, где он в иерархии; положение задаёт цепочка предков.

Здесь вводится **аккумулятор** — дополнительный параметр, который накапливает такие данные во время обхода. Код усложняется, но без аккумулятора ряд задач не решить.

Задача: найти все пустые директории. Сначала простая версия, потом — с ограничением по глубине. Пример дерева:

```javascript
const tree = fsTrees.mkdir('/', [
  fsTrees.mkdir('etc', [
    fsTrees.mkdir('apache'),
    fsTrees.mkdir('nginx', [
      fsTrees.mkfile('nginx.conf'),
    ]),
    fsTrees.mkdir('consul', [
      fsTrees.mkfile('config.json'),
      fsTrees.mkdir('data'),
    ]),
  ]),
  fsTrees.mkdir('logs'),
  fsTrees.mkfile('hosts'),
])
```

Пустые каталоги: */logs*, */etc/apache* и */etc/consul/data*. Код:

```javascript
const findEmptyDirPaths = (tree) => {
  const name = fsTrees.getName(tree)
  const children = fsTrees.getChildren(tree)
  // Если детей нет, то добавляем директорию
  if (children.length === 0) {
    return name
  }

  // Фильтруем файлы, они нас не интересуют
  const emptyDirNames = children.filter(child => !fsTrees.isFile(child))
    // Ищем пустые директории внутри текущей
    // flatMap выправляет массив, так что он остаётся плоским
    .flatMap(findEmptyDirPaths)

  return emptyDirNames
}

findEmptyDirPaths(tree) // ['apache', 'data', 'logs']
```

Нестандартный момент — `flatMap()`. С одним `map()` результат вложенный:

```javascript
findEmptyDirPaths(tree)

// [ [ 'apache', [], [ 'data' ] ], 'logs' ]
```

На каждом уровне возвращаются массивы, и структура повторяет дерево. Чтобы получить плоский список, используют `flat()` или сразу `flatMap()`.

Усложним задачу: пустые директории, но не глубже двух уровней от корня. Подходят */logs* и */etc/apache*, а */etc/consul/data* — нет.

**Глубина** узла — число рёбер от корня до него. В коде: глубина ребёнка = глубина родителя + 1. Это значение передают при каждом рекурсивном спуске — такой параметр и есть **аккумулятор**.

У `findEmptyDirPaths(tree)` только один аргумент — узел. Глубину вниз не передать, поэтому вводят внутреннюю функцию, которая «пробрасывает» аккумулятор:

```javascript
const findEmptyDirPaths = (tree) => {
  // Внутренняя функция, которая может передавать аккумулятор
  // В качестве аккумулятора выступает depth, переменная, содержащая текущую глубину
  const iter = (node, depth) => {
    const name = fsTrees.getName(node)
    const children = fsTrees.getChildren(node)

    // Если директория пустая, то добавляем ее в список
    if (children.length === 0) {
      return name
    }

    // Если это второй уровень вложенности, и директория не пустая
    // то не имеет смысла смотреть дальше
    if (depth === 2) {
      // Почему возвращается именно пустой массив?
      // Потому что снаружи выполняется flat
      // Он раскрывает пустые массивы
      return []
    }

    // Оставляем только директории
    return children.filter(fsTrees.isDirectory)
      // Не забываем увеличивать глубину
      .flatMap(child => iter(child, depth + 1))
  }

  // Начинаем с глубины 0
  return iter(tree, 0)
}

findEmptyDirPaths(tree) // ['apache', 'logs']
```

Максимальную глубину можно задать снаружи:

```javascript
const findEmptyDirPaths = (tree, maxDepth = 2) => {
  // ...
}
```

Чтобы по умолчанию обходить всё дерево, не подставляют «большое число» — используют `Infinity`:

```javascript
const findEmptyDirPaths = (tree, maxDepth = Infinity) => {
  // ...
}
```

## Дополнительные материалы

- [Параметры для внутренних нужд (MDN: функции)](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Functions)

## Далее →
