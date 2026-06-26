---
title: "Агрегация 2"
module: "Модуль 3"
topic: "JS: Деревья"
buildin_id: 28d9ef6e-9170-4200-b3b8-a31e598658ec
source: platform
rewritten_at: 2026-06-26
reviewed_by:
---

# Агрегация 2

Ещё один вариант агрегации на файловом дереве: функция принимает директорию и возвращает список подкаталогов первого уровня вместе с числом файлов внутри каждого (включая все вложенные каталоги).

```javascript
const tree = fsTrees.mkdir('/', [
  fsTrees.mkdir('etc', [
    fsTrees.mkdir('apache'),
    fsTrees.mkdir('nginx', [
      fsTrees.mkfile('nginx.conf'),
    ]),
  ]),
  fsTrees.mkdir('consul', [
    fsTrees.mkfile('config.json'),
    fsTrees.mkfile('file.tmp'),
    fsTrees.mkdir('data'),
  ]),
  fsTrees.mkfile('hosts'),
  fsTrees.mkfile('resolve'),
])

console.log(getSubdirectoriesInfo(tree))
// => [['etc', 1], ['consul', 2]]
```

Задача распадается на две части:

- функция подсчёта файлов внутри одной директории;

- вызов этой функции для каждой прямой поддиректории.

Сначала подсчёт файлов — классическая агрегация:

```javascript
const getFilesCount = (node) => {
  if (fsTrees.isFile(node)) {
    return 1
  }

  const children = fsTrees.getChildren(node)
  const descendantCounts = children.map(getFilesCount)
  return _.sum(descendantCounts)
}
```

Дальше — дети корневого узла: оставляем только директории и к каждой применяем подсчёт:

```javascript
const getSubdirectoriesInfo = (tree) => {
  const children = fsTrees.getChildren(tree)
  const result = children
    // Нас интересуют только директории
    .filter(fsTrees.isDirectory)
    // Запускаем подсчёт для каждой директории
    .map(child => [fsTrees.getName(child), getFilesCount(child)])

  return result
}
```

Сначала обращаемся к детям напрямую: фильтруем директории, затем `map` собирает пары «имя — число файлов».

## Далее →
