---
title: "Grep"
module: "Модуль 2"
topic: "Основы командной строки"
buildin_id: 0545fc81-2325-419c-956b-bd2cc209d3b6
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Grep

Среди разработчиков «грепать» — один из самых узнаваемых глаголов. Он восходит к утилите `grep` (*global regular expression print*): она ищет заданный текст в одном или нескольких файлах.

В этом уроке разберём, как пользоваться `grep` и на что обратить внимание.

Для программиста грепать — примерно то же, что гуглить для активного пользователя сети. Чаще всего ищут по исходникам или по логам при отладке:

```
man grep

SYNOPSIS
       grep [OPTIONS] PATTERN [FILE...]
       grep [OPTIONS] [-e PATTERN]...  [-f FILE]...  [FILE...]
```

Разберём синтаксис:

- `PATTERN` — что ищем: точная подстрока или [шаблон с регулярными выражениями](https://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D1%8B%D0%B5_%D0%B2%D1%8B%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F)

- `FILE` — путь к файлу для поиска

Ещё один пример:

```
# Поиск всех строк в файле .profile, в которых встречается слово PATH
grep PATH .profile

# set PATH so it includes user's private bin if it exists
    PATH="$HOME/bin:$PATH"
# set PATH so it includes user's private bin if it exists
    PATH="$HOME/.local/bin:$PATH"
```

`grep` нашёл четыре строки и вывел их в том же порядке, что и в файле.

Иногда нужен не только сам матч, но и контекст вокруг. За это отвечают три опции:

- Строки **до** совпадения — `-B` или `--before-context`

- Строки **после** — `-A` или `--after-context`

- Строки **до и после** — `-C` или `--context`

С `-C 1` для каждой найденной строки показывается по одной соседней сверху и снизу:

```
grep -C 1 PATH .profile

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi
```

Бывает, что файл неизвестен, зато известна папка, где он лежит. Тогда:

1. Добавляют `-r` — рекурсивный поиск по каталогу и всем вложенным

1. Вместо пути к файлу указывают путь к директории

Пример с `-r`:

```
grep -r PATH .

./.profile:# set PATH so it includes user's private bin if it exists
./.profile:    PATH="$HOME/bin:$PATH"
./.profile:# set PATH so it includes user's private bin if it exists
./.profile:    PATH="$HOME/.local/bin:$PATH"
```

В выводе видно имя файла. С опцией `n` добавляется номер строки:

```
grep -rn PATH .

./.profile:19:# set PATH so it includes user's private bin if it exists
./.profile:21:    PATH="$HOME/bin:$PATH"
./.profile:24:# set PATH so it includes user's private bin if it exists
./.profile:26:    PATH="$HOME/.local/bin:$PATH"
```

---

### Дополнительные материалы

1. [Поиск файлов](https://ru.wikipedia.org/wiki/Find)

## Далее →
