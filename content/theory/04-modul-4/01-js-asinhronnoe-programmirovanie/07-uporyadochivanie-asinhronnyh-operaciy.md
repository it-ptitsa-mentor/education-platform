---
title: "Упорядочивание асинхронных операций"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 6c675e5b-7f37-428b-8835-9aafb246455f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Упорядочивание асинхронных операций

Асинхронность экономит ресурсы, но усложняет то, что в синхронном коде было простым. Прежде всего — **порядок выполнения** (flow). Задача: прочитать два файла и записать объединение в третий.

```
import fs from 'fs'

fs.readFile('./first', 'utf-8', '?')
fs.readFile('./second', 'utf-8', '?')
fs.writeFile('./new-file', content, '?')
```

Запись возможна только после обоих чтений. Единственный приём без дополнительных абстракций — запускать каждую следующую операцию в колбеке предыдущей:

```
import fs from 'fs'

fs.readFile('./first', 'utf-8', (_error1, data1) => {
  fs.readFile('./second', 'utf-8', (_error2, data2) => {
    fs.writeFile('./new-file', `${data1}${data2}`, (_error3) => {
      console.log('File has been written')
    })
  })
})
```

В больших программах вложенность разрастается — это *Callback Hell* («ад колбеков»). Проблему разбирают на [callbackhell.com](https://callbackhell.com/):

```
import fs from 'fs';

// В этом коде происходит обработка ошибок, которую мы рассмотрим в следующем уроке
fs.readdir(source, (err, files) => {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach((filename, fileIndex) => {
      console.log(filename)
      gm(source + filename).size((err, values) => {
        if (err) {
          console.log('Error identifying file size: ' + err)
        } else {
          console.log(filename + ' : ' + values)
          aspect = (values.width / values.height)
          widths.forEach((width, widthIndex) => {
            height = Math.round(width / aspect)
            console.log('resizing ' + filename + 'to ' + height + 'x' + height)
            this.resize(width, height).write(dest + 'w' + width + '_' + filename, (err) => {
              if (err) console.log('Error writing file: ' + err)
            })
          }.bind(this))
        }
      })
    })
  }
})
```

Иногда число операций заранее неизвестно: прочитать директорию и для каждого файла узнать владельца (*uid*). Синхронный вариант:

```
import path from 'path'
import fs from 'fs'

const getFileOwners = (dirpath) => {
  // Читаем содержимое директории
  const files = fs.readdirSync(dirpath)
  // Получаем информацию по каждому файлу и формируем результат
  return files
    .map(fname => [fname, fs.statSync(path.join(dirpath, fname))])
    .map(([fname, stat]) => ({ filename: fname, owner: stat.uid }))
}
// [ { filename: 'Makefile', owner: 65534 },
//       { filename: '__tests__', owner: 65534 },
//       { filename: 'babel.config.js', owner: 65534 },
//       { filename: 'info.js', owner: 65534 },
//       { filename: 'package.json', owner: 65534 } ]
```

Последовательный код прозрачен: каждая строка ждёт предыдущую, в `map` элементы обрабатываются по очереди.

В асинхронном варианте неясно, как описать обработку произвольного числа файлов. Без готовых абстракций код получается громоздким — в продакшене так писать не стоит; пример только для обучения:

```
import path from 'path'
import fs from 'fs'

const getFileOwners = (dirpath, cb) => {
  fs.readdir(dirpath, (_error1, filenames) => {
    const readFileStat = (items, result = []) => {
      if (items.length === 0) {
        // Обработку ошибок пока не рассматриваем
        cb(null, result)
        return
      }
      const [first, ...rest] = items
      const filepath = path.join(dirpath, first)
      fs.stat(filepath, (_error2, stat) => {
        readFileStat(rest, [...result, { filename: first, owner: stat.uid }])
      })
    }
    readFileStat(filenames)
  })
}
```

Идея: рекурсивная `readFileStat` обрабатывает по одному файлу, уменьшает `items` и накапливает результат во втором аргументе; в конце вызывает внешний `cb`. Это [итерация через рекурсию](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Functions#%D1%80%D0%B5%D0%BA%D1%83%D1%80%D1%81%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8). Скопируйте код локально, добавьте `console.log` и прогоните на разных путях.

---

## Далее →
