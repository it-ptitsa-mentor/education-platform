---
title: "Жизненный цикл компонента"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 49bea8db-00d9-4118-8395-35854af965f1
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Жизненный цикл компонента

В типичном React-компоненте достаточно `render` и обработчиков событий:

```javascript
class ArticleItem extends React.Component {
  handleClick = (e) => {
    e.preventDefault()
    const { onClick } = this.props
    onClick()
  }

  render() {
    const { name, description, link } = this.props
    return (
      <div>
        <a href={link} onClick={this.handleClick}>{name}</a>
        <br />
        <div>{description}</div>
      </div>
    )
  }
}

// Пример использования ArticleItem:
// <ArticleItem
//   name="name"
//   description="This is description"
//   link="#"
//   onClick={someFunction}
// />
```

Не всё укладывается в эту схему. Представьте `<Clock />` — цифровые часы *чч:мм:сс*. Заготовка:

```javascript
class Clock extends React.Component {
  render() {
    const currentTime = new Date()
    return (
      <div>{currentTime.toLocaleTimeString()}</div>
    )
  }
}
```

Компонент показывает время на момент рендера. Нужно обновлять его каждую секунду без действий пользователя: событие → новое время → `render` → DOM. Инициализируем состояние:

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  render() {
    const { date } = this.state
    return (
      <div>{date.toLocaleTimeString()}</div>
    )
  }
}
```

Время всё ещё «заморожено» на момент отрисовки, но `state` готов к обновлениям. Подойдёт `setInterval`:

```javascript
setInterval(() => this.setState({ date: new Date() }), 1000)
```

Где его запускать? `render` вызывается при каждом обновлении — новый таймер каждую секунду. Конструктор тоже плох: создание экземпляра и монтирование в DOM — разные моменты:

```javascript
// Вызывается конструктор
const clock = <Clock />

// Что-то долго делаем еще

// Отрисовываем
const root = createRoot(document.getElementById('root'))
root.render(clock)
```

Часы уже тикают, хотя в DOM их ещё нет — лишняя нагрузка и неудобство для тестов. Конструктор не помогает и с очисткой таймера.

У компонента есть фазы: создание, вставка в DOM, обновления, удаление — жизненный цикл (Component Lifecycle). React даёт хуки в этот процесс. Запуск таймера логичнее сразу после монтирования — метод `componentDidMount`, он вызывается один раз после первой отрисовки.

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  componentDidMount() {
    // Сохраняется идентификатор таймера
    this.timerId = setInterval(() => this.setState({ date: new Date() }), 1000)
  }

  render() {
    const { date } = this.state
    return (
      <div>{date.toLocaleTimeString()}</div>
    )
  }
}
```

Идентификатор таймера храним на экземпляре, не в `state` — он не часть UI.

Очистка — `componentWillUnmount`, перед удалением из DOM:

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.setState({ date: new Date() }), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  render() {
    const { date } = this.state
    return (
      <div>{date.toLocaleTimeString()}</div>
    )
  }
}
```

Методов жизненного цикла больше; они сгруппированы так:

Эти методы вызываются по порядку во время создания объекта и вставки его в DOM.

- `constructor()`

- `static getDerivedStateFromProps()`

- `render()`

- `componentDidMount()`

Обновление может происходить при изменении свойств или состояния. Эти методы вызываются по порядку во время перерисовки:

- `static getDerivedStateFromProps()`

- `shouldComponentUpdate()`

- `render()`

- `getSnapshotBeforeUpdate()`

- `componentDidUpdate()`

В эту группу входит один метод. Он вызывается во время удаления компонента из DOM.

- `componentWillUnmount()`

На практике чаще всего встречаются `componentDidMount` (таймеры, запросы, интеграция со сторонним DOM) и `componentWillUnmount`.

## Дополнительные материалы

- [Методы жизненного цикла](https://ru.reactjs.org/docs/state-and-lifecycle.html)

- [Зачем нужно частичное применение в обработчиках событий?](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

## **Далее → **
