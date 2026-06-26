---
title: "Тестирование кода, взаимодействующего с файлами"
module: "Модуль 4"
topic: "JS: Продвинутое тестирование"
buildin_id: d9ead0d2-033f-4226-9202-542a66e9450f
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Тестирование кода, взаимодействующего с файлами

Типичный побочный эффект — работа с файлами: чтение или запись. С чтением проще, с него и начнём.

## Чтение файлов

Чтение редко создаёт проблем: ничего не меняется, всё локально, в отличие от сети. При наличии файла и прав ошибок почти не бывает.

Для тестов функции, читающей файл, нужно одно: возможность передать путь. Тогда достаточно положить файл нужной структуры в фикстуры.

```
// Функция читает файл со списком пользователей системы и возвращает их имена
// В линуксе это файл /etc/passwd
const userNames = readUserNames()
```

В тестах читать */etc/passwd* нельзя: содержимое зависит от окружения. Создайте аналог в фикстурах и передайте путь явно:

```
import fs from 'fs'
import path from 'path'

const getFixturePath = filename => path.resolve(__dirname, '../__fixtures__/', filename)

test('readUserNames', () => {
  // ../__fixtures__/passwd
  const passwdPath = getFixturePath('passwd')
  const userNames = readUserNames(passwdPath)
  expect(userNames).toEqual(/* ожидаемый список */)
})
```

## Запись файлов

С записью сложнее. Нет гарантированной идемпотентности: повторный вызов может вести себя иначе — падать или давать другой результат.

Почему? Допустим, тестируем `log(message)`, которая дописывает сообщения в файл:

```
const log = makeLogger('development.log')
await log('first message')
// cat development.log
// first message
await log('second message')
// cat development.log
// first message
// second message
```

Каждый прогон тестов чуть отличается. При первом запуске создаётся лог-файл, потом он растёт. Отсюда целый набор проблем:

- Создание файла внутри функции — отдельный случай, который нужно тестировать. Повторные прогоны его уже не покрывают.

- Предсказуемый тест писать труднее — приходится хитрить, например проверять только последнюю строку. Качество проверки падает.

- Не критично, но неприятно: в проекте появляется файл, который постоянно увеличивается.

При хорошей организации каждый тест стартует в одинаковом окружении. Файл можно удалять после теста — в Jest для этого есть `afterEach`:

```
import fs from 'fs'

test('log', async () => {
  const log = makeLogger('development.log')

  await log('first message')
  const data1 = await fs.readFile('development.log', 'utf-8')
  expect(data1).toEqual(/* ... */)

  await log('second message')
  const data2 = await fs.readFile('development.log', 'utf-8')
  expect(data2).toEqual(/* ... */)
})

afterEach(async () => {
  await fs.unlink('development.log')
})
```

Часто это работает, но не всегда. Прогон тестов не атомарен — `afterEach` может не выполниться (в том числе по вине Jest).

Надёжнее чистить *до* теста, в `beforeEach`. Единственная тонкость: при первом запуске файла ещё нет, и `unlink()` упадёт. Ошибку можно подавить:

```
import _ from 'lodash'

beforeEach(async () => {
  await fs.unlink('development.log').catch(_.noop)
})
```

Куда писать файлы? Не сохраняйте их внутри проекта. Если код позволяет задать каталог, используйте системную временную директорию через модуль *os*:

```
import os from 'os'

console.log(os.tmpdir())
```

## Виртуальная файловая система (ФС)

Ещё один способ — [mock-fs](https://github.com/tschaub/mock-fs): на время теста подменяется реальная ФС для модуля *fs*. Тестируемую функцию менять не нужно — она «думает», что пишет на диск. Конфигурация задаётся снаружи:

```
import mock from 'mock-fs'

// Конфигурация fs
// Любые операции с этими файлами будут происходить в памяти
// без взаимодействия с реальной файловой системой
mock({
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'empty-dir': {/** empty directory */},
  },
  'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  'some/other/path': {/** another empty directory */},
})

await fs.unlink('path/to/fake/dir/some-file.txt')
```

Идемпотентность получается из коробки: вызов `mock` каждый раз создаёт окружение заново. Достаточно вызвать его в `beforeEach` и тестировать.

## Далее →
