---
title: "Клонирование и копирование"
module: "Модуль 2"
topic: "JS: Объекты"
buildin_id: 4867b0dd-fa23-458e-afd1-64465c881d83
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Клонирование и копирование

Клонирование объектов часто встречается в разработке, особенно на фронтенде: создаётся новый объект с тем же набором данных, что и у исходного.

В JavaScript поверхностное клонирование можно сделать через `Object.assign()` — первым аргументом пустой объект, вторым — копируемый:

```
const user = { name: 'Tirion', email: 'support@email.io', age: 44 }

// Данные из user копируются во вновь созданный объект
const copyOfUser = Object.assign({}, user)

user === copyOfUser // false
```

Получаются два разных объекта с одинаковым содержимым; изменения в одном не затрагивают другой.

То же по смыслу делает [clone()](https://lodash.com/docs#clone) из *lodash* — результат тот же, но имя функции яснее выражает намерение:

```
import _ from 'lodash'

const user = { name: 'Tirion', email: 'support@email.io', age: 44 }
const copyOfUser = _.clone(user)
```

Описанные способы не копируют вложенные объекты глубоко — они попадают в копию по той же ссылке:

```
const user = { company: { name: 'Pivozavr' } }
const copyOfUser = Object.assign({}, user)
// Это тот же объект
user.company === copyOfUser.company // true

user.company.createdAt = 2012
console.log(copyOfUser.company.createdAt) // 2012
```

Такое копирование называют **поверхностным** (*shallow copying*). В JavaScript под словом «клонирование» чаще всего имеют в виду именно его. Для многих задач хватает; иногда нужно **полное** или **глубокое** клонирование (*deep copying*).

В языке есть встроенный `structuredClone()` для глубокого копирования:

```
const user = { company: { name: 'Pivozavr' } }
const copyOfUser = structuredClone(user)

user.company === copyOfUser.company // false
```

В *lodash* есть [cloneDeep()](https://lodash.com/docs/4.17.21#cloneDeep) — популярное решение до появления `structuredClone()`.

Минус глубокого клонирования: на больших и сложных структурах оно дорого по производительности — одна из причин, почему по умолчанию копируют поверхностно.

---

### Дополнительные материалы

1. [structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

## Далее →
