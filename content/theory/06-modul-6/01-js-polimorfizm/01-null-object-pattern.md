---
title: "Null Object Pattern"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: 0059f15b-7126-4245-8153-ff57d3a2ed79
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Null Object Pattern

На сайтах с аутентификацией почти всегда есть понятие «текущий пользователь» — тот, кто вошёл через форму или соцсеть. Его данные нужны для разных блоков интерфейса, например чтобы показать блог пользователя. Типичный фрагмент шаблона выглядит так:

```
// где-то в воображаемом шаблоне articles/index.html.slim

if isAuthenticated && currentUser.hasArticles()
  each article in currentUser.getArticles()
    // тут выводим статьи
```

Обратите внимание на проверку входа. Без неё вызов `hasArticles()` у `null` (когда пользователь не залогинен) приведёт к ошибке. Одна-две такие проверки терпимы, но при десятках мест код засоряется, а нужную проверку легко забыть.

Есть другой путь — полиморфизм подтипов. Создаём класс для неаутентифицированного пользователя, например *Guest*, и добавляем в него методы, для которых нужно разное поведение:

```
class Guest {
  hasArticles() {
    return false
  }

  getArticles() {
    return []
  }
}
```

Большинство методов возвращают `false` или пустые коллекции — у гостя просто нет данных. Зачем тогда класс? Клиентский код всегда работает с объектом пользователя и больше не проверяет факт входа:

```
if currentUser.hasArticles()
  each article in currentUser.getArticles()
    // тут выводим статьи
```

Условия по шаблонам исчезают. Остаётся вопрос: где и как создаётся пользователь? Здесь останется единственный `if`, который выберет нужный тип. Обычно это делают при обработке запроса; точное место зависит от фреймворка:

```
const fetchCurrentUser = (req) => {
  const userId = req.session.userId
  // Если id есть в сессии, то выбираем пользователя из базы, иначе возвращаем гостя
  return userId ? User.find(userId) : new Guest()
}
```

Такой приём называется шаблоном проектирования null object. Его часто встречают во фреймворках и в прикладном коде. В реальном `Guest` может быть десятки методов. Фрагмент (не полный список):

```
# Код на руби, но он прост как две копейки
class Guest
  def id
    nil
  end

  def avatar
    nil
  end

  def github_account
    false
  end

  def has_passed_at_least_one_project?
    false
  end

  def city
    ''
  end

  def seeking_job?
    true
  end

  def mentor?
    false
  end

  def locale?
    nil
  end

  def guest?
    true
  end

  def current_subscription_object
    FreeSubscription.new(self)
  end

  def type
    'guest'
  end

  def topics_count
    0
  end
end
```

## Далее →
