---
title: "Контекст (Context API)"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 20d92f03-87b8-4ff7-8141-9f342a1aab0e
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Контекст (Context API)

Проброс данных через пропсы вниз по дереву — понятный и прозрачный способ: всегда видно источник значений и путь их передачи, а компоненты остаются переиспользуемыми, потому что зависят только от входных данных. Но бывают сценарии, когда такой механизм неудобен.

Возьмём данные текущего пользователя. Их часто требуют сразу в нескольких ветках интерфейса, в том числе глубоко вложенных. Тогда пришлось бы тащить объект пользователя через всю цепочку — даже через компоненты, которым он не нужен, лишь чтобы доставить значение до цели. Получается «туннель» пропсов: множество узлов не используют данные, а только пересылают их дальше. Для глобальных величин, нужных на разных уровнях, в React есть Context API.

Context API даёт доступ к общим данным из любого компонента без цепочки пропсов. Типичный сценарий — три шага:

1. Создание контекста:
```javascript
// В параметр передается значение по умолчанию
// Здесь передаем пустой объект, потому что пользователя еще нет,
// но он будет (и будет объектом)
// Контекст может хранить только одно значение
// Имя контекста выбирается исходя из того, какие внутри хранятся данные
const UserContext = React.createContext({})
```

1. Передача данных в контекст. Работает так: оборачиваем нужные компоненты в компонент контекста `<UserContext.Provider>` и передаем туда нужные данные в проп `value`:
```javascript
// Контекст будет доступен только внутри тех компонентов, которые он оборачивает
// и в тех, что вложены в данные компоненты
// currentUser — данные текущего пользователя
<UserContext.Provider value={currentUser}>
  <App />
</UserContext.Provider>
```

1. Получение данных из контекста. В компоненте, где нужны данные, нужно указать тип контекста с помощью статического свойства `contextType`. Реакт ищет ближайший провайдер этого контекста и берет из него значение. Поиск провайдера происходит вверх по дереву компонентов. Значение контекста будет доступно в `this.context`:
```javascript
import UserContext from '...'

// Любой компонент внутри блока <UserContext.Provider>
class InnerComponent extends React.Component {
  // Определяем тип контекста
  static contextType = UserContext
  render() {
    // Получаем доступ к контексту через this.context
    return <Profile user={this.context} />
  }
}
```

Пример можно открыть в CodePen с подключённым React.

Ниже — случай, когда несколько компонентов читают один и тот же контекст:

```javascript
// Создаем контекст
const CompanyContext = React.createContext({})

// Компонент адреса компании
class CompanyAddressComponent extends React.Component {
  // Компонент использует контекст
  static contextType = CompanyContext

  render() {
    // Извлекаем данные из контекста
    const { context } = this
    const { address } = context
    return (
      <>
        {address.street}
        <br />
        {address.city}
        ,
        {address.post}
        <br />
        {address.country}
      </>
    )
  }
}

// Другой компонент отрисовывает название компании
class CompanyNameComponent extends React.Component {
  // Оба компонента используют один контекст
  static contextType = CompanyContext

  render() {
    const { context } = this
    const { name } = context
    return (
      <>
        {name}
      </>
    )
  }
}

class App extends React.Component {
  render() {
    // Компоненты могут быть вложены на любой глубине
    return (
      <>
        <CompanyNameComponent />
        <br />
        <CompanyAddressComponent />
      </>
    )
  }
}

const company = {
  name: 'Google',
  address: {
    street: '100 Bay View Drive',
    post: 'CA 94043',
    city: 'Mountain View',
    country: 'USA',
  },
}

const dom = (
  <CompanyContext.Provider value={company}>
    <App />
  </CompanyContext.Provider>
)

const mountNode = document.getElementById('react-root')
const root = ReactDOM.createRoot(mountNode)
root.render(dom)
```

Пример можно открыть в CodePen с подключённым React.

В отличие от пропсов, смена значения в контексте сама по себе не запускает перерисовку. Обычно контекст держат для чтения; изменяемое состояние разумнее хранить в `state` компонентов. При необходимости подписаться на обновления контекста — см. документацию; в прикладном коде это встречается редко, зато на этом строят многие библиотеки.

Разберём вариант с изменяемыми данными: расширим пример переключением между несколькими компаниями:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'

// Создаем контекст компании
const CompanyContext = React.createContext({
  companies: [],
  currentCompany: {},
  setCompany: () => {},
})

// Массив компаний для переключения
const companies = [
  {
    id: 1,
    name: 'Google',
    address: {
      street: '1600 Amphitheatre Parkway',
      city: 'Mountain View',
      post: 'CA 94043',
      country: 'USA',
    },
  },
  {
    id: 2,
    name: 'Microsoft',
    address: {
      street: 'One Microsoft Way',
      city: 'Redmond',
      post: 'WA 98052',
      country: 'USA',
    },
  },
]

// Компонент для отображения названия компании
class CompanyNameComponent extends React.Component {
  static contextType = CompanyContext
  render() {
    const { currentCompany } = this.context
    return <h1>{currentCompany.name}</h1>
  }
}

// Компонент для отображения адреса компании
class CompanyAddressComponent extends React.Component {
  static contextType = CompanyContext
  render() {
    const { currentCompany } = this.context
    const { street, city, post, country } = currentCompany.address
    return (
      <p>
        {street}
        <br />
        {city}
        ,
        {post}
        <br />
        {country}
      </p>
    )
  }
}

// Компонент для переключения компании
class CompanySwitcher extends React.Component {
  static contextType = CompanyContext

  render() {
    const { companies, setCompany, currentCompany } = this.context
    return (
      <div>
        <h3>Switch Company:</h3>
        {companies.map(company => (
          <button
            key={company.id}
            onClick={() => setCompany(company)}
            disabled={company.name === currentCompany.name}
          >
            {company.name}
          </button>
        ))}
      </div>
    )
  }
}

// Главный компонент приложения
class App extends React.Component {
  constructor(props) {
    super(props)
    // Изначально выбираем первую компанию
    this.state = { currentCompany: companies[0] }
  }

  setCompany = (company) => {
    // Меняем компанию в состоянии
    this.setState({ currentCompany: company })
  }

  render() {
    const { currentCompany } = this.state
    return (
      <CompanyContext.Provider
        value={{ companies, currentCompany, setCompany: this.setCompany }}
      >
        <CompanyNameComponent />
        <CompanyAddressComponent />
        <CompanySwitcher />
      </CompanyContext.Provider>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

Кратко по шагам:

1. Контекст `CompanyContext` хранит список компаний, текущий выбор и функцию смены.

1. В `<App/>` — состояние с активной компанией и метод её обновления.

1. `<CompanyNameComponent/>` и `<CompanyAddressComponent/>` читают контекст и показывают имя и адрес.

1. `<CompanySwitcher/>` переключает компанию, обновляя состояние и экран.

Когда меняется значение в провайдере, затронутые компоненты перерисовываются: состояние живёт в `<App/>`, новое `value` уходит вниз. Так удобно для темы, языка, профиля пользователя и других глобальных настроек.

Пример можно открыть в CodePen с подключённым React.

## Дополнительные материалы

- [Context API](https://ru.reactjs.org/docs/context.html)

## **Далее → **
