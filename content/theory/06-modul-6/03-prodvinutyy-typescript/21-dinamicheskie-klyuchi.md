---
title: "Динамические ключи"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: e9ae6bed-1f01-4a0c-a9d9-384c86b57ab3
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Динамические ключи

Ключи объекта в TypeScript могут быть строками, числами или символами — как в JavaScript; для этого есть индексные сигнатуры.

Ранее поля назывались явно; теперь — синтаксис для произвольных ключей:

```typescript
type dynamicKeysObject = {
  [key: string | number | symbol]: unknown
}
```

Здесь объявили объектный тип `dynamicKeysObject`, в котором ключом может служить любой тип из доступных типов данных `key: string | number | symbol`. Разберём, как указать такой тип для переменной:

```typescript
const obj: dynamicKeysObject = {
  name: 'John',
  age: 30,
  0: 'zero',
  [Symbol('secret')]: 'symbol',
}
```

Еще динамические ключи можно использовать совместно с указанными явно полями. Тогда ограничения динамических полей также будут распространяться и на них:

```typescript
type MyTheme = {
  palette: {
    primary: 'red' | 'green' | 'blue'
    [key: string]: string
  }
  [key: string]: unknown
}

const theme = {
  palette: {
    primary: 'red',
  },
  spacing: {
    small: 8,
  },
} satisfies MyTheme
```

В примере мы явно указали тип для поля `palette`, получили корректную проверку типа с помощью `satisfies` и при этом оставили достаточно свободы для дальнейшего расширения темы.

Точно такой же синтаксис и поведение у динамических ключей в интерфейсах:

```typescript
interface MyTheme {
  palette: {
    primary: string
  }
  [key: string]: unknown
}
```

В классах динамические ключи можно использовать для обычных и для `static` полей:

```typescript
class Template {
  static [propName: string]: string | number;

  [key: string]: string;
}

Template.test = 'test'

const template = new Template()
template.test = 'test'
```

## Template String Literal

Динамические ключи полезны там, где нам неизвестны все возможные имена полей объекта, но мы все равно хотим ограничить их тип. В TypeScript тип ключа может также быть и шаблонным литералом. Для примера разберём объявить тип слушателя и потребовать, чтобы все его методы начинались со слова `on`:

```typescript
type Listeners = {
  [key: `on${string}`]: (value: unknown) => void
}

const streamListeners: Listeners = {
  onStart() {},
  onFinished() {},
}
```

Литеральный тип `on${string}` нам говорит, что мы ожидаем строку по шаблону «строка начинается с `on`, а дальше идет любая строка». Такая техника называется *Template String Literal*, она помогает наложить ограничения при типизации строк.

В типичном веб-приложении структура большинства объектов нам известна изначально. Потому использование динамических ключей чаще можно увидеть в библиотеках и вспомогательных функциях, которые мы и разберём в следующих уроках.

## Далее →
