---
title: "Перемещение по истории"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 8fcf122d-41be-4fa1-be02-4f413a0328a3
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Перемещение по истории

Git умеет не только показывать историю — можно «перейти» к состоянию кода на момент любого коммита и загрузить его в рабочую директорию. В уроке — перемещение по истории через `git checkout`.

Сначала `git log`:

```
# Показывает сокращенный вывод
git log --oneline

fc74e2d update README.md
65a8ef7 Revert "remove PEOPLE.md"
5120bea add new content
e6f625c add INFO.md
273f81c remove NEW.md
aa600a4 remove PEOPLE.md
fe9893b add NEW.md
3ce3c02 add PEOPLE.md
3c5d976 add README.md
```

Переключимся на коммит *add INFO.md* — `git checkout <хеш коммита>`:

```
git checkout e6f625c

Note: switching to 'e6f625c'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

Or undo this operation with:

  git switch -
```

Выполните команду и посмотрите рабочую директорию. Ваш хеш может отличаться. Часть изменений исчезнет — вы «в прошлом». Сами коммиты на месте; вернуться на последний:

```
# Позже мы поговорим, что такое main
git checkout main
```

В нужном коммите можно не только смотреть файлы, но и забрать удалённые правки: скопировать, вернуться на последний коммит и вставить куда нужно.

## Команда `git branch`

Переключение меняет только рабочую директорию — отдельно не видно, где вы в истории. Многие забывают и удивляются, когда коммит не получается.

Проверить место — `git branch`. На последнем коммите обычно так:

```
git branch

# Позже мы поговорим, что такое main
* main
```

Если загружен старый коммит:

```
* (HEAD detached at e6f625c)
  main
```

Такую проверку легко забыть. Надёжнее выводить текущую позицию прямо в приглашении командной строки:

```
# Если на последнем коммите
my-git git:(main)

# Если на коммите из прошлого
my-git git:(e6f625c)
```

Так делают многие профессионалы. Как настроить — зависит от оболочки:

[Terminal session recording](https://asciinema.org/a/5TrDddrSCdL0L7Ny5Ad21R5VA/iframe?cols=130&rows=25)

В Bash подсказка часто строится через переменную `$PS1` — подробнее в дополнительных материалах.

---

### Самостоятельная работа

1. Выполните все команды из урока

1. Настройте вывод текущего места в вашем терминале

---

### Дополнительные материалы

1. [Bash Prompt HOWTO — управление PS1](https://tldp.org/HOWTO/Bash-Prompt-HOWTO/)

1. [Именование коммитов (Conventional Commits)](https://www.conventionalcommits.org/ru/v1.0.0/)

## Далее →
