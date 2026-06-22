---
title: "15. Функциональные компоненты"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 51ba1f08-a083-421a-8bbc-64b80e5ec481
---

# 15. Функциональные компоненты

Для создания компонентов React не обязательно использовать классы, существуют и альтернативные способы:

```javascript
const List = (props) => {
  return (<ul>
    {props.items.map((v) => <li>{v}</li>)}
  </ul>);
}

const mountNode = document.getElementById('react-root');
const root = ReactDOM.createRoot(mountNode);

root.render(<List items={[1, 2, 3]} />);
```

[https://codepen.io/hexlet/pen/brXoER](https://codepen.io/hexlet/pen/brXoER)

Компоненты, созданные как функции, называются **функциональными**. Они принимают объект со свойствами как первый аргумент и также начинаются с большой буквы.

Функциональные компоненты стали превалировать над классовыми с появлением хуков. Они более лаконичны и позволяют писать чистый код. Еще у них нет своего изменяемого состояния, поэтому их легче тестировать и переиспользовать. В то же время, функциональные компоненты не включают методы жизненного цикла, что может ограничивать их использование. В следующем курсе мы начнем использовать функциональные компоненты и познакомимся с основными хуками React.

## Пространства имён

Вспомните пример из прошлого урока, связанный с использованием компонентов-потомков, созданных специально для родительского компонента:

```javascript
<Card>
  <CardTitle>Title</CardTitle>
  <CardBody>
    <b>Body</b>
  </CardBody>
</Card>
```

Следуя сказанному выше, компоненты `<CardTitle>` и `<CardBody>` должны быть реализованы как функциональные.

Но это еще не всё, можно пойти дальше и реализовать такую структуру:

```javascript
import Card from './Card.jsx'

<Card>
  <Card.Body>
    <Card.Title>Title</Card.Title>
  </Card.Body>
</Card>
```

JSX поддерживает механизм пространств имён. Не сказать, что без него нельзя жить, но он довольно удобен. Во-первых, достаточно импортировать только компонент верхнего уровня, а остальное доступно уже через него, что довольно логично, если смотреть на JSX как на JS-код. Во-вторых, так лучше задаётся семантика.

Реализуется подобный механизм через статические свойства.

```javascript
const Title = (props) => <div className="card-title">{props.children}</div>;
const Body = (props) => <div className="card-body">{props.children}</div>;

class Card extends React.Component {
  static Body = Body;
  static Title = Title;

  render() {
    return <div className="card card-block">{this.props.children}</div>;
  }
}

const vdom = (<Card>
  <Card.Body>
    <Card.Title>What is love?</Card.Title>
  </Card.Body>
</Card>);

const mountNode = document.getElementById('react-root');
const root = ReactDOM.createRoot(mountNode);

root.render(vdom);
```

[https://codepen.io/hexlet/pen/brXooa](https://codepen.io/hexlet/pen/brXooa)

Такой способ компоновки не требует того, чтобы все компоненты были созданы в одном файле. Структура может быть любой, для остального есть импорты.

## Дополнительные материалы

- [В чём плюс функциональных компонентов?](https://ru.hexlet.io/qna/javascript/questions/zachem-nuzhny-funktsionalnye-komponenty-v-react-v-chyom-ih-plyus-po-sravneniyu-s-klassami)

## **Далее → **
