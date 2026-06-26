---
title: "Фикстуры"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: d2b2f91e-a35f-4bf7-954e-7165c985c32b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Фикстуры

Функция принимает HTML-строку, вытаскивает ссылки и возвращает массив:

```
// Для тестирования подобной функции, желательно взять HTML-код, близкий к реальному
// Он хоть и не гарантирует работоспособности функции,
// но по крайней мере дает хорошее разнообразие по структуре документа
const html = `
<div class="card mb-3"><div class="card-body"><div class="d-flex flex-column flex-sm-row">
<div class="d-flex flex-column mr-4"><div class="text-muted text-center mb-3">
<div class="h2 mb-0 font-weight-lighter">1</div><div class="small">Ответ</div></div>
<div class="text-muted text-center mb-3"><div class="h2 mb-0 font-weight-lighter">7</div>
<div class="small">Просмотров</div></div></div><div><h5 class="card-title">
<a href="/resumes/1">Backend Software Engineer</a></h5><div class="card-text">
<p>Программист-самоучка, избравший путь постоянного самосовершенствования.
Ценю красивый и лаконичный код, люблю функциональное программирование
(великая троица <code>map</code>, <code>filter</code>, <code>reduce</code>).</p>
<p>Использую JS, Ruby, PHP, Python, Elixir, Clojure в разной степени мастерства.</p>
<p>Восхищаюсь семейством LISP-языков, пишу свой интерпретатор LISP на Elixir.
В настоящий момент углубляюсь в ОС Unix, чтобы в дальнейшем улучшить навыки DevOps.</p>
</div><div class="text-right small"><span class="mr-3 text-muted">12 дней</span>
<a href="/users/6">Иван Иванов</a></div></div></div></div></div>
`

const links = extractLinks(html)
console.log(links)
// => ['/resumes/1', '/users/6']
```

Длинный HTML в теле теста мешает читать логику и легко ломается при правках.

Удобнее хранить разметку в отдельном файле:

```
import fs from 'fs'

test('extractLinks', () => {
  // HTML находится в файле withLinks.html в директории __fixtures__
  // При чтении текстовых файлов, в конце может добавляться пустая строка.
  // Она удаляется с помощью метода `trim`, если нужно
  // __dirname — директория, в которой находится данный файл с тестами
  const html = fs.readFileSync(`${__dirname}/../__fixtures__/withLinks.html`, 'utf-8')
  // Теперь с HTML удобно работать и он не загромождает тесты.
  const links = extractLinks(html)
  expect(links).toEqual(['/resumes/1', '/users/6'])
})
```

Данные для прогона тестов называют **фикстурами** — не только текст: картинки, JSON, XML, записи в БД. Иногда фикстурой бывает и код — например, [в тестах ESLint](https://github.com/eslint/eslint/tree/main/tests/fixtures) для анализаторов.

В Jest фикстуры кладут в __fixtures__ в корне проекта и читают в тестах или хуках.

Пример дерева:

```
tree __fixtures__

├── after.ini
├── after.json
├── after.yml
├── before.ini
├── before.json
├── before.yml
└── result.txt
```

Когда файлов много, повторяется чтение:

```
// Где-то в тестах или в хуках
const html = fs.readFileSync(`${__dirname}/../__fixtures__/withLinks.html`, 'utf-8')
const json = fs.readFileSync(`${__dirname}/../__fixtures__/somethingElse.json`, 'utf-8')
```

Вынесите путь в хелпер и склеивайте через `path`:

```
import path from 'path'

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

// Само чтение файлов нужно выполнять либо внутри тестов,
// либо внутри хуков, например `beforeAll` или `beforeEach`
// Не стоит этого делать на уровне модуля, вне функций
const html = readFile('withLinks.html')
const json = readFile('somethingElse.json')
```

---

### Самостоятельная работа

Протестируйте функцию `reverse()` с длинным текстом

```
// src/index.js
export default str => str.split('').reverse().join('')
```

Эта функция принимает любую строку, возвращает новую перевернутую строку.

```
import reverse from '../src/index.js'

test('reverse', () => {
  // TODO: здесь будет чтение файла и запись его содержимого в константу
  const text = 'длинная строка...'
  const result = '...'

  expect(reverse(text)).toEqual(result)
})
```

Используйте знания, изученные в уроке и создайте необходимые фикстуры. У вас должен получиться как минимум два файла - один для входных данных (исходный текст) и файл с результатом (перевернутая строка).

Не забудьте после изменения кода загрузить изменения в репозиторий Github.

---

### Дополнительные материалы

1. [`__dirname` в Node.js](https://nodejs.org/api/modules.html#dirname)

## Далее →
