---
title: "Логические операторы"
module: "Модуль 2"
topic: "Основы JavaScript"
buildin_id: 68d7ae00-bc54-4978-83d4-72ab7b1d046d
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Логические операторы

Условия можно объединять. Пример — длина пароля от 8 до 20 символов. В JS не пишут `8 <= x <= 20`; нужны два сравнения, связанные **И** (`&&`):

```
Пароль не менее 8 символов **И** пароль не более 20 символов.
```

Вот функция, которая принимает пароль и говорит, соответствует ли он условиям, или не соответствует:

```
const isStrongPassword = (password) => {
  const length = password.length
  return length >= 8 && length <= 20
}

isStrongPassword('qwerty') // false
isStrongPassword('qwerty1234') // true
isStrongPassword('zxcvbnmasdfghjkqwertyui') // false
```

`&&` — логическое **И** (конъюнкция): true только если оба операнда true.

Приоритет этого оператора ниже, чем приоритет операторов сравнения, поэтому выражение отрабатывает правильно без скобок.

`||` — **ИЛИ** (дизъюнкция): достаточно одного true. При смешении `&&` и `||` используйте скобки. Усложнённая проверка пароля:

```
const hasSpecialChars = (str) => /* проверяет содержание специальных символов в строке */;

const hasCapitalChars = (str) => /* проверяет содержание заглавных букв в строке */;

const isStrongPassword = (password) => {
  const length = password.length;
  // Скобки задают приоритет. Понятно что к чему относится.
  return length > 8 && (hasSpecialChars(password) || hasCapitalChars(password));
};
```

Другой пример. Мы хотим купить квартиру, которая удовлетворяет условиям: площадь от 100 кв. метров и больше на любой улице **ИЛИ** площадь от 80 кв. метров и больше, но на центральной улице `Main Street`.

Напишем функцию, проверяющую квартиру. Она принимает два аргумента: площадь (число) и название улицы (строку):

```
const isGoodApartment = (area, street) => {
  // Через переменную, чтобы функция была не слишком длинной
  const result = area >= 100 || (area >= 80 && street === 'Main Street')
  return result
}

isGoodApartment(91, 'Queens Street') // false
isGoodApartment(78, 'Queens Street') // false
isGoodApartment(70, 'Main Street') // false

isGoodApartment(120, 'Queens Street') // true
isGoodApartment(120, 'Main Street') // true
isGoodApartment(80, 'Main Street') // true
```

Таблицы истинности для `&&` и `||` (картинки в оригинале — см. IMG):

## И `&&`

|  |
|  |
|  |
|  |
|  |
|  |

<!-- IMG (из Buildin, перезалить отдельно) -->
Пара примеров:

```
// true && true;
3 > 2 && 'wow'.startsWith('w') // true

// true && false;
'start' === 'start' && 8 < 3 // false
```

## ИЛИ `||`

|  |
|  |
|  |
|  |
|  |
|  |

<!-- IMG (из Buildin, перезалить отдельно) -->
Пара примеров:

```
// false || true;
3 < 2 || 'wow'.startsWith('w') // true

// false || false;
'start' === 'Start' || 3 < 3 // false
```

## Отрицание

Унарный `!` **инвертирует** boolean.

Если есть функция, проверяющая четность числа, то с помощью отрицания можно выполнить проверку нечетности:

```
const isEven = number => number % 2 === 0

isEven(10) // true
!isEven(10) // false
```

То есть мы просто добавили `!` слева от вызова функции и получили обратное действие.

Отрицание — мощный инструмент, который позволяет лаконично выражать задуманные правила в коде без необходимости писать новые функции.

А что если написать так `!!isEven(10)`? Внезапно, но код сработает. В логике двойное отрицание подобно отсутствию отрицания вообще.

```
isEven(10) // true
!isEven(10) // false
!!isEven(10) // true
```

---

### Дополнительные материалы

1. [Булева алгебра](https://ru.wikipedia.org/wiki/%D0%91%D1%83%D0%BB%D0%B5%D0%B2%D0%B0_%D0%B0%D0%BB%D0%B3%D0%B5%D0%B1%D1%80%D0%B0)

1. [Конъюнкция](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D1%8A%D1%8E%D0%BD%D0%BA%D1%86%D0%B8%D1%8F)

1. [Дизъюнкция](https://ru.wikipedia.org/wiki/%D0%94%D0%B8%D0%B7%D1%8A%D1%8E%D0%BD%D0%BA%D1%86%D0%B8%D1%8F)

1. [Законы Де Моргана](https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BA%D0%BE%D0%BD%D1%8B_%D0%B4%D0%B5_%D0%9C%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B0)

## Далее →
