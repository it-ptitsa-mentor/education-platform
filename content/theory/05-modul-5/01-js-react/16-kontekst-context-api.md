---
title: "Контекст (Context API)"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 20d92f03-87b8-4ff7-8141-9f342a1aab0e
---

# Контекст (Context API)

Передача данных через пропсы вниз по иерархии компонентов — это немного многословный, но простой механизм. Всегда видно, откуда пришли данные и как они попали внутрь, а компоненты легко переиспользовать, так как они зависят только от входных данных. Но бывают ситуации, когда передача пропсов не вписывается в то, как работает код.

Возьмем для примера текущего пользователя. Часто данные пользователя нужны одновременно в разных частях страницы, причем в очень глубоких компонентах. Для этого придется передавать пользователя буквально по всей иерархии: даже там, где он не нужен компоненту. Единственная цель такой передачи — прокинуть данные до места назначения, пройдя по пути все промежуточные компоненты. Получается, что множество компонентов никак не используют пользователя, они просто передают их дальше по цепочке. В нашей ситуации данные пользователя глобальные. Они нужны сразу многим компонентам на разных уровнях иерархии. Для таких задач в React существует обходной путь.

Context API — механизм, позволяющий сделать глобальные данные доступными из любого компонента напрямую, без прокидывания пропсов. Его использование сводится к трем шагам:

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

[https://codepen.io/hexlet/pen/abYVNZR](https://codepen.io/hexlet/pen/abYVNZR)

Еще один пример, где несколько компонентов используют данные из контекста:

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

[https://codepen.io/hexlet/pen/ZExaWVm](https://codepen.io/hexlet/pen/ZExaWVm)

В отличие от пропсов, изменение данных в контексте не приводит к перерисовке по умолчанию. Идеально, когда данные в контексте используются только для чтения. Изменяемые данные лучше хранить внутри состояния компонентов. Однако, если очень нужно, то реагировать на изменение контекста возможно, об этом подробнее можно прочитать в документации. В прикладном коде такая возможность используется редко, но на ней основаны разнообразные библиотеки.

Рассмотрим пример, когда контекст используется совместно с изменяемыми данными. Для этого расширим наш пример, добавив больше компаний и переключение между ними:

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

Разберем пример:

1. Мы создали контекст `CompanyContext`, который хранит информацию о нескольких компаниях, текущую выбранную компанию и функцию для изменения компании.

1. В компоненте `<App/>` определено состояние с текущей компанией и метод для её изменения.

1. Компоненты `<CompanyNameComponent/>` и `<CompanyAddressComponent/>` получают данные из контекста и отображают название и адрес текущей компании.

1. `<CompanySwitcher/>` позволяет переключать между компаниями, обновляя состояние и тем самым меняя отображаемые данные на странице.

При изменении данных в контексте компоненты, которые зависят от этих данных, будут перерисованы. Это происходит благодаря тому, что состояние, хранящее данные контекста, изменяется в компоненте-родителе (`<App/>`), и новое значение контекста передается вниз через провайдер. Это удобно для таких задач, где изменение состояния напрямую влияет на всё приложение (например переключение темы, языка, пользователя и тд).

[https://codepen.io/hexlet/pen/YzmVpmr](https://codepen.io/hexlet/pen/YzmVpmr)

## Дополнительные материалы

- [Context API](https://ru.reactjs.org/docs/context.html)

## **Далее → **
