---
title: "Защита свойств и методов"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 508a6982-f6a8-42b3-9330-f1207e9453f6
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Защита свойств и методов

Часть членов класса предназначена только для внутренней логики — снаружи их лучше не вызывать.

Модификаторы `public`, `private` и `protected` задают видимость: снаружи, только в классе или ещё и в наследниках.

## Публичные свойства

По умолчанию в TypeScript все свойства публичные. Это можно обозначить явно с помощью ключевого слова `public`:

```typescript
class Point {
  public x: number

  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public someMethod() {
    // some logic
  }
}
```

## Приватные свойства

Также свойства можно сделать приватными. Тогда пропадет возможность обращаться к ним снаружи напрямую:

```typescript
class Point {
  private x: number

  private y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const p = new Point(10, 8)
p.x // Property 'x' is private and only accessible within class 'Point'.
p.y // Property 'y' is private and only accessible within class 'Point'.
```

## Защищенные свойства

Наконец, свойства можно сделать защищенными. Это значит, что они доступны внутри класса и в наследниках:

```typescript
class Point {
  protected x: number

  protected y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Point3D extends Point {
  protected z: number

  constructor(x: number, y: number, z: number) {
    super(x, y)
    this.z = z
  }

  public getCoordinates() {
    return [this.x, this.y, this.z] // OK
  }
}

const p = new Point3D(10, 8, 5)
p.x // Property 'x' is protected and only accessible within class 'Point' and its subclasses.
p.y //  Property 'y' is protected and only accessible within class 'Point' and its subclasses.
p.z // Property 'z' is protected and only accessible within class 'Point3D' and its subclasses.
```

## Дополнительные материалы

- [Что такое super()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

## Далее →
