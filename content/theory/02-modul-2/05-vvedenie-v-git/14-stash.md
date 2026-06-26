---
title: "Stash"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 849073a3-88a6-4388-95b5-ee76c87a34b1
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Stash

Вы правите много файлов по важной задаче — и вдруг срочная правка в другом месте, не связанная с текущей работой. Ваши изменения ещё не готовы и не должны попасть в репозиторий. Что делать? В уроке — команда для таких случаев.

Если правки не пересекаются, можно сделать срочное изменение, добавить в индекс, закоммитить и запушить. Но это не всегда удобно. А если срочная задача затрагивает те же файлы?

Так бывает часто. Решение есть: в Git можно **спрятать** изменения в рабочей директории и вернуть позже. Попробуем:

```
touch FILE.md
git add FILE.md
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   FILE.md

# Прячем файлы
# После этой команды пропадут все измененные файлы
# независимо от того, добавлены они в индекс или нет
git stash

Saved working directory and index state WIP on main: e7bb5e5 update README.md

git status

On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

`git stash` не удаляет файлы — складывает их во временное хранилище внутри *.git*. Новые неотслеживаемые файлы не трогает, они ещё не часть репозитория:

<!-- IMG (из Buildin, перезалить отдельно) -->
Когда срочные правки сделаны, верните спрятанное — `git stash pop`:

```
# Восстанавливаем
git stash pop

On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   FILE.md

Dropped refs/stash@{0} (b896d4a0126ef4409ede63857e5d996953fe75c5)

# Проверяем
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   FILE.md
```

Файлы вернулись в том виде, в каком попали в **стэш** (*stash*).

Стэш работает как [стек](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B5%D0%BA): можно сохранить несколько снимков и достать в обратном порядке:

```
git stash

# Изменяем файлы
git stash

# Возвращаем последние изменения
git stash pop

# Возвращаем предпоследние изменения
git stash pop
```

## Дополнительные материалы

- [Припрятывание (Stash) и очистка](https://git-scm.com/book/ru/v2/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B-Git-%D0%9F%D1%80%D0%B8%D0%BF%D1%80%D1%8F%D1%82%D1%8B%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B8-%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0)

- [Псевдонимы (алиасы) команд в Git](https://git-scm.com/book/ru/v2/%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D1%8B-Git-%D0%9F%D1%81%D0%B5%D0%B2%D0%B4%D0%BE%D0%BD%D0%B8%D0%BC%D1%8B-%D0%B2-Git)

## Далее →
