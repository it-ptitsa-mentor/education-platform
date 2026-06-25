---
title: "Условные конструкции"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: bec275ab-6f78-4275-8d5e-f5c7af781707
---

# Условные конструкции

- [if](https://buildin.ai/bec275ab-6f78-4275-8d5e-f5c7af781707#abdf8d0d-0b08-42c4-8d2b-8997d38ddbb0)

- [else](https://buildin.ai/bec275ab-6f78-4275-8d5e-f5c7af781707#9a0b7144-24aa-4b6c-b6d7-be4cf98b45a6)

- [Конструкция else if](https://buildin.ai/bec275ab-6f78-4275-8d5e-f5c7af781707#cfc05a6f-6b8f-46f7-a60a-5b9447209e90)

Условные конструкции позволяют изменить поведение программы в зависимости от проверяемых условий. Благодаря им у нас появляется возможность писать сложные программы, ведущие себя по-разному в зависимости от ситуации.

## if

Напишем, для примера, функцию, которая определяет тип переданного предложения. Для начала она будет отличать обычные предложения от вопросительных.

```
const getTypeOfSentence = (sentence) => {
  const lastChar = sentence[sentence.length - 1]
  if (lastChar === '?') {
    return 'question'
  }

  return 'general'
}

getTypeOfSentence('Hodor') // general
getTypeOfSentence('Hodor?') // question
```

`if` — конструкция языка, управляющая порядком выполнения инструкций. В скобках ей передается выражение-предикат, а затем описывается блок кода в фигурных скобках. Этот блок кода будет выполнен, только если предикат — истина.

Если предикат — ложь, то блок кода в фигурных скобках пропускается, и функция продолжает свое выполнение дальше. В нашем случае следующая строчка кода — `return 'general';` — заставит функцию вернуть строку и завершиться. Как видите, `return` может находиться где угодно в функции. В том числе внутри блока кода с условием.

<!-- IMG (из Buildin, перезалить отдельно) -->
Если в фигурных скобках после `if` содержится только одна строчка кода, то фигурные скобки можно не писать и сделать так:

```
const getTypeOfSentence = (sentence) => {
  const lastChar = sentence[sentence.length - 1]
  if (lastChar === '?')
    return 'question'

  return 'general'
}

console.log(getTypeOfSentence('Hodor')) // => general
console.log(getTypeOfSentence('Hodor?')) // => question
```

Советуем не делать так и **всегда писать фигурные скобки**. В таком случае явно видно, где начинается и заканчивается тело условия. Код становится более четким и понятным.

## else

Напишем функцию `getTypeOfSentence()`, которая анализирует текст и возвращает описание его тона: для обычных предложений – *General sentence*, для вопросительных – *Question sentence*.

```
getTypeOfSentence('Hodor') // General sentence
getTypeOfSentence('Hodor?') // Question sentence
```

Реализация функции:

```
const getTypeOfSentence = (sentence) => {
  // Объявляем переменную, в которую запишем тип предложения
  let sentenceType
  // Предикат, проверяющий окончание текста
  // Если он оканчивается на символ '?', то вернется true,
  // иначе false
  if (sentence.endsWith('?')) {
    // Если условие выше сработало,
    // то это вопросительное предложение.
    // Присваиваем sentenceType соответствующее значение.
    sentenceType = 'Question'
  }
  else {
    // Во всех остальных случаях предложение — обычное
    sentenceType = 'General'
  }

  // С помощью интерполяции формируем строку
  return `${sentenceType} sentence`
}
```

Мы добавили ключевое слово `else` и новый блок с фигурными скобками. Этот блок выполнится, только если условие в `if` — ложь.

Существует два способа оформления конструкции *if-else*. С помощью отрицания можно изменить порядок блоков:

```
const getTypeOfSentence = (sentence) => {
  let sentenceType
  // Добавилось отрицание
  // Содержимое else переехало в if и наоборот
  if (!sentence.endsWith('?')) {
    sentenceType = 'General'
  }
  else {
    sentenceType = 'Question'
  }

  return `${sentenceType} sentence`
}
```

Какой способ предпочтительнее? Человеческому мозгу проще мыслить прямолинейно, а не через отрицание. Старайтесь выбирать проверку, которая не содержит отрицаний, и подстраивайте содержимое блоков под нее.

## Конструкция else if

Функция `getTypeOfSentence()` из предыдущего примера различает только вопросительные и обычные предложения. Давайте попробуем добавить поддержку восклицательных предложений:

```
const getTypeOfSentence = (sentence) => {
  const lastChar = sentence[sentence.length - 1]
  let sentenceType

  if (lastChar === '!') {
    sentenceType = 'exclamation'
  }
  else {
    sentenceType = 'normal'
  }

  if (lastChar === '?') {
    sentenceType = 'question'
  }

  return `Sentence is ${sentenceType}`
}

getTypeOfSentence('Who?') // Sentence is question
getTypeOfSentence('No') // Sentence is normal
getTypeOfSentence('No!') // Sentence is exclamation
```

Мы добавили еще одну проверку ("exclamation" переводится «восклицание»). Технически функция работает, но с точки зрения семантики есть проблемы:

- Проверка на наличие вопросительного знака происходит в любом случае, даже если уже был обнаружен восклицательный знак.

- Ветка `else` описана именно для первого условия, но не для второго.

Правильнее будет воспользоваться еще одной возможностью условной конструкции:

```
const getTypeOfSentence = (sentence) => {
  const lastChar = sentence[sentence.length - 1]
  let sentenceType

  if (lastChar === '?') {
    sentenceType = 'question'
  }
  else if (lastChar === '!') {
    sentenceType = 'exclamation'
  }
  else {
    sentenceType = 'normal'
  }

  return `Sentence is ${sentenceType}`
}

getTypeOfSentence('Who?') // Sentence is question
getTypeOfSentence('No') // Sentence is normal
getTypeOfSentence('No!') // Sentence is exclamation
```

Теперь все условия выстроены в единую конструкцию. `else if` — это «если не выполнено предыдущее условие, но выполнено текущее». Получается такая схема:

- если последний символ это `?`, то `'question'`

- иначе, если последний символ это `!`, то `'exclamation'`

- иначе `'normal'`

Выполнится только один из блоков кода, относящихся ко всей конструкции `if`.

## Далее →
