---
title: "Дженерики на классах"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 744f69ce-6f56-4c7b-93f9-98a28617100b
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Дженерики на классах

Как и у функций, у классов бывают параметры типа: один `Triple<T, U, V>` вместо отдельного класса на каждую комбинацию типов.

```typescript
class Triple<T, U, V> {
  constructor(protected first: T, protected second: U, protected third: V) {}

  getFirst(): T {
    return this.first
  }

  getSecond(): U {
    return this.second
  }

  getThird(): V {
    return this.third
  }
}
```

В этом примере класс `Triple` — дженерик-класс, в который мы можем поместить любые типы данных. При этом у нас остаются гарантии безопасности и вывод типов, которые мы получили при использовании обобщенных функций:

```typescript
const triple = new Triple(1, 'string', null)
const first = triple.getFirst() // number
const second = triple.getSecond() // string
```

Также можно наследоваться от обобщенных классов. Например, класс `Pair` может быть наследником класса `Triple`, который хранит два значения любого типа:

```typescript
class Pair<T, U> extends Triple<T, U, never> {
  constructor(first: T, second: U) {
    super(first, second, undefined as never)
  }

  getFirst(): T {
    return this.first
  }

  getSecond(): U {
    return this.second
  }
}
```

Здесь использовали приведение к типу `never`, чтобы пометить третий параметр как отсутствующий.

Как и обычные классы, обобщенные классы также можно использовать в качестве типов параметров функций:

```typescript
function swap<T, U>(pair: Pair<T, U>): Pair<U, T> {
  return new Pair(pair.getSecond(), pair.getFirst())
}
```

Дженерик-классы полезны, когда нам нужно создать какой-нибудь контейнер для хранения данных, как в примере с классом `Pair`. `Array`, `Map`, `Set` — это дженерик-классы, которые хранят элементы заданного типа.

## Далее →
