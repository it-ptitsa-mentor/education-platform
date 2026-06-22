---
title: "8. Grep"
module: "Модуль 2"
topic: "Основы командной строки"
buildin_id: 0545fc81-2325-419c-956b-bd2cc209d3b6
---

# 8. Grep

Слово «грепать» входит в топ самых популярных терминов, используемых разработчиками. Оно происходит от одноименной консольной утилиты `grep` (сокращение от *global regular expression print*). Эта утилита выполняет поиск определенного текста по файлу или файлам.

В этом уроке мы научимся грепать и разберемся в особенностях этого процесса.

Для разработчиков «грепать» — то же самое, что гуглить для активных пользователей интернета. Как правило, грепают файлы с исходным кодом или логи во время отладки:

```
man grep

SYNOPSIS
       grep [OPTIONS] PATTERN [FILE...]
       grep [OPTIONS] [-e PATTERN]...  [-f FILE]...  [FILE...]
```

Рассмотрим этот пример подробнее:

- `PATTERN` — это то, что мы хотим найти. Это может быть конкретная строчка или определенный [шаблон с регулярными выражениями](https://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D1%8B%D0%B5_%D0%B2%D1%8B%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F)

- `FILE` — путь до файла, в котором нужно искать

Посмотрите на еще один пример:

```
# Поиск всех строк в файле .profile, в которых встречается слово PATH
grep PATH .profile

# set PATH so it includes user's private bin if it exists
    PATH="$HOME/bin:$PATH"
# set PATH so it includes user's private bin if it exists
    PATH="$HOME/.local/bin:$PATH"
```

В примере выше утилита `grep` нашла четыре строки. Найденные строчки выводятся на экран в том же порядке, в котором они встречаются в исходном файле.

В некоторых ситуациях нам нужно увидеть не только саму строку, но и текст вокруг нее. Количество выводимых соседних строк регулируется тремя опциями:

- Количество отображаемых строк до искомой строки — `-B` или `--before-context`

- Количество отображаемых строк после искомой — `-A` или `--after-context`

- Количество отображаемых строк до и после искомой строки — `-C` или `--context`

Изучим пример использования `-C` со значением `1`. Это значит, что для каждой найденной строки будет выведена одна строка выше и одна строка ниже:

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

Иногда мы не знаем, в каком файле находится то, что мы ищем. При этом мы можем знать директорию, в которой лежит этот файл.

В такой ситуации нужно сделать два изменения:

1. Добавить опцию `-r` — она указывает, что надо искать внутри директории. Обратите внимание, что поиск идет рекурсивно, то есть с включением всех поддиректорий

1. Указать путь до директории, а не файла

Попробуем применить утилиту `grep` с опцией `-r`:

```
grep -r PATH .

./.profile:# set PATH so it includes user's private bin if it exists
./.profile:    PATH="$HOME/bin:$PATH"
./.profile:# set PATH so it includes user's private bin if it exists
./.profile:    PATH="$HOME/.local/bin:$PATH"
```

При таком поиске в выводе указывается файл, в котором была найдена строка. Если добавить опцию `n`, то дополнительно отобразится номер строки:

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
