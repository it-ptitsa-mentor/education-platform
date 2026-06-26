---
title: "Хук useRef"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 341872d3-597a-4af6-8a41-80d70984e6da
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Хук useRef

Иногда нужен доступ к DOM-узлу — вызвать метод элемента, поставить фокус. DOM не часть модели React; для связи служит `useRef()`:

```javascript
const Input = () => {
  // null — начальное значение
  const inputEl = useRef(null)

  const onButtonClick = () => {
    // `current` указывает на смонтированный элемент `input`
    inputEl.current.focus()
  }

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Фокус</button>
    </>
  )
}
```

Значение в `inputEl.current` появляется после монтирования. На элемент вешают атрибут `ref` — так хук связывается с узлом.

Второй сценарий — хранить произвольные данные между рендерами. `useRef` возвращает объект `{ current }`, стабильный на всех вызовах компонента — аналог поля экземпляра в классе (`this.someproperty`).

Пример хранения предыдущего состояния — в CodePen с подключённым React.

## Дополнительные материалы

- [Использование хука useRef](https://ru.reactjs.org/docs/hooks-reference.html#useref)

- [Измерение узла DOM](https://ru.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)

## **Далее → **
