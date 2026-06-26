---
title: "Модульные тесты"
module: "Модуль 3"
topic: "JS: Автоматическое тестирование"
buildin_id: b99f80ee-dfd0-485b-a8e7-fb8b2c0eb2a8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Модульные тесты

Изученного уже хватает для повседневной практики. Перед более сложными возможностями Jest пройдём полный цикл тестирования небольшой библиотеки — про организацию, хорошие и плохие приёмы.

Здесь — основы **модульного** тестирования: проверка частей программы в изоляции (функции, модули, классы). Такие тесты не гарантируют работу всего приложения, но помогают, когда в модуле сложная логика.

Протестируем [стек](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B5%D0%BA) (LIFO: последним пришёл — первым вышел):

```
import makeStack from '../src/stack.js'

const stack = makeStack()
stack.isEmpty() // true
stack.push(1) // (1)
stack.push(2) // (1, 2)
stack.push(3) // (1, 2, 3)
stack.isEmpty() // false
stack.pop() // 3. В стеке (1, 2)
stack.pop() // 2. В стеке (1)
stack.pop() // 1. В стеке пусто
stack.isEmpty() // true
```

Реализация в *src/stack.js* → тест в *__tests__/stack.test.js*.

## Тестируем основную функциональность

Первый тест — позитивный сценарий с основной функциональностью:

```
import makeStack from '../src/stack.js'

test('stack\'s main flow', () => {
  const stack = makeStack()
  // Добавляем два элемента в стек и затем извлекаем их
  stack.push('one')
  stack.push('two')
  expect(stack.pop()).toEqual('two')
  expect(stack.pop()).toEqual('one')
})
```

Проверяются `push` и `pop` без пограничных случаев — два матчера подряд.

В сети встречается мнение: «одна проверка — один тест». Тогда код раздувается и дублируется:

```
test('stack\'s main flow', () => {
  const stack = makeStack()
  stack.push('one')
  stack.push('two')
  expect(stack.pop()).toEqual('two')
})

test('stack\'s main flow', () => {
  const stack = makeStack()
  stack.push('one')
  stack.push('two')
  stack.pop()
  expect(stack.pop()).toEqual('one')
})
```

Выгода сомнительна. В отдельный тест выносят **другой сценарий** — другие данные и другая последовательность действий.

## Тестируем дополнительную функциональность

Дополнительно — `isEmpty()`:

```
test('isEmpty', () => {
  const stack = makeStack()
  expect(stack.isEmpty()).toBe(true)
  stack.push('two')
  expect(stack.isEmpty()).toBe(false)
  stack.pop()
  expect(stack.isEmpty()).toBe(true)
})
```

Три ситуации: пустой стек, после push, после извлечения всего. Этого обычно достаточно — гнаться за всеми комбинациями не нужно. Сомневаетесь, писать ли ещё проверку — лучше пропустить и нащупать свой минимум.

### Пограничные случаи

`pop()` на пустом стеке должен бросать исключение:

```
test('pop in empty stack', () => {
  const stack = makeStack()
  // Вызов метода pop обернут в функцию
  // Иначе матчер не сможет перехватить исключение
  expect(() => stack.pop()).toThrow()
})
```

Не все границы видны сразу. Нашли баг без теста — сначала тест, воспроизводящий ошибку, потом исправление. Иначе надёжность не растёт.

---

### Дополнительные материалы

1. [Jest: Getting Started](https://jestjs.io/docs/getting-started)

## Далее →
