---
title: "Рабочий процесс"
module: "Модуль 2"
topic: "Введение в Git"
buildin_id: 5d006588-a6e2-4586-83ae-15314c99d7f8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Рабочий процесс

Сначала пройдём весь путь от создания проекта в Git до первых отслеживаемых изменений — обзорно, в этом уроке; детали разберём дальше. Появится много новых терминов и команд — они нужны, чтобы понимать, как устроен Git.

## Основные команды

Git начинает следить за файлами только после того, как проект поставлен под контроль версий. Для этого переходят в каталог проекта и выполняют `git init`.

Проект может быть новым или уже существующим — инициализация одинакова:

```
# Создаем новый проект
mkdir my-git

# Переходим в созданную директорию
cd my-git

# Выполняем инициализацию
git init

Initialized empty Git repository in /private/tmp/my-git/.git/
```

`git init` создаёт репозиторий — каталог `.git` со служебными данными Git.

Статус репозитория показывает `git status`:

```
git status

On branch main
No commits yet
nothing to commit (create/copy files and use "git add" to track)
```

Репозиторий пуст (`No commits yet`) — нет ни новых, ни изменённых файлов под учётом.

Добавим файлы:

```
# Создаем файл README.md со строкой текста
echo 'Hello, Git!' > README.md
echo 'Haskell Curry' > PEOPLE.md
```

Снова статус:

```
git status

# Часть вывода убрана
Untracked files:
  (use "git add <file>..." to include in what will be committed)
    PEOPLE.md
    README.md
```

Git видит новые файлы как **неотслеживаемые** (*untracked files*) — за ними пока не следят, потому что они ещё не в репозитории.

Добавление в репозиторий — в два шага. Сначала подготовка: `git add <путь до файла>`:

```
# Для каждого нового или измененного файла
git add README.md
```

Результат:

```
git status

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
    new file:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
    PEOPLE.md
```

*README.md* в состоянии «готов к коммиту» — файл **в индексе**.

Следующий шаг — **коммит**: окончательная фиксация в репозитории, после которой Git запоминает версию и следит за дальнейшими изменениями.

При коммите все подготовленные изменения (любое число файлов) сохраняются одним снимком:

```
git commit -m 'add README.md'

[main (root-commit) 3c5d976] add README.md
1 file changed, 1 insertion(+)
create mode 100644 README.md
```

Флаг `-m` (*message*) задаёт описание коммита. Без `-m` откроется редактор для текста сообщения.

Осмысленные описания — хорошая практика; пример соглашений — в дополнительных материалах.

Типичный цикл работы с Git:

<!-- IMG (из Buildin, перезалить отдельно) -->
Зачем два шага — сначала `git add`, потом коммит? Казалось бы, проще сразу коммитить всё изменённое.

Так устроено специально: за сессию меняется много файлов, но не всё должно попасть в один коммит.

Коммит — логически завершённое изменение. Размер бывает разным:

- Маленький — одна опечатка в одном файле

- Большой — новая функциональность

Главное — **атомарность**: один коммит решает одну задачу.

*README.md* уже в репозитории. Проверка:

```
git status

Untracked files:
  (use "git add <file>..." to include in what will be committed)
    PEOPLE.md
```

`git status` не показывает файлы без изменений относительно последнего коммита. Сам *README.md* по-прежнему лежит в каталоге *my-git*.

---

### Самостоятельная работа

1. Установите Git по [официальной инструкции](https://git-scm.com/book/ru/v2/%D0%9D%D0%B0%D1%87%D0%B0%D0%BB%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0-Git)

1. Выполните все шаги из урока

1. Добавьте файл *PEOPLE.md* в репозиторий

После добавления `git status` покажет:

```
git status

On branch main
nothing to commit, working tree clean
```

---

### Дополнительные материалы

1. [Git Cheatsheet](https://about.gitlab.com/images/press/git-cheat-sheet.pdf)

1. [Соглашение об именовании коммитов](https://www.conventionalcommits.org/ru/v1.0.0/)

1. [Что такое Git?](https://git-scm.com/book/ru/v2/%D0%92%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5-%D0%A7%D1%82%D0%BE-%D1%82%D0%B0%D0%BA%D0%BE%D0%B5-Git%3F)

## Далее →
