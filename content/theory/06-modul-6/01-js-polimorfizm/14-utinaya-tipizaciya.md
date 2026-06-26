---
title: "Утиная типизация"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: ef156e1c-1909-4348-a59e-280c82b6a9a5
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Утиная типизация

Начнём с задачи. Нужна функция: есть ли комментарии у статьи или топика. Статья — класс *Article*, топик — *Topic*.

```
const hasComments = (commentable) => {
  // Если это статья
  if (commentable instanceof Article) {
    return commentable.getArticleComments().length > 0
  // Если это топик
  }
  else if (commentable instanceof Topic) {
    return commentable.getTopicComments().length > 0
  }
}

class Article {
  // some code

  getArticleComments() {
    return this.comments
  }
}

class Topic {
  // some code

  getTopicsComments() {
    return this.comments
  }
}

// Article.first() — метод, который возвращает первую статью из базы данных
const article = Article.first()
console.log(hasComments(article))
```

Каждый новый тип — ещё ветка в `if`. Диспетчеризация по ключу мало что меняет: поведение дублируется с классами. Проще согласовать интерфейс: везде `getComments()`:

```
const hasComments = commentable => commentable.getComments().length > 0

const article = Article.first()
console.log(hasComments(article))

const topic = Topic.first()
console.log(hasComments(topic))
```

`hasComments` принимает любой объект с `getComments()` нужной сигнатуры. Новый класс с тем же методом не ломает функцию.

Одинаковая обработка разных типов — полиморфизм подтипов; такая функция — полиморфная.

*В JavaScript для этого не нужны наследование и интерфейсы. Это «утиная типизация»: ходит и крякает как утка — значит утка.*

Для клиента полиморфизм подтипов убирает `if`. Любой `if` можно заменить полиморфизмом и наоборот — он не обязателен, но иногда сильно упрощает код.

Чем параметрический полиморфизм отличается от подтипов? Параметрический — общий алгоритм для контейнера с элементами типа *T*, не зависящий от *T*. Подтипы — алгоритм опирается на методы объекта; полиморфная функция работает только с объектами, у которых эти методы есть.

## Далее →
