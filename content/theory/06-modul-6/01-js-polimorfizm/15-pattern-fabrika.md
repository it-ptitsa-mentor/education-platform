---
title: "Паттерн Фабрика"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: fc0fcfa7-f154-444c-8a62-3211cdcafd82
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Паттерн Фабрика

Полиморфизм подтипов не убирает все `if` (кроме диспетчеризации по ключу или имени файла). Обычно остаётся одна ветка выбора реализации, дальше — полиморфный вызов. Пример — выбор стратегии страховки по возрасту:

```
const chooseCostInsuranceStrategy = (user) => {
  if (user.getAge() < 18) {
    return new LessThan18();
  } else if (/* ... */) {
    // some code
  }
}
```

Функция, которая подбирает класс, создаёт объект и отдаёт наружу, — фабрика (точнее фабричный метод). Имя громкое, суть простая. Реализовать можно любым способом из курса.

В широком смысле «фабрикой» называют всё, что создаёт объект или коллекцию — иногда один класс, но с предварительными шагами. В продакшене фабрики бывают [объёмными](https://github.com/typeorm/typeorm/blob/a4dec02cc59d3219a29c7be0322af2253e1452dc/src/repository/RepositoryFactory.ts).

Часто это класс со статическим `factory`. Сами фабрики редко делают экземплярами — это не сущность данных, подменять их незачем.

```
export default class {
  static factory(/* параметры */) {
    // код фабрики
  }
}
```

## Диспетчеризация класса

В JavaScript объект создают по ссылке на класс:

```
const className = Application
const app = new className()
```

Отсюда диспетчеризация без `if`:

```
import ManagerPolicy from './policies/ManagerPolicy.js'
import WorkerPolicy from './policies/WorkerPolicy.js'

// Policy — обычно это имя используют для авторизации, то есть системы проверки прав доступа
const mapping = {
  manager: ManagerPolicy,
  worker: WorkerPolicy,
}

const getUserPolicy = (user) => {
  const className = mapping[user.getType()]
  return new className()
}
```

## Далее →
