---
title: "Хук useEffect"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 41294339-dab6-4ef6-940d-d149629c0ee5
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Хук useEffect

Компонент с загрузкой данных «в лоб»:

```javascript
const Example = () => {
  const [data, setData] = useState({});

  axios.get('/data').then((data) => setData(data));

  return (
    // Отрисовываем данные
  )
};
```

Запрос в теле компонента выполняется при каждом рендере. React сам решает, когда вызывать функцию компонента — её тело может выполняться многократно. Получится цикл: ответ меняет state → перерисовка → снова `axios.get()`.

Не меняйте состояние прямо в рендере — это мы уже обсуждали в контексте MVC.

Побочные эффекты выносят в `useEffect()` — тема этого урока.

`useEffect()` заменяет три колбека жизненного цикла:

- `componentDidMount()`

- `componentDidUpdate()`

- `componentWillUnmount()`

Подробнее об их работе можно прочитать в [официальной документации](https://ru.reactjs.org/docs/react-component.html#componentdidmount).

Простой пример с `alert()` — вызов API браузера с побочным эффектом:

```javascript
import React, { useState, useEffect } from 'react'

const Example = () => {
  const [count, setCount] = useState(0)

  // Работает как componentDidMount и componentDidUpdate вместе взятые
  // Запускается после рендера компонента
  // Вызывается после каждого клика по кнопке
  useEffect(() => {
    // Состояние доступно внутри за счет обычной области видимости
    alert(`Кликов ${count}`)
  })

  // На классах мы бы сделали так
  // Обратите внимание на дублирование
  // componentDidMount() {
  //   alert(`Кликов: ${count}`);
  // }
  // componentDidUpdate() {
  //   alert(`Кликов: ${count}`);
  // }

  return (
    <div>
      <p>
        Вы нажали
        {count}
        {' '}
        раз(а)
      </p>
      <button onClick={() => setCount(count + 1)}>
        Нажми меня
      </button>
    </div>
  )
}
```

Ниже — пример смены фона при клике. Пример можно открыть в CodePen с подключённым React.

Колбек в `useEffect()` срабатывает после первого рендера и после каждого обновления — объединение `componentDidMount` и `componentDidUpdate`. На практике эффекты чаще нужны после любого рендера; дублирование кода сократилось. Типичные сайд-эффекты:

- Извлечение данных

- Работа с BOM(Browser Object Model) API, например, Local Storage

- Прямое изменение DOM, сюда же относятся библиотеки не совместимые с React

Эффект можно не запускать на каждом рендере. Второй аргумент — массив зависимостей: если значения не изменились, колбек пропускается.

```javascript
useEffect(() => {
  alert(`Кликов ${count}`);
}, [count]);

// Равносильно
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    alert(`Кликов ${count}`);
  }
}
```

Колбек вызовется только при смене `count`. Можно передать любой набор переменных: изменилась хотя бы одна — эффект выполняется.

Только после монтирования — пустой массив зависимостей:

```javascript
// Заменяет собой componentDidMount

useEffect(() => {
  alert(`Кликов ${count}`)
}, [])
```

Непривычно, но это частный случай общего правила с зависимостями.

## Сброс эффекта

Иногда эффект нужно отменить — например, при смене пропсов. Из `useEffect` возвращают функцию очистки:

```javascript
// Предположим, что этот эффект зависит от пропса userId
useEffect(() => {
  const id = setTimeout(/* какой-то код с userId */)

  return () => clearTimeout(id)
}, [userId])
```

Смена `userId` сбросит таймер и поставит новый. В классах для того же часто нужны четыре метода жизненного цикла.

Имитация `componentWillUnmount()` — очистка плюс `[]`:

```javascript
useEffect(() => {
  return () => {
    // Эта логика выполнится только при размонтировании компонента
  }
}, [])
```

## Асинхронные запросы

Первый аргумент `useEffect` — функция без возвращаемого промиса: либо ничего, либо функция сброса. Поэтому `async` на колбеке напрямую нельзя:

```javascript
useEffect(async () => {
  const data = await axios.get('/todos')
  // ...
}, [])
```

`async` возвращает Promise — это нарушает контракт. Оборачивают запрос во внутреннюю функцию:

```javascript
useEffect(() => {
  const requestData = async () => {
    const data = await axios.get('/todos')
    // ...
  }
  requestData()
}, [])
```

## Дополнительные материалы

- [Использование хука useEffect](https://ru.reactjs.org/docs/hooks-effect.html)

- [Почему эффекты выполняются при каждом обновлении](https://ru.reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)

## **Далее → **
