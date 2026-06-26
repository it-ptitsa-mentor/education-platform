---
title: "Refs"
module: "Модуль 5"
topic: "JS: React"
buildin_id: a970c039-5c8d-4f29-bb3b-d56894724a85
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Refs

React по умолчанию не даёт напрямую трогать DOM. При подключении сторонних виджетов не на React, выделении текста, фокусе и управлении медиа прямой доступ всё же нужен.

Для этого есть refs. В обычном React-коде они не требуются — лучше обходиться без них.

Задача: сфокусировать поле ввода. Пример можно открыть в CodePen с подключённым React.

`ref` — атрибут компонента; значение — объект из `React.createRef()` в конструкторе. Он лежит на экземпляре, не в `props`/`state`. Свойство `current` даёт DOM-узел — его используют в `componentDidMount` и `componentDidUpdate`.

`this.<имя свойства>.current` — DOM-элемент узла с `ref`, например `<input ref={this.textInput} />`. Значение появляется после монтирования, поэтому ref доступен в `componentDidMount` и `componentDidUpdate`.

Ниже — обёртка над jQuery-плагином [Chosen](https://harvesthq.github.io/chosen/). Пример можно открыть в CodePen с подключённым React.

Refs работают и на собственных классовых компонентах.

## Использование в реальном мире

С React удобно, пока вы внутри React. Многие JS-библиотеки ходят в DOM напрямую:

```javascript
// https://github.com/kylefox/jquery-modal
$('#login-form').modal()
```

Такие зависимости тянут за собой методы жизненного цикла и усложняют код. Обычно пишут компоненты-обёртки: внутри — DOM, снаружи — пропсы React. Пример — [react-resizable](https://github.com/STRML/react-resizable):

```javascript
const Resizable = require('react-resizable').Resizable; // or,
const ResizableBox = require('react-resizable').ResizableBox;

// ES6
import { ResizableBox } from 'react-resizable';

// ...
render() {
  return (
    <ResizableBox width={200} height={200} minConstraints={[100, 100]} maxConstraints={[300, 300]}>
      <span>Contents</span>
    </ResizableBox>
  );
}
```

В JSX нет прямой работы с DOM — только обёртка `ResizableBox`. Так устроены сотни готовых компонентов на GitHub, например:

- [react-hotkeys](https://github.com/greena13/react-hotkeys)

- [react-stripe-elements (платёжный шлюз)](https://github.com/stripe/react-stripe-js)

## **Далее → **
