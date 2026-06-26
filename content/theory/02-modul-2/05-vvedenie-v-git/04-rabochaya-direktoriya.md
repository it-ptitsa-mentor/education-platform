---
title: "Рабочая директория"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 33bc5298-32af-4f5c-ac92-70646bc42272
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Рабочая директория

После клонирования *my-git* внутри видны каталог `.git` и добавленные файлы. Посмотрим, что будет, если удалить один из них:

```
rm PEOPLE.md
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    deleted:    PEOPLE.md

no changes added to commit (use "git add" and/or "git commit -a")
```

Git сообщает об удалении и подсказывает команды для восстановления или фиксации изменений. Стоит разобраться, откуда Git знает, что файл пропал — об этом в этом уроке.

## Как узнать статус репозитория

В каталоге проекта с одной стороны лежат файлы проекта, с другой — `.git`.

Репозиторий — это именно `.git`: там хранятся все сведения об изменениях и сами версии файлов.

Всё снаружи — **рабочая директория** (*working directory*). Эти файлы появляются при клонировании из `.git`.

Когда вы меняете файлы в рабочей директории, Git сравнивает их с состоянием на момент последнего коммита внутри `.git`. Если есть расхождения, `git status` об этом сообщит.

Это легко проверить, восстановив удалённый файл, как советует Git:

```
git restore PEOPLE.md
git status

On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

# Сам файл вернулся таким, каким он был на момент последнего коммита
```

Можно удалить все файлы в рабочей директории и затем восстановить их — так быстро вернуть последнюю зафиксированную версию, если текущие правки больше не нужны.

Или зафиксировать удаление коммитом:

```
rm PEOPLE.md
# Любое изменение нужно добавлять в индекс
git add PEOPLE.md
git commit -m 'remove PEOPLE.md'

[main e15afd2] remove PEOPLE.md
1 file changed, 1 deletion(-)
delete mode 100644 PEOPLE.md
# Теперь этот файл пропал из рабочей директории
```

Важная деталь: при добавлении, изменении или удалении файла порядок один — сначала `git add` (подготовка к коммиту, а не «добавление файла»), затем коммит.

Есть команда `git rm`, которая объединяет удаление и подготовку:

```
git rm PEOPLE.md
# Равносильно rm + git add
```

[Terminal session recording](https://asciinema.org/a/TQc8FcLAJ2fYppb2YeJniT1Eh/iframe?cols=130)

---

### Самостоятельная работа

1. Выполните все шаги из урока

1. Удалите файл *NEW.md* и сделайте коммит

1. Добавьте файл *INFO.md* с текстом *git is awesome!* и сделайте коммит

1. Залейте изменения на GitHub с помощью `git push`

1. Обновите страницу репозитория на GitHub и изучите произошедшие изменения

## Далее →
