---
title: "Свойства параметров"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 79735db9-2cdf-46aa-835a-85c21c7ded3e
---

# Свойства параметров

Заполнение свойств из параметров конструктора — это частая задача в работе с классами. Поэтому в TypeScript добавили специальный синтаксис, который позволяет делать это автоматически:

```
class SomeClass {
  constructor(public one: number, private two: string) {}

  get three(): string {
    return `${this.one} ${this.two}`
  }
}
```

Этот код делает то же самое, что и этот:

```
class SomeClass {
  public one: number

  private two: string

  constructor(one: number, two: string) {
    this.one = one
    this.two = two
  }

  get three(): string {
    return `${this.one} ${this.two}`
  }
}
```

Новый синтаксис позволяет не дублировать код заполнения свойств из параметров и делает его более лаконичным.

## Далее →
