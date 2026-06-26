---
title: "Асинхронные функции"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: e9355d94-4f4c-475d-8577-66fe7f787bb8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Асинхронные функции

`Promise` в JavaScript избавляет от вложенных колбэков; в TypeScript к нему добавляется типизация через дженерик `Promise<T>` и `async`/`await`:

```typescript
const promise = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    resolve(42)
  }, 1000)
})
```

`Promise` — это дженерик с типом, который будет возвращен в случае успешного выполнения. В примере выше это тип `number`.

Чтобы продолжать работать в одном стиле с функциями, которые принимают callback, мы можем промисифицировать их. Для этого нам нужно обернуть функцию в `Promise`:

```typescript
const wait = (ms: number): Promise<number> => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}
```

Мы можем и не описывать тип возвращаемого значения — TypeScript сможет его вывести из типа, который мы передаем в `Promise`. Также `Promise` возвращается автоматически из любой функции, помеченной как `async`. Тип возвращаемого значения будет обернут в `Promise`:

```typescript
const getHours = async () => {
  return new Date().getHours()
}

const hoursPromise: Promise<number> = getHours()
```

Как и контейнер, `Promise` заворачивает значения внутри себя, поэтому мы можем использовать `await` для получения значения из него:

```typescript
const hours = await getHours()
```

В TypeScript `await` используется так же, как в JavaScript.

В итоге, `Promise` и `async/await` позволяют писать асинхронный код в синхронном стиле, что сильно упрощает работу с асинхронным кодом. TypeScript поддерживает этот синтаксис и с помощью дженериков позволяет нам использовать его со всей мощью типизации.

## Далее →
