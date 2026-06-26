---
title: "Манипулирование файловой структурой"
module: "Модуль 2"
topic: "Основы командной строки"
buildin_id: 596da8d3-b0b9-4925-8093-8a4e09df6803
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Манипулирование файловой структурой

Дерево файлов можно не только смотреть, но и менять. В прошлом уроке файлы создавали через перенаправление потоков; здесь — прямые команды.

Правка структуры зависит от **прав пользователя**. Без прав доступа команда вернёт ошибку. Безопасная площадка для экспериментов — домашний каталог: там обычно можно писать.

В примерах ниже используется каталог `test` в домашней директории — команды выполняются в `~/test`.

## Основные команды

Пустые файлы часто создают через `touch`. Штатная задача утилиты — обновить время последнего доступа, но есть побочный эффект:

Если файла нет — он появится. Поэтому `touch` используют как быстрый способ создать файл:

```
# В текущей директории создается пустой файл
touch empty-file
```

[Terminal session recording](https://asciinema.org/a/EK9l2zlzVa8CsHYA9SzTJTrKZ/iframe?cols=120&rows=14&preload=1)

Удаление — `rm` (*remove*):

```
rm empty-file
```

[Terminal session recording](https://asciinema.org/a/z9BTi5w3UOy0Fp1misw630u38/iframe?cols=120&rows=14&preload=1)

В *nix нет отдельной операции «переименовать»: переименование — это перемещение командой `mv` (*move*):

```
touch file
mv file renamed-file
```

[Terminal session recording](https://asciinema.org/a/nHCJLgmnw0HoOKp4Sh0Yp9m6k/iframe?cols=120&rows=19&preload=1)

Копирование файлов и каталогов — `cp` (*copy*).

Два аргумента:

- Источник (откуда)

- Приёмник (куда)

Пример:

```
cp renamed-file renamed-file-copy
```

[Terminal session recording](https://asciinema.org/a/Pag7yOALRusxRXNYL9n7Ef1I0/iframe?cols=120&rows=15&preload=1)

Для копирования директории нужен флаг `-r` (*recursive*).

Команды принимают пути в любой точке файловой системы, например: `touch /tmp/tempfile`.

Для каталогов — отдельные нюансы. Создание: `mkdir` (*make directory*):

```
mkdir my-dir
```

[Terminal session recording](https://asciinema.org/a/o9hWi8qsQiLddJKGDP4WXHy84/iframe?cols=120&rows=17&preload=1)

По умолчанию вложенную цепочку не создаст:

```
mkdir one/two/three
mkdir: cannot create directory ‘one/two/three’: No such file or directory
```

[Terminal session recording](https://asciinema.org/a/TvPdYV7ZBKp3TLzbDXjWJrkig/iframe?cols=120&rows=13&preload=1)

Можно создавать уровни по одному или сразу с `-p` (`--parents`):

```
mkdir -p one/two/three
```

[Terminal session recording](https://asciinema.org/a/795AjrJ5Mo52KbzIxdZa0npzB/iframe?cols=120&rows=24&preload=1)

Каталоги удаляют той же `rm`, но без флагов она предупредит:

```
rm my-dir/
rm: cannot remove 'my-dir/': Is a directory
```

[Terminal session recording](https://asciinema.org/a/qYUXYAB52YDBVQAV8V1EGdARg/iframe?cols=120&rows=14&preload=1)

Нужен `-r` (*recursion*): обход вложенных папок и удаление содержимого до конца:

```
rm -r my-dir
```

[Terminal session recording](https://asciinema.org/a/Jz48g4nO2bQttoiSVXfV31vuP/iframe?cols=120&rows=19&preload=1)

Если внутри есть файлы только для чтения, `rm` может спрашивать подтверждение на каждый. Когда нужно снести всё без вопросов — `-f` (`--force`): игнорировать отсутствующие пути и не спрашивать:

```
rm -rf one
```

[Terminal session recording](https://asciinema.org/a/C8ioOzvimAT9NHHtj49LROikL/iframe?cols=120&rows=17&preload=1)

## Далее →
