---
title: "Классы как типы"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 9fa2132f-0dfb-43b4-90cb-135b70cc8e81
---

# Классы как типы

Классы в TypeScript являются одновременно значением и типом данных. Второе особенно важно в контексте типизации функций и методов, что мы и изучим в этом уроке.

Рассмотрим следующий пример:

```
class Point {
  x: number

  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

function isEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y
}
```

Здесь функция `isEqual()` принимает два аргумента типа `Point`. И хоть мы используем в качестве типа класс `Point`, но передавать в функции мы можем любые объекты с полями `x` и `y`:

```
isEqual({ x: 1, y: 2 }, { x: 1, y: 2 }) // true
```

Такое поведение обусловлено структурной типизацией. При сравнении типов TypeScript сравнивает их структуру, а не имена. На практике это упрощает работу с внешними библиотеками и заглушками для тестирования.

TypeScript будет явно требовать экземпляр класса, если у него есть приватные поля:

```
class Point {
  private x: number

  private y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  isEqual(p2: Point): boolean {
    return this.x === p2.x && this.y === p2.y
  }
}

const point = new Point(1, 2)
point.isEqual(new Point(10, 1)) // true
point.isEqual({ x: 1, y: 2 }) // Error: Argument of type '{ x: number; y: number; }' is not assignable to parameter of type 'Point'.
```

## Дополнительные материалы

- [Перегрузка конструктора](https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors)

## Далее →
