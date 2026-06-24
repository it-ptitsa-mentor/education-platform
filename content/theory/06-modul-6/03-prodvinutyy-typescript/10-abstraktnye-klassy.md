---
title: "Абстрактные классы"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 72c842ba-ac1f-4d41-9176-fec9cd740918
---

# Абстрактные классы

Когда нам нужно определить общее поведение для нескольких классов, удобно использовать абстрактные классы, которые мы разберем в этом уроке.

Абстрактные классы хоть и не могут быть созданы напрямую, однако они могут быть наследованы. Еще они могут указать явно, какой метод должен быть реализован в наследниках:

```
abstract class CustomFile {
  protected name: string

  protected size: number

  constructor(name: string, size: number) {
    this.name = name
    this.size = size
  }

  sizeInKb(): number {
    return this.size / 1024
  }
}

class ImageCustomFile extends CustomFile {
  constructor(name: string, size: number) {
    super(name, size)
  }
}
```

Чтобы выносить из классов общую часть кода, абстрактные классы активно используются для построения архитектуры приложения и фреймворков. Например, в React есть класс `Component`, который может быть представлен как абстрактный класс. Мы не можем создать его напрямую, но он требует от наследников реализации метода `render`. Это позволяет создавать компоненты, которые будут рендериться при инициализации:

```
abstract class Component {
  abstract render(): void

  constructor() {
    this.render()
  }
}
```

## Далее →
