---
title: "Обработка строк через преобразование в массив"
module: "Модуль 2"
topic: "JS: Массивы"
buildin_id: 686c34a6-fcd0-4d8c-bc7a-98a3f3212994
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Обработка строк через преобразование в массив

На собеседованиях нередко дают такую задачу:

> Дана строка текста. Нужно сделать заглавной первую букву каждого слова в тексте. Для простоты считаем что мы работаем с текстом, который не содержит знаков препинания:

```
const text = 'hello world'
capitalizeWords(text) // 'Hello World'
```

Подходов несколько — чем больше назовёте, тем лучше:

1. Посимвольный перебор строки

1. Через преобразование в массив

1. Регулярные выражения (отдельный курс)

Разберём вариант с массивом и методом [split()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/split):

```
const capitalizeWords = (sentence) => {
  // определяем разделитель — пробел
  const separator = ' '
  // split разделяет строку по указанному разделителю
  const words = sentence.split(separator)
  // ...
}
```

Дальше — обход слов и заглавная первая буква. Готового метода нет, напишем свой:

```
const capitalize = text =>
  (text.length === 0) ? text : `${text[0].toUpperCase()}${text.slice(1)}`

const capitalizeWords = (sentence) => {
  const separator = ' '
  const words = sentence.split(separator)
  // Формируем массив обработанных слов
  const capitalizedWords = []
  for (const word of words) {
    capitalizedWords.push(capitalize(word))
  }

  // Соединяем обработанные слова обратно в предложение
  return capitalizedWords.join(separator)
}
```

Последний шаг зеркален первому — `join` и возврат строки.

Заметьте: верхний регистр пишем в **новый** массив `capitalizedWords`, а не в `words`. Так проще отладка: при ошибке видны оба массива; если мутировать `words`, исходные слова потеряются.

---

### Дополнительные материалы

1. [Функция words (Lodash)](https://lodash.com/docs#words)

1. [Функция capitalize (Lodash)](https://lodash.com/docs#capitalize)

## Далее →
