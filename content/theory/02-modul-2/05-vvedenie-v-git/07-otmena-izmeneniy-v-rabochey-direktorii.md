---
title: "Отмена изменений в рабочей директории"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 5ed36098-0120-4e11-8db8-96f3333bbf23
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Отмена изменений в рабочей директории

- [Неотслеживаемые файлы](https://buildin.ai/5ed36098-0120-4e11-8db8-96f3333bbf23#abbea609-85a6-4704-a5f9-1364fc446d4f)

- [Измененные файлы в рабочей директории](https://buildin.ai/5ed36098-0120-4e11-8db8-96f3333bbf23#d50212f4-0d96-4b85-be66-74fbed9a03e2)

- [Изменения, подготовленные к коммиту](https://buildin.ai/5ed36098-0120-4e11-8db8-96f3333bbf23#14eddd14-1cc6-4e71-9a56-2248a5b8c2f4)

Одна из сильных сторон Git — откат незакоммиченных правок одной командой. Без системы контроля версий так почти не сделать, если только не помнить всё наизусть. Здесь — отмена изменений в рабочей директории, которые ещё не попали в коммит.

Важно: откат незакоммиченных изменений необратим — восстановить их потом нельзя. Действуйте осторожно.

## Неотслеживаемые файлы

Самый простой случай: вы создали файлы и поняли, что они не нужны.

Очистка:

```
mkdir one
touch two

git status

On branch main
Your branch is up to date with 'origin/main'.

# Пустые директории в Git не добавляются в принципе
# Физически директория one находится в рабочей директории,
# но при этом ее нет в Git, поэтому Git игнорирует ее
Untracked files:
  (use "git add <file>..." to include in what will be committed)
    two

# Выполняем очистку. Команда удалит все неотслеживаемые файлы
# -f – force, -d – directory
git clean -fd

Removing one/
Removing two
```

Про `git clean` знают не все — команда иногда удивляет даже опытных коллег.

## Измененные файлы в рабочей директории

Для отмены правок в отслеживаемых файлах — `git restore`. Git подсказывает её в выводе `git status`:

```
echo 'new text' > INFO.md
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  # Ниже написано, как отменить изменение
  (use "git restore <file>..." to discard changes in working directory)
    modified:   INFO.md

# Отменяем
git restore INFO.md
```

## Изменения, подготовленные к коммиту

С файлами в индексе можно поступить по-разному: отменить правки полностью или только убрать из индекса, оставив изменения в рабочей директории. Второй вариант удобен, когда правки нужны, но коммитить их сейчас не хотите:

```
echo 'new text' > INFO.md
git add INFO.md
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
    modified:   INFO.md
```

Git снова подсказывает команду — вернуть файл из индекса в рабочую директорию:

```
git restore --staged INFO.md
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:   INFO.md
```

При необходимости выполните `git restore` и окончательно отмените изменения в файле:

[Terminal session recording](https://asciinema.org/a/aqhyAjyhxnbydoaI2tnTrwXke/iframe?cols=130&rows=25)

---

### Самостоятельная работа

1. Выполните все шаги из урока

## Далее →
