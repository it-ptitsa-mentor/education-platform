---
title: "Введение в хуки"
module: "Модуль 5"
topic: "JS: React"
buildin_id: 4074fe69-b83f-4f39-a45b-4105f6708562
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Введение в хуки

<!-- IMG (из Buildin, перезалить отдельно) -->
Хуки позволяют писать React без классов. Новой модели они не добавляют, зато упрощают переиспользование общей логики. Сейчас это основной стиль приложений. Классы никуда не делись: команда React не планирует их убирать, и часть задач без классов не решается. Пример `useState`:

```javascript
// useState — встроенный в React хук
// Подробнее рассматривается в следующем уроке
import React, { useState } from 'react'

const Example = () => {
  // Пример хука для работы с состоянием
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>
        Вы нажали
        {count}
        {' '}
        раз(а)
      </p>
      <button onClick={() => setCount(count + 1)}>
        Нажми меня
      </button>
    </div>
  )
}
```

Пример можно открыть в CodePen с подключённым React.

Хуки — функции с префиксом *use*. В React около десяти встроенных; в повседневной работе — несколько: состояние, побочные эффекты (жизненный цикл), контекст, доступ к DOM. Остальные — в документации.

В npm и на GitHub — сотни готовых хуков; [react-use](https://github.com/streamich/react-use) насчитывает больше 115. Часто разработка сводится к поиску подходящего хука — это освобождает время для бизнес-логики.

## Дополнительные материалы

- [Плагин eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation)

## **Далее → **
