---
title: "Анализ сделанных изменений"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 2080a6a2-abfd-4037-920f-2fe0550c5d55
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Анализ сделанных изменений

<!-- IMG (из Buildin, перезалить отдельно) -->
В разработке часто нужно остановиться и посмотреть, что изменилось с последнего коммита.

На реальном проекте — тысячи строк, сотни файлов, часы работы над одной задачей. Даже за несколько часов трудно вспомнить, что уже поменяли и что ещё предстоит. Помогает анализ diff — об этом урок.

## Как анализировать изменения

Смотреть diff полезно и в маленьких репозиториях. При подготовке этого курса изменилось несколько файлов, и `git status` выглядит так:

```
git status

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
    modified:   300-working-directory/README.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:   100-intro/README.md
    modified:   250-github/README.md
    modified:   300-working-directory/README.md
    modified:   300-working-directory/spec.yml
    modified:   350-changes/README.md
```

Воспроизведём похожую ситуацию в *my-git*:

```
echo 'new line' >> INFO.md
echo 'Hello, Git! How are you?' > README.md

git status

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:   INFO.md
    modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

Изменились оба файла: в один добавили строку, в другом заменили содержимое. Как увидеть разницу?

Для этого есть `git diff`:

```
git diff

diff --git a/INFO.md b/INFO.md
index d5225f8..40f51f1 100644
--- a/INFO.md
+++ b/INFO.md
@@ -1 +1,2 @@

 git is awesome!
+new line

diff --git a/README.md b/README.md
index ffe7ece..00fd294 100644
--- a/README.md
+++ b/README.md
@@ -1 +1 @@

-Hello, Git!
+Hello, Git! How are you?
```

Вывод поначалу кажется перегруженным: служебные строки, затем сами изменения.

`git diff` показывает не файлы целиком, а изменённые строки — иногда и соседние для контекста.

Слева от строк:

- `-` — строка удалена

- `+` — строка добавлена

Команда запускает [пейджер](https://buildin.ai/d46998e5-d14e-4683-b8cc-3903d0e9c704) — программу для просмотра длинного вывода. Клавиши:

- `f` — вниз

- `b` или `u` — вверх

- `q` — выход

По умолчанию `git diff` показывает только изменения в файлах, которые ещё не в индексе. Файлы в индексе считаются уже подготовленными к коммиту — но перед коммитом их всё равно стоит перепроверить:

```
# Выведет все изменения, сделанные в рабочей директории
# которые были добавлены в индекс
git diff --staged
```

`git diff` имеет смысл запускать перед каждым коммитом: так проще заметить лишнее, которое случайно попало в индекс.

---

### Самостоятельная работа

1. Выполните все шаги из урока

1. Сделайте коммит с сообщением *add new content*

1. Залейте изменения на GitHub

## Далее →
