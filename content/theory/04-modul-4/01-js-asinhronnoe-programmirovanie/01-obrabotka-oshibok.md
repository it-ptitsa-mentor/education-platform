---
title: "Обработка ошибок"
module: "Модуль 4"
topic: "JS: Асинхронное программирование"
buildin_id: 14354fa4-28fa-480f-9d62-a96a9c57be80
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Обработка ошибок

Чтение и запись файлов, сетевые запросы, HTTP — всё это операции ввода-вывода. Через них программа общается с внешним миром, а внешняя среда подчиняется множеству правил: для чтения файла нужны права доступа, для записи — свободное место на диске, для сети — соединение. Нарушение любого условия приводит к ошибке. Справочник Node.js перечисляет [сотни кодов ошибок](https://nodejs.org/api/errors.html#errors_node_js_error_codes).

В синхронном JavaScript ошибки обрабатывают через исключения: одни функции их выбрасывают, другие ловят в *try..catch*. В асинхронном коде этот приём перестаёт работать так, как привыкли.

Посмотрите, что произойдёт при запуске кода ниже:

```
import fs from 'fs'

try {
  // Пытаемся читать директорию, а это ошибка
  fs.readFile('./directory', 'utf-8', () => {
    callUndefinedFunction()
  })
}
catch (e) {
  console.log('error!')
}
```

*try/catch* действует только в рамках текущего стека вызовов и не перехватывает код, выполненный в другом стеке. Сообщения *error!* не будет, хотя ошибка на экране появится:

```
callUndefinedFunction();
^

ReferenceError: callUndefinedFunction is not defined
    at ReadFileContext.fs.readFile [as callback] (/private/var/tmp/index.js:6:5)
```

Колбек вызвался в стеке, начатом внутри `readFile()`. Вывод: *try/catch* с колбеками бесполезен — конструкция здесь неприменима.

Что выведет следующий фрагмент?

```
import fs from 'fs'

try {
  // Пытаемся читать директорию, а это ошибка
  fs.readFile('./directory', 'utf-8', () => {
    console.log('finished!')
  })
}
catch (e) {
  console.log('error!')
}
```

Ответ: *finished!*. Странно на первый взгляд: ошибка возникла внутри `readFile()`, а не в колбеке. Тело `readFile()` выполняется вне текущего стека вызовов.

Любая асинхронная функция взаимодействует с ОС, значит может завершиться с ошибкой — независимо от того, возвращает ли она данные. Поэтому колбеки асинхронных API первым аргументом принимают *err*: `null` — всё в порядке, иначе — ошибка. Это общее *соглашение* стандартной библиотеки и сторонних пакетов.

```
fs.readFile('./directory', 'utf-8', (err, data) => {
  // Любые ошибки чтения файла: доступ, отсутствие файла, директория вместо файла
  // null неявно приводится к false, поэтому достаточно такой проверки,
  // любой другой ответ трактуется как true
  if (err) {
    console.log('error!')
    return // guard expression
  }

  console.log('finished!')
})
```

В цепочке вложенных вызовов проверку нужно повторять на каждом уровне:

```
import fs from 'fs'

fs.readFile('./first', 'utf-8', (error1, data1) => {
  if (error1) {
    console.log('error in first file')
    return
  }
  fs.readFile('./second', 'utf-8', (error2, data2) => {
    if (error2) {
      console.log('error in second file')
      return
    }
    fs.writeFile('./new-file', `${data1}${data2}`, (error3) => {
      if (error3) {
        console.log('error during writing')
        return
      }
      console.log('finished!')
    })
  })
})
```

Тот же алгоритм внутри обёртки: при ошибке вызываем внешний колбек с ней; при успехе — с `null`. Внешний колбек обязателен, иначе вызывающий код не узнает о завершении:

```
import fs from 'fs'

const unionFiles = (inputPath1, inputPath2, outputPath, cb) => {
  fs.readFile(inputPath1, 'utf-8', (error1, data1) => {
    if (error1) {
      cb(error1)
      return
    }
    fs.readFile(inputPath2, 'utf-8', (error2, data2) => {
      if (error2) {
        cb(error2)
        return
      }
      fs.writeFile(outputPath, `${data1}${data2}`, (error3) => {
        if (error3) {
          cb(error3)
          return
        }
        cb(null) // не забываем последний успешный вызов
      })
    })
  })
}
```

Последний шаг можно сократить: если ошибки не было, `cb(error3)` эквивалентен `cb(null)`:

```
fs.writeFile(outputPath, `${data1}${data2}`, cb)
// что равносильно fs.writeFile(outputPath, `${data1}${data2}`, error3 => cb(error3));
```

---

### Дополнительные материалы

1. [Error.prototype.stack (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack)

## Далее →
