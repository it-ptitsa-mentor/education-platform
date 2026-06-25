---
title: "Изменение последнего коммита"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 3c81d220-ec46-4817-9f5c-50cbc57db033
---

# Изменение последнего коммита

Крайне часто разработчики делают коммит и сразу понимают, что забыли добавить часть файлов через `git add`. Оставшуюся часть изменений можно дослать следующим коммитом.

Есть еще один способ. Если изменения еще не были отправлены во внешнюю систему, можно добавить изменения в текущий коммит. Для этого во время коммита добавляется флаг `--amend`:

```
echo 'experiment with amend' >> INFO.md
echo 'experiment with amend' >> README.md
git add INFO.md
# Забыли сделать подготовку README.md к коммиту
git commit -m 'add content to INFO.md and README.md'

[main 256de25] add content to INFO.md and README.md
 1 file changed, 1 insertion(+)

git status

On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:   README.md

# Увидели, что забыли добавить файл
# Добавляем

git add README.md
git commit --amend
# После этой команды откроется редактор, ожидающий ввода описания коммита
# Здесь можно поменять сообщение или выйти из редактора, оставив старое

[main d96151a] add content to INFO.md and README.md
 Date: Sat Sep 26 16:02:07 2020 -0400
 2 files changed, 2 insertions(+)

git status

On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

В реальности `--amend` не добавляет изменения в существующий коммит. Этот флаг приводит к откату коммита через `git reset` и выполнению нового коммита с новыми данными. Поэтому мы и видим ровно один коммит, хотя команда `git commit` выполнялась два раза (первый раз — когда сделали ошибочный коммит).

Чтобы не открывался редактор для ввода описания коммита к команде `git commit --amend` можно добавить опцию `--no-edit`. В этом случае описание коммита не изменится:

[Terminal session recording](https://asciinema.org/a/fBl8nyMlVyfIeX4aoa7PK16ja/iframe?cols=130)

---

### Самостоятельная работа

1. Выполните все шаги из урока

1. Залейте изменения на GitHub

---

### Дополнительные материалы

1. [Перезапись истории](https://git-scm.com/book/ru/v2/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B-Git-%D0%9F%D0%B5%D1%80%D0%B5%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8)

## Далее →
