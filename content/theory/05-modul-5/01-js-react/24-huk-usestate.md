---
title: "Хук useState"
module: "Модуль 5"
topic: "JS: React"
buildin_id: e55e671e-5197-48a5-9501-05d7d79b222c
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Хук useState

Вы уже умеете писать функциональные компоненты. Попытка хранить счётчик в локальной переменной выглядит так:

```javascript
const Example = () => {
  let count = 0
  const incrementCount = () => {
    count += 1
  }

  return (
    <div>
      <p>
        Вы нажали
        {count}
        {' '}
        раз(а)
      </p>
      <button onClick={incrementCount}>
        Нажми меня
      </button>
    </div>
  )
}
```

Пример можно открыть в CodePen с подключённым React.

В обработчике `count` растёт, но на экране остаётся `0`: React не отслеживает обычные переменные. Функция компонента вызывается снова только когда React сам перерисует дерево. Нужен способ сообщить React о новом состоянии — для этого `useState()`.

`useState()` отвечает за состояние в функциональном компоненте: инициализация, обновление и чтение в одном API. В отличие от классов, отдельного `this.state` нет.

```javascript
// Не забываем импортировать
import React, { useState } from 'react'

const Example = () => {
  // Имена возвращаемых значений выбираются произвольно
  const [count, setCount] = useState(0)

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

Пример можно открыть в CodePen с подключённым React.

`useState(initial)` возвращает пару: текущее значение и функцию обновления. Компонент вызывается при каждой перерисовке, и `useState` тоже — но начальное значение применяется один раз; дальше React хранит состояние внутри. Менять его можно только через `setCount` (или аналог).

`setCount` вызывают из обработчиков или передают в дочерние компоненты — как `setState` в классах.

В отличие от `this.setState()`, `useState` не сливает старое состояние с новым:

```javascript
const [todo, setTodo] = useState({ task: 'Вынести мусор' })

// Где-то в колбеке
setTodo({ result: 'Мусор вынесен' })

// На следующем цикле
// Пропало начальное значение
console.log(todo) // => { result: 'Мусор вынесен' }
```

Хуков состояния может быть несколько:

```javascript
const ExampleWithManyStates = () => {
  const [age, setAge] = useState(42)
  const [schoolName, setSchoolName] = useState('IT Птица')
  const [todos, setTodos] = useState([{ text: 'Изучить хуки' }])
  // ...
}
```

## Сколько создавать переменных состояния?

Технически всё можно свернуть в один объект, как в классах, но с хуками это редко нужно. Удобнее дробить то, что обновляется вместе:

```javascript
const [position, setPosition] = useState({ left: 0, top: 0 })
const [size, setSize] = useState({ width: 100, height: 100 })
```

## Дополнительные материалы

- [Использование хука useState](https://ru.reactjs.org/docs/hooks-state.html)

## **Далее → **
