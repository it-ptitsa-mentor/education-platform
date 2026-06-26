---
title: "Статические методы и свойства"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: a17b4b99-2f43-4b6f-9510-67da0bd92e02
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Статические методы и свойства

Общие для всех экземпляров поля и методы помечают `static` и вызывают через имя класса:

```typescript
class CustomFile {
  private static readonly maxCustomFileSize = 1000

  static isCustomFile(file: CustomFile): boolean {
    return file instanceof CustomFile
  }

  protected static isCustomFileTooBig(size: number): boolean {
    return size > CustomFile.maxCustomFileSize
  }

  constructor(private name: string, private size: number) {
    if (CustomFile.isCustomFileTooBig(size)) {
      throw new Error('CustomFile is too big')
    }
  }
}

CustomFile.isCustomFile(new CustomFile('open-world.jpeg', 1000)) // true
```

Статическим методам и свойствам также можно назначить модификаторы доступа `public`, `protected` и `private` и модификатор неизменяемости `readonly`. Так можно ограничить использование свойств и методов только текущим классом или наследниками.

## Далее →
