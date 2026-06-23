---
title: "Обработка имён классов"
module: "Модуль 5"
topic: "JS: React"
buildin_id: a9b50a5e-a407-47df-9b91-b0ddcf16e404
---

# Обработка имён классов

Интерактивные элементы UI имеют более одного состояния отображения. Например, модальное окно может быть открыто или закрыто, а переключатель — включён или выключен. Обычно эти состояния меняют с помощью классов.

Работая напрямую с DOM, мы можем использовать `classList`, который содержит удобные методы для добавления и удаления классов. В React из коробки нет никаких удобств. Свойство `className` — это всего лишь строка, а строки неудобны для обработки:

```javascript
class Button extends React.Component {
  render() {
    const { isPressed, isHovered, label } = this.props
    let btnClass = 'btn'
    if (isPressed) {
      // Приходится конкатенировать классы
      btnClass += ' btn-pressed'
    }
    else if (isHovered) {
      btnClass += ' btn-over'
    }
    return <button className={btnClass}>{label}</button>
  }
};
```

Для решения этой задачи создатели React рекомендуют использовать пакет *classnames*. Принцип его работы прост. Вместо манипулирования строчкой напрямую, мы формируем правильный объект, который уже будет преобразован в строку:

```javascript
import cn from 'classnames'

class Button extends React.Component {
  render() {
    const { isPressed, isHovered, label } = this.props
    // Значение — это `true` или `false`
    // При значении `true` класс включен, при `false` — выключен
    // `'btn'` — это класс, который будет подставлен в любом случае
    const btnClass = cn('btn', {
      'btn-pressed': isPressed,
      'btn-over': !isPressed && isHovered,
    })
    return <button className={btnClass}>{label}</button>
  }
};
```

Подставим конкретные значения:

```javascript
const btnClass = cn('btn', {
  'btn-pressed': false,
  'btn-over': true,
})

console.log(btnClass) // 'btn btn-over'
```

Функция `cn()` принимает на вход любое количество аргументов. Если аргумент имеет строковой тип, то он считается обязательным классом. Если это объект, тогда работает логика, описанная выше:

```javascript
const btnClass = cn('btn', 'another-class', {
  'btn-pressed': isPressed,
  'btn-over': !isPressed && isHovered,
})
```

Обязательные классы можно задавать и в самом объекте:

```javascript
const btnClass = cn({
  'btn something-else': true,
  'btn-pressed': isPressed,
  'btn-over': !isPressed && isHovered,
})
```

Иногда имя класса генерируется динамически, тогда можно использовать следующий код:

```javascript
const buttonType = 'primary'
const btnClass = cn('btn', `btn-${buttonType}`)
console.log(btnClass) // 'btn btn-primary'
// Или что-то похожее
// const btnClass = cn('btn', {
//   [`btn-${buttonType}`]: true
// });
```

Функция умеет работать с массивами. Массив можно передавать в любом параметре:

```javascript
const buttonType = 'primary'
const btnClass = cn('btn', ['another-class', 'btn-primary'])
console.log(btnClass) // 'btn another-class btn-primary'
// Или
// const btnClass = cn(['btn', 'another-class', 'btn-primary']);
```

## Дополнительные материалы

- [classnames (документация)](https://github.com/JedWatson/classnames)

## **Далее → **
