---
title: "Статические методы и свойства"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: a17b4b99-2f43-4b6f-9510-67da0bd92e02
---

# Статические методы и свойства

Иногда нам требуется задать свойство или метод, который будет общим для всех экземпляров этого класса. Например, чтобы определить, является ли объект экземпляром класса. В таком случае при объявлении метода мы можем указать ключевое слово `static`, и он станет доступен через имя класса:

```
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

Статическим методам и свойствам также можно назначить модификаторы доступа `public`, `protected` и `private` и модификатор неизменяемости `readonly`. Это позволяет ограничить использование свойств и методов только текущим классом или наследниками.

## Далее →
