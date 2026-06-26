---
title: "Объекты в действии"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: 2f29433b-c6f1-4144-a0b1-191416318367
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Объекты в действии

Разберём практический пример: функция принимает путь к файлу и возвращает сведения о нём в виде объекта.

```
const filepath = '/path/to/index.js'
const fileinfo = getFileInfo(filepath)
// {
//     extension: js
//     filename: index.js
// };
```

В Node.js для разбора путей есть встроенный модуль *path* — в продакшене пользуйтесь им. Здесь важнее то, как собирается объект, а не способ извлечения данных.

Сначала получим имя файла через `split()`:

```
import _ from 'lodash'

// Разделяем путь на промежуточные директории и файл
const parts = filepath.split('/')
// Извлекаем имя файла
// last извлекает последний элемент из массива
const filename = _.last(parts)
```

Расширение — тем же приёмом:

```
const extension = _.last(filename.split('.'))
```

Собираем функцию целиком:

```
const getFileInfo = (filepath) => {
  const parts = filepath.split('/')
  const filename = _.last(parts)
  const extension = _.last(filename.split('.'))

  // В значения вместо переменных подставятся нужные значения
  const info = { filename: filename, extension: extension }

  return info
}
```

Объект можно создать сразу, когда все части готовы. Другой стиль — пустой объект в начале и постепенное заполнение:

```
const getFileInfo = (filepath) => {
  // Инициализация объекта
  const info = {}

  const parts = filepath.split('/')
  const filename = _.last(parts)
  info.filename = filename

  const extension = _.last(filename.split('.'))
  info.extension = extension

  return info
}
```

Что выбрать? В большинстве случаев лучше первый вариант: структура видна сразу. Во втором придётся просмотреть весь код, чтобы понять итог. Второй подход уместен, когда поля добавляются по условию, которое может не выполниться:

```
// Добавляем свойство в объект только если расширение существует
if (extension) {
  info.extension = extension
}
```

Такое встречается реже, но бывает.

## Упрощенный синтаксис создания объектов

При создании «на месте» часто совпадают имя свойства и имя переменной со значением:

```
const info = { filename: filename, extension: extension }
```

Это настолько частый паттерн, что в JavaScript появился сокращённый синтаксис — достаточно перечислить имя переменной:

```
const info = { filename, extension }
```

Подход оказался удобным на практике. Его можно смешивать с обычной записью в одном литерале:

```
const filename = 'file'
const ext = 'jpg'

const info = { filename, extension: ext }
// Порядок не важен, можно было и так
const info = { extension: ext, filename }

// В результате получится
// const info = { filename: 'file', extension: 'jpg' };
```

## Далее →
