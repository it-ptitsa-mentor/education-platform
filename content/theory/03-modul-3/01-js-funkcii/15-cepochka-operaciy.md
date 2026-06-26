---
title: "Цепочка операций"
module: "Модуль 3"
topic: "JS: Функции"
buildin_id: df1671db-4ca1-4006-80cd-46d75531f768
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Цепочка операций

`sort()` показывает, зачем функции высшего порядка: алгоритм один, поведение задаётся колбеком на месте. То же с `map()`, `filter()` и `reduce()`.

При работе с ними задачу делят на шаги и выстраивают **цепочку**: данные проходят через преобразователи одно за другим. В [книге «Структура и интерпретация компьютерных программ» (SICP)](https://mitpress.mit.edu/9780262534954/structure-and-interpretation-of-computer-programs/) такой приём сравнивают с [обработкой сигналов](https://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0_%D1%81%D0%B8%D0%B3%D0%BD%D0%B0%D0%BB%D0%BE%D0%B2): ток идёт через фильтры, усилители и т.д.; данные играют роль сигнала, функции — роль блоков схемы.

В JavaScript цепочки — основной способ работы с коллекциями; циклы реже — они менее гибки, длиннее и хуже раскладываются на независимые шаги.

<!-- IMG (из Buildin, перезалить отдельно) -->
Задача: по списку путей найти обычные файлы с расширением `.js` (без учёта регистра) и вернуть их имена. Понадобятся:

- [fs.existsSync(filepath)](https://nodejs.org/api/fs.html#fsexistssyncpath) — проверяет, существует ли файл по указанному пути

- [fs.lstatSync(filepath).isFile()](https://nodejs.org/api/fs.html#fslstatsyncpath-options) — проверяет, является ли объект обычным "регулярным" файлом (а не директорией, ссылкой или другим типом файлов)

- [path.extname(filepath)](https://nodejs.org/api/path.html#pathextnamepath) — извлекает "расширение" из имени файла

- [path.basename(filepath)](https://nodejs.org/api/path.html#path_path_basename_path_ext) — извлекает имя файла из полного пути

```
const getJSFileNames = (paths) => {
  const result = []
  // Подход противоположный потоковой обработке.
  // Здесь все выполняется сразу в куче без разделения по шагам.
  for (const filepath of paths) {
    // Извлекаем расширение
    const extension = path.extname(filepath).toLowerCase()
    // Если путь существует, это файл и у него расширение .js
    if (fs.existsSync(filepath) && fs.lstatSync(filepath).isFile() && extension === '.js') {
      // Нормализуем путь и добавляем в результирующий список
      result.push(path.basename(filepath.toLowerCase(), extension))
    }
  }

  return result
}

const names = getJSFileNames(['index.js', 'wop.JS', 'nonexists', 'node_modules'])
console.log(names) // => [index, wop]
```

Алгоритм цикла: обойти пути; если путь — файл с расширением `.js`, добавить имя в результат.

Тот же смысл через один `reduce()` даст код, похожий на цикл. Но задачу естественнее разбить на фильтрацию и отображение:

```
const getJsFileNames = paths => paths
// отбираем реально существующие файлы
  .filter(filepath => fs.existsSync(filepath))
// отбор по типу файла
  .filter(filepath => fs.lstatSync(filepath).isFile())
// отбор по расширению
  .filter(filepath => path.extname(filepath).toLowerCase() === '.js')
// отображаем в имена (нам нужен массив с именами)
  .map(filepath => path.basename(filepath.toLowerCase(), '.js'))

const names = getJsFileNames(['index.js', 'wop.JS', 'nonexists', 'node_modules'])
console.log(names) // => [index, wop]
```

Код короче и нагляднее; главное — каждый шаг обрабатывает весь набор сразу, проще держать в голове. Научиться так дробить задачи нужна практика.

Фильтрацию здесь разбили на три простых шага вместо одного сложного — в JS это обычно выгоднее.

<!-- IMG (из Buildin, перезалить отдельно) -->
Цепочки опираются на **стандартные интерфейсы**: на входе и выходе шага — один тип (здесь массив). `map`, `filter` и `reduce` комбинируются как детали конструктора: мало примитивов, много вариантов сборки.

Часто цепочка заканчивается `reduce` — агрегация сводит коллекцию к одному значению.

## Производительность

Каждый метод в цепочке — отдельный проход. Больше шагов — больше проходов. На практике для списков до тысяч элементов это почти никогда не узкое место (см. «Продуманная оптимизация» ниже). Есть **ленивые** коллекции: они накапливают операции и выполняют их одним проходом при первом обращении к данным.

---

### Дополнительные материалы

1. [Обработка сигналов](https://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0_%D1%81%D0%B8%D0%B3%D0%BD%D0%B0%D0%BB%D0%BE%D0%B2)

1. [Продуманная оптимизация](http://optimization.guide/)

## Далее →
