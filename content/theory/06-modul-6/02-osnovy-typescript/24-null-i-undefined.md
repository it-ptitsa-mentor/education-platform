---
title: "Null и Undefined"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 286ed199-bdc9-4feb-98f8-010acabf724b
---

# Null и Undefined

В TypeScript `null` и `undefined` не просто значения. Это два типа, которые состоят из одного значения. Представим, если бы TypeScript работал так же, как JavaScript. Тогда эти значения можно было бы передавать в любом месте. И неважно, что там ожидается: строка, массив и тому подобное. Это бы привело к двум результатам.

Возникновение ошибки «вызывается несуществующий метод». Такая проблема, например, существует в JavaScript:

```
function foo(value) {
  const upperValue = value.toUpperCase()
  // Остальная логика
}

foo(null) // Uncaught TypeError: Cannot read properties of null (reading 'toUpperCase')
```

В статически типизированных языках, где `null` используется как общий тип для всего, проверка типов ничего не подскажет. В таком случае возникает исключение `NullPointerException` — одно из самых запоминающихся для всех пользователей. Поэтому код начинает обрастать проверками на null:

```
public void doSomething(SomeObject obj) {
  if(obj != null) {
    obj.myMethod();
  }
}

doSomething(null);
```

В TypeScript c правильной (`strict`) конфигурацией подобная проверка встроена, и статический анализатор скажет о возможной проблеме:

```
function foo(value?: string | null) {
  const upperValue = value.toUpperCase() // Object is possibly 'null' or 'undefined'.
  // Остальная логика
}
```

Чтобы ее решить, нужно написать соответствующее условие или использовать оператор `?.`. Это позволяет избежать ошибок во время исполнения кода:

```
function foo(value?: string | null) {
  if (value !== null && value !== undefined) {
    const upperValue = value.toUpperCase() // (parameter) value: string
  }
  // Остальная логика
}
```

Это возможно благодаря выделению значений `null` и `undefined` в отдельные типы. Благодаря каждой проверке мы отсекаем не подходящее нам множество значений и получаем безопасный вызов метода. Такие проверки также называются *Type Guards* или отсечением типов (*Differentiating Types*).

## **Далее → **
