---
title: "Перечисления"
module: "Модуль 6"
topic: "Основы Typescript"
buildin_id: 4ddc27fc-d99e-46e1-bd47-2faa431025d6
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Перечисления

Разберём `enum` — именованный набор констант для обращения по имени.

## Использование перечислений

Перечисления используют вместо строк для постоянных значений:

```javascript
enum OrderStatus {
  Created,
  Paid,
  Shipped,
  Delivered,
}

const order = {
  items: 3,
  status: OrderStatus.Created,
}
```

Самый распространенный пример использования перечислений — хранение разных статусов. Но есть и другие случаи. Например, с их помощью легко и удобно хранить и обращаться к различным справочным данным:

- Направления движения

- Стороны света

- Дни недели

- Месяцы

```javascript
enum CardinalDirection {
  North,
  South,
  East,
  West,
}

const direction = CardinalDirection.North
```

Перечисление — это и значение, и тип. Его можно указывать как тип в параметрах функции:

```javascript
setStatus(status: OrderStatus)
```

Также перечисления после компиляции превращаются в JavaScript-объект, в котором каждому значению соответствует свойство. У этого свойства есть тип `number` и начинается он с `0`:

```javascript
const status = OrderStatus.Created
console.log(status) // 0
```

Это позволяет удобно использовать стандартные методы — например, `Object.keys` и `Object.values`:

```javascript
const statuses = Object.keys(OrderStatus)
console.log(statuses) // ['0', '1', '2', '3', 'Created', 'Paid', 'Shipped', 'Delivered']
```

Среди ключей мы видим числа `'0', '1', '2', '3'`. Компилятор создает такие числовые ключи автоматически, а созданный объект выглядит так:

```javascript
console.log(OrderStatus) // =>
// {
//   '0': 'Created',
//   '1': 'Paid',
//   '2': 'Shipped',
//   '3': 'Delivered',
//   'Created': 0,
//   'Paid': 1,
//   'Shipped': 2,
//   'Delivered': 3
// }
```

Но можно избавиться от создания дополнительных ключей, если указать строковые значения:

```javascript
enum OrderStatus {
  Created = '0',
  Paid = '1',
  Shipped = '2',
  Delivered = '3',
}

const statuses = Object.keys(OrderStatus)
console.log(statuses) // ['Created', 'Paid', 'Shipped', 'Delivered']

console.log(OrderStatus) // =>
//   'Created': '0',
//   'Paid': '1',
//   'Shipped': '2',
//   'Delivered': '3'
// }
```

## Зачем нужны перечисления

Использование enum позволяет коду быть более читаемым и поддерживаемым, так как вместо магических чисел или строк используются ясные и понятные имена. Кроме того это позволяет избежать некоторых ошибок. Разберём на примере.

Возьмем ситуацию, когда нам нужно описать разные уровни доступа пользователя в системе.

Без использования enum это могло бы выглядеть так:

```javascript
if (user.accessLevel === 'admin') {
  // делаем что-то важное
}
```

С использованием enum код становится более структурированным и понятным:

```javascript
enum AccessLevel {
  Admin,
  Editor,
  User,
}

const user = { name: 'Kirill Mokevnin', accessLevel: AccessLevel.Admin }

if (user.accessLevel === AccessLevel.Admin) {
  // действия администратора
}
```

В этом примере AccessLevel является enum, который определяет три возможных уровня доступа. При использовании значения enum TypeScript обеспечивает автодополнение и проверку типов, что делает код более безопасным и удобным для разработки.

## Выводы

В этом разделе мы узнали, как и зачем используется перечисление. Также мы разобрали, что его можно указывать как тип в параметрах функции.

## **Далее → **
