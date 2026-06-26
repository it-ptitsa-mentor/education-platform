---
title: "Манипуляции с виртуальной файловой системой"
module: "Модуль 3"
topic: "JS: Деревья"
buildin_id: 81327c60-88a4-4a23-9d91-4ba1171db42b
source: platform
rewritten_at: 2026-06-26
reviewed_by:
---

# Манипуляции с виртуальной файловой системой

Библиотека для построения деревьев рассчитана только на неизменяемые файловые структуры: после создания их нельзя мутировать. Зато можно построить новую структуру на основе старой, изменив нужные части.

Неизменяемость выбрана не случайно: так проще отлаживать и реже ошибаться. Плюс курс сильнее опирается на функции высшего порядка.

## Базовые операции с узлами

Библиотека `immutable-fs-trees` не только создаёт деревья, но и читает из них данные базовыми операциями — без прямого доступа к внутренней структуре:

```javascript
import * as fsTrees from '@hexlet/immutable-fs-trees'

const tree = fsTrees.mkdir('/', [fsTrees.mkfile('hexlet.log')], { hidden: true })
fsTrees.getName(tree) // '/'
fsTrees.getMeta(tree).hidden // true

const [file] = fsTrees.getChildren(tree)
fsTrees.getName(file) // 'hexlet.log'

// У файла нет метаданных
fsTrees.getMeta(file).unknown // undefined

// А вот так делать не надо
// У файлов нет детей
fsTrees.getChildren(file)
```

Есть две функции проверки типа — ими удобно обрабатывать файлы и директории по отдельности:

```javascript
import * as fsTrees from '@hexlet/immutable-fs-trees'

const tree = fsTrees.mkdir('/', [fsTrees.mkfile('hexlet.log')], { hidden: true })
fsTrees.isDirectory(tree) // true
fsTrees.isFile(tree) // false

const [file] = fsTrees.getChildren(tree)
fsTrees.isFile(file) // true
fsTrees.isDirectory(file) // false
```

Этого набора достаточно для любых преобразований. Начнём с простых, без рекурсивного обхода.

## Обработка

В неизменяемом стиле любая обработка — это новые данные, собранные из старых. Ниже — несколько примеров.

### Изменение имени файла

```javascript
const file = fsTrees.mkfile('one', { size: 35 })

// При переименовании важно сохранить метаданные
// _ – lodash
const newMeta = _.cloneDeep(fsTrees.getMeta(file))
const newFile = fsTrees.mkfile('new name', newMeta)
```

По сути создаётся новый файл с метаданными старого. Перед этим метаданные клонируют (глубоко). Объекты передаются по ссылке: без клонирования правка нового файла затронет старый:

```javascript
const file = fsTrees.mkfile('one', { size: 35 })

// При переименовании важно сохранить метаданные
const newMeta = fsTrees.getMeta(file)
// Бум! У file тоже поменялись метаданные
newMeta.size = 15
const newFile = fsTrees.mkfile('new name', newMeta)

console.log(fsTrees.getMeta(file)) // { size: 15 }
```

### Сортировка содержимого директории

```javascript
// Сортировка в обратном порядке

const tree = fsTrees.mkdir('/', [
  fsTrees.mkfile('one'),
  fsTrees.mkfile('two'),
  fsTrees.mkdir('three'),
])

const children = fsTrees.getChildren(tree)
const newMeta = _.cloneDeep(fsTrees.getMeta(tree))
// reverse изменяет массив, поэтому клонируем
const newChildren = [...children].reverse()
const tree2 = fsTrees.mkdir(fsTrees.getName(tree), newChildren, newMeta)
console.log(tree2)
// => {
// =>   name: '/',
// =>   children: [
// =>     { name: 'three', children: [], meta: {}, type: 'directory' },
// =>     { name: 'two', meta: {}, type: 'file' },
// =>     { name: 'one', meta: {}, type: 'file' }
// =>   ],
// =>   meta: {},
// =>   type: 'directory'
// => }
```

### Обновление содержимого директории

```javascript
// Приведение к нижнему регистру имён директорий и файлов
// внутри конкретной директории

const tree = fsTrees.mkdir('/', [
  fsTrees.mkfile('oNe'),
  fsTrees.mkfile('Two'),
  fsTrees.mkdir('THREE'),
])

const children = fsTrees.getChildren(tree)
const newChildren = children.map((child) => {
  const name = fsTrees.getName(child)
  const newMeta = _.cloneDeep(fsTrees.getMeta(child))
  if (fsTrees.isDirectory(child)) {
    const children = [...fsTrees.getChildren(child)]
    return fsTrees.mkdir(name.toLowerCase(), children, newMeta)
  }
  return fsTrees.mkfile(name.toLowerCase(), newMeta)
})
// Обязательно копируем метаданные
const newMeta = _.cloneDeep(fsTrees.getMeta(tree))
const tree2 = fsTrees.mkdir(fsTrees.getName(tree), newChildren, newMeta)
console.log(tree2)
// => {
// =>   name: '/',
// =>   children: [
// =>     { name: 'one', meta: {}, type: 'file' },
// =>     { name: 'two', meta: {}, type: 'file' },
// =>     { name: 'three', children: [], meta: {}, type: 'directory' }
// =>   ],
// =>   meta: {},
// =>   type: 'directory'
// => }
```

### Удаление файлов внутри директории

```javascript
const tree = fsTrees.mkdir('/', [
  fsTrees.mkfile('one'),
  fsTrees.mkfile('two'),
  fsTrees.mkdir('three'),
])

const children = fsTrees.getChildren(tree)
const newChildren = children.filter(fsTrees.isDirectory)
const newMeta = _.cloneDeep(fsTrees.getMeta(tree))
const tree2 = fsTrees.mkdir(fsTrees.getName(tree), newChildren, newMeta)
console.log(tree2)
// => {
// =>   name: '/',
// =>   children: [ { name: 'three', children: [], meta: {}, type: 'directory' } ],
// =>   meta: {},
// =>   type: 'directory'
// => }
```

## Далее →
