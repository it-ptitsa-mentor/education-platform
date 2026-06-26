---
title: "Теория: Статические свойства и методы"
module: "Модуль 3"
topic: "JS: Введение в ООП"
buildin_id: ee8441b7-7beb-49ac-922b-afcd2afaaac4
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Теория: Статические свойства и методы

Вспомним конструктор денег (Money):

```
const money1 = new Money(100)
money1.getValue() // 100
money1.format() // "$100"
// Не меняет сам money1
money1.exchangeTo('eur').getValue() // 70

const money2 = new Money(200, 'eur')
const money3 = money2.add(money1) // 270
```

Сумма и валюта — данные экземпляра. Курсы обмена — общие для всех денег, не для одного объекта. Плохой вариант — копировать ставки в каждый экземпляр:

```
class Money {
  constructor() {
    this.rates = {
      usd: {
        eur: 0.7,
      },
      eur: {
        usd: 1.2,
      },
    }
  }
}
```

Технически работает, логически неверно: при смене курсов пришлось бы пересоздавать все объекты или перезапускать программу.

Решение — хранить общие данные на функции-конструкторе. Свойство на конструкторе доступно всем экземплярам:

```
// Не важно как определен сам Money. Это может быть обычная функция-конструктор или класс.
// Так или иначе любой класс внутри JS — это функция конструктор + прототип, наполненный функциями

Money.rates = {
  usd: {
    eur: 0.7,
  },
  eur: {
    usd: 1.2,
  },
}
```

Доступ к свойству конструктора: напрямую `Money.rates` или через `this.constructor` из методов экземпляра (второй способ предпочтительнее внутри объекта):

```
class Money {
  constructor(value, currency = 'usd') {
    this.value = value
    this.currency = currency
  }

  exchangeTo(newCurrency) {
    if (this.currency === newCurrency) {
      return new Money(this.value, this.currency)
    }
    // this.constructor.rates находится в функции-конструкторе
    const newValue = this.value * this.constructor.rates[this.currency][newCurrency]
    return new Money(newValue, newCurrency)
  };

  // Другие методы
}
```

Объект отвечает за свои данные, конструктор — за общие параметры. Курсы можно менять сразу для всех:

```
Money.rates.usd.eur = 0.71
```

Или через метод на конструкторе:

```
Money.setRate = function setRate(from, to, value) {
  // Здесь уже обращаемся напрямую, потому что мы находимся в контексте объекта Money (она же функция-конструктор)
  this.rates[from][to] = value
}

Money.setRate('usd', 'gbp', 0.6)
```

Осторожно: всё на конструкторе — по сути глобальное состояние; изменение затрагивает все экземпляры. В асинхронном коде это легко даёт рассинхрон.

## Статика

То же выражается статическими полями и методами класса:

```
class Money {
  // Определение статического свойства
  static rates = {
    usd: {
      eur: 0.7,
    },
    eur: {
      usd: 1.2,
    },
  }

  // Определение статического метода
  static setRate(from, to, value) {
    this.rates[from][to] = value
  }
}

// Использование ровно такое же как и в примерах выше
Money.rates.usd.eur // 0.7
Money.setRate('usd', 'eur', 0.8)
Money.rates.usd.eur // 0.8
```

Из экземпляра к статике — через `this.constructor`, как к свойствам конструктора:

```
class Money {
  // Определение статического свойства
  static rates = {
    usd: {
      eur: 0.7,
    },
    eur: {
      usd: 1.2,
    },
  }

  // Определение статического метода
  static setRate(from, to, value) {
    this.rates[from][to] = value
  }

  constructor(value, currency = 'usd') {
    this.value = value
    this.currency = currency
  }

  exchangeTo(newCurrency) {
    if (this.currency === newCurrency) {
      return new Money(this.value, this.currency)
    }
    // this.constructor.rates находится в функции-конструкторе
    const newValue = this.value * this.constructor.rates[this.currency][newCurrency]
    return new Money(newValue, newCurrency)
  };

  getValue() {
    return this.value
  }
}

const money1 = new Money(100)
console.log(money1.getValue()) // => 100
// Не меняет сам money1
console.log(money1.exchangeTo('eur').getValue()) // 70
console.log(money1.getValue()) // => 100
```

Статика и классы — синтаксический сахар над функциями и прототипами, но код от этого читается проще.

## Итог

Статические свойства хранят данные уровня класса, а не экземпляра. Объявляются через `static` или живут на конструкторе.

Пример: класс «Квадрат» с длиной стороны по умолчанию — статическое свойство для значения по умолчанию. Статический метод может считать площадь по общей формуле.

Используйте статику, когда данные или методы относятся ко всему классу — меньше дублирования в экземплярах.

В идеале статику инициализируют при старте и не меняют: по сути это глобальные переменные; частые изменения усложняют поддержку.

## Дополнительные материалы

- [Статические свойства / MDN](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/Class_fields#%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%BB%D1%8F)

- [Статические методы / MDN](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/static)

- [Статические методы и `new` / MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static#calling_static_members_from_within_the_class)

## Далее →
