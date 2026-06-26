---
title: "Реализация интерфейсов классами"
module: "Модуль 6"
topic: "Продвинутый Typescript"
buildin_id: 345b2431-7647-44c2-b1f2-dbef5b913b34
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Реализация интерфейсов классами

Классы реализуют интерфейсы через `implements` — по смыслу это продолжение темы расширения интерфейсов друг другом:

```typescript
interface IBeep {
  sayBeep: () => string
}

interface IBoop {
  sayBoop: () => string
}

class Robo implements IBeep, IBoop {
  sayBeep = () => 'beep'

  sayBoop = () => 'boop'
}

const R2D2 = new Robo()
R2D2.sayBeep() // 'beep'
```

Здесь реализовали два интерфейса с помощью класса, который унаследовал все методы данных интерфейсов. Унаследованные методы нам пришлось прописать вручную.

Мы можем создавать классы на основе интерфейсов так же, как мы создаем интерфейсы на основе интерфейсов. Но есть и отличия.

Интерфейсы и типы исчезают при компиляции; классы остаются в JavaScript как функции-конструкторы.

Выходит, что вариант с интерфейсами более легковесный, но все же выбор должен зависеть от нашей решаемой задачи.

`implements` не подставляет реализацию — компилятор только сверяет форму класса с интерфейсом. Пример:

```typescript
interface ICalculate {
  sum: (num1: number, num2: number) => number
}

class Summator implements ICalculate {
  sum(num1, num2) { return num1 + num2 }
  // Для параметров будет выведено сообщение: Parameter 'num1'/'num2' implicitly has an 'any' type
  // Так происходит, потому что TypeScript только проверяет класс на соответствие интерфейсу

  multiply(num1: number, num2: number) { return num1 * num2 }
  // Мы добавили новый метод, но TypeScript не ругается
}

const calculator = new Summator()
// Наш код сработает, как если бы он сработал для аргументов с типом any, потому что
// типы параметров и все остальное не были унаследованы классом при реализации интерфейса
calculator.sum(2, 3) // 5
```

Ошибка в реализации интерфейса классом возможна только тогда, когда мы не реализуем одно из свойств, указанных в интерфейсе. Или мы реализуем его не так, как указано в интерфейсе:

```typescript
interface ICalculate {
  sum: (num1: number, num2: number) => number
}

class Summator implements ICalculate {
  sum(num1: string, num2: string) { return num1 + num2 };
  // Мы изменили типы аргументов на string, то есть неверно реализовали интерфейс
  // В таком случае TypeScript обратит внимание на нашу ошибку и не скомпилируется
  // Type '(num1: string, num2: string) => string' is not assignable to type '(num1: number, num2: number) => number'
}
```

По этой же причине, если мы пишем класс, реализующий интерфейс с опциональными свойствами, нам нужно прописывать все самостоятельно. В противном случае эти свойства не попадут в наш класс:

```typescript
interface ICalculate {
  sum: (num1: number, num2: number) => number
  multiply?: (num1: number, num2: number) => number
}

class Summator implements ICalculate {
  sum(num1: number, num2: number) { return num1 + num2 }
}

const calculator = new Summator()
calculator.sum(2, 3) // 5
calculator.multiply(2, 3) // Property 'multiply' does not exist on type 'Summator'.
```

В примере выше мы указали только метод `sum` при реализации интерфейса классом `Summator`. В итоге код успешно скомпилировался, ведь метод `multiply` был указан как опциональный. В то же время в экземпляре нашего класса мы не можем обратиться к этому методу.

Поскольку в TypeScript для одних и тех же вещей существует несколько разных инструментов, мы можем реализовывать классы с помощью расширения абстрактных классов вместо интерфейсов. Но выбор будет зависеть от задачи. Абстрактные классы предоставляют нам модификаторы доступа и конструкторы, в то время как интерфейсы более легковесны и просты.

## Далее →
