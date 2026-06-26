---
title: "Наследование"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 2564d6d1-8051-4575-a7d2-26c41b3572b1
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Наследование

Наследование даёт подклассам поля и методы базового класса с возможностью расширения. В TypeScript оно задаётся через `extends`.

В TypeScript наследование реализуется с помощью ключевого слова `extends`:

```typescript
// В TypeScript уже включен класс File, поэтому определим свой класс файла с именем CustomFile
class CustomFile {
  constructor(public name: string, public size: number) {}
}

class ImageCustomFile extends CustomFile {
  constructor(name: string, size: number, public width: number, public height: number) {
    super(name, size)
  }
}
```

Множественное наследование классов недоступно, зато цепочка `extends` может быть сколь угодно длинной.

Вся цепочка наследования образует иерархию классов. Так происходит, потому что классы могут использоваться и как типы — иерархия классов полностью совпадает с иерархией типов. Подкласс является подтипом базового класса и может использоваться вместо него, при этом задавать более строгие ограничения:

```typescript
const file = new CustomFile('open-world.jpeg', 1000);
const image = new ImageCustomFile('open-world.jpeg', 1000, 100, 100);

const showImage = (image: ImageCustomFile) => {
...
};
showImage(file); // Error
```

Методы родителя можно переопределять, но сигнатура должна оставаться совместимой:

- Типы параметров переопределенного метода бивариантны — они не ограничены

- Тип возвращаемого значения переопределенного метода ковариантен — он должен быть либо тем же, либо более узким

Родительский метод принимает `string` и возвращает `string`. Переопределенный метод должен иметь более широкий или более узкий тип — например, `string | null` или `'some string'`. Возвращать же должен такой же или более узкий тип — например, `'some string'`:

```typescript
class CustomFileFactory {
  createCustomFile(name: string, size: number): CustomFile {
    return new CustomFile(name, size)
  }
}

class ImageCustomFileFactory1 extends CustomFileFactory {
  createCustomFile(name: string, size: number): ImageCustomFile { // OK
    return new ImageCustomFile(name, size, 100, 100)
  }
}

class ImageCustomFileFactory2 extends CustomFileFactory {
  createCustomFile(name: 'file', size: number): CustomFile { // OK
    return new ImageCustomFile(name, size, 100, 100)
  }
}

class ImageCustomFileFactory3 extends CustomFileFactory {
  createCustomFile(name: number, size: number): CustomFile { // Error!
    return new ImageCustomFile(name, size, 100, 100)
  }
}

class ImageCustomFileFactory4 extends CustomFileFactory {
  createCustomFile(name: string, size: number): {} { // Error!
    return new ImageCustomFile(name, size, 100, 100)
  }
}
```

## Далее →
