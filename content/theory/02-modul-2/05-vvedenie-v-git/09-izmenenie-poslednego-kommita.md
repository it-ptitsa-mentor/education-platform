---
title: "Изменение последнего коммита"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 3c81d220-ec46-4817-9f5c-50cbc57db033
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Изменение последнего коммита

Часто после коммита сразу видно, что не все файлы попали через `git add`. Оставшиеся изменения можно отправить следующим коммитом.

Есть и другой путь. Если правки ещё не ушли на удалённый сервер, их можно «добавить» в текущий коммит — флаг `--amend` при коммите:

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

На деле `--amend` не дописывает в существующий коммит. Он откатывает его через `git reset` и создаёт новый с обновлёнными данными. Поэтому в истории один коммит, хотя `git commit` вызывали дважды (первый — с ошибкой).

Чтобы редактор не открывался, добавьте `--no-edit` — сообщение коммита не изменится:

[Terminal session recording](https://asciinema.org/a/fBl8nyMlVyfIeX4aoa7PK16ja/iframe?cols=130)

---

### Самостоятельная работа

1. Выполните все шаги из урока

1. Залейте изменения на GitHub

---

### Дополнительные материалы

1. [Перезапись истории](https://git-scm.com/book/ru/v2/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B-Git-%D0%9F%D0%B5%D1%80%D0%B5%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8)

## Далее →
