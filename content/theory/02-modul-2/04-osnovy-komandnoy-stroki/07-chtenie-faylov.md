---
title: "Чтение файлов"
module: "Модуль 2"
topic: "Основы командной строки"
buildin_id: d46998e5-d14e-4683-b8cc-3903d0e9c704
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Чтение файлов

Ранее мы разобрали устройство файловой системы в POSIX-совместимых ОС.

Перейдём к работе с файлами. В уроке — способы чтения текстовых файлов из командной строки.

## Команда `cat`

Простейший способ — `cat`:

```
man cat

NAME
     cat -- concatenate and print files

SYNOPSIS
     cat [-benstuv] [file ...]

...
```

`cat` ждёт **аргументы** — пути к файлам. Для небольшого файла достаточно одного:

```
cat .profile

# ~/.profile: executed by the command interpreter for login shells.

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
    fi
fi
```

[Terminal session recording](https://asciinema.org/a/IbARaXrklWFR6sWgNwaPlMKf2/iframe?cols=120&rows=13&preload=1)

## Команды `head` и `tail`

Иногда нужны только начало или конец файла — помогут `head` и `tail`. Они принимают путь; по умолчанию `head` показывает первые 10 строк, `tail` — последние 10.

Число строк задаётся опцией `-n`:

Посмотрим, как работает `head`:

```
head -n 2 .profile

# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
```

Похожим образом работает `tail`:

```
tail -n 2 .profile

    PATH="$HOME/.local/bin:$PATH"
fi
```

[Terminal session recording](https://asciinema.org/a/H9CQaHmULiG1OhAFfzm4lKqTX/iframe?cols=120&rows=15&preload=1)

Некоторые файлы растут быстро. **Логи** — текстовые журналы событий в системе или приложении.

В Linux логи лежат в `/var/log`. Туда пишут ОС и многие программы. Основной системный лог — `syslog` с ключевыми событиями и ошибками.

В WSL `syslog` по умолчанию выключен. Чтобы включить, установите:

```
sudo add-apt-repository ppa:adiscon/v8-stable
sudo apt-get install rsyslog
```

Затем запустите: `sudo service rsyslog start`.

Допустим, нужно следить за частыми событиями. Обычные команды не подходят:

- `cat` неудобен — `syslog` слишком большой

- `tail` без дополнений не успеет за быстрой записью

Поможет `tail` с **флагом** `-f`.

`tail -f path/to/file` выводит хвост файла и ждёт новые строки — при дописывании сразу показывает их.

Это первая в наших примерах команда, которая **удерживает управление**: после запуска не завершается, а продолжает читать файл:

```
# Если у вас не хватает прав, чтобы смотреть файл syslog, наберите sudo перед командой tail, как показано ниже
# Есть вероятность, что sudo попросит вас ввести пароль
# Сделайте это и нажмите Enter
# При наборе пароля курсор не будет двигаться
# Это сделано для безопасности
sudo tail -f syslog

Aug 28 18:00:01 ip-10-0-1-223 systemd-udevd[15400]: Could not generate persistent MAC address for veth5c6ed9c: No such file or directory
Aug 28 18:00:01 ip-10-0-1-223 kernel: [126412.013499] device veth6969122 entered promiscuous mode
Aug 28 18:00:01 ip-10-0-1-223 systemd[1]: Starting Update resolvconf for networkd DNS...
Aug 28 18:00:01 ip-10-0-1-223 systemd-timesyncd[522]: Network configuration changed, trying to establish connection.
Aug 28 18:00:01 ip-10-0-1-223 systemd-timesyncd[522]: Synchronized to time server 91.173.73.198:123 (ntp.ubuntu.com).
Aug 28 18:00:01 ip-10-0-1-223 sh[15415]: sed: cant read /run/systemd/netif/leases/*: No such file or directory
Aug 28 18:00:01 ip-10-0-1-223 kernel: [126412.086162] IPv6: ADDRCONF(NETDEV_UP): veth6969122: link is not ready
Aug 28 18:00:01 ip-10-0-1-223 systemd-udevd[15403]: Could not generate persistent MAC address for veth6969122: No such file or directory
Aug 28 18:00:02 ip-10-0-1-223 systemd-timesyncd[522]: Network configuration changed, trying to establish connection.
Aug 28 18:00:02 ip-10-0-1-223 systemd-timesyncd[522]: Synchronized to time server 91.173.73.198:123 (ntp.ubuntu.com).
Aug 28 18:00:02 ip-10-0-1-223 systemd-timesyncd[522]: Network configuration changed, trying to establish connection.
```

Остановить — `Ctrl + C`.

## Пейджеры

Отдельный класс программ для просмотра файлов — **пейджеры**. Это как редактор только для чтения. Популярный — `less`. Откроем `syslog`:

```
# Снова придется воспользоваться sudo
sudo less syslog
# Здесь много вывода
```

`less` открывает файл и остаётся в режиме просмотра: поиск, движение вперёд и назад.

Пейджеры одинаково работают с файлами любого размера: в память не грузят всё сразу, а подгружают фрагменты по мере прокрутки.

У `less` десятки команд — в man. Основные:

- Выход — `q`

- Вперед на страницу — `f`

- Назад на страницу — `b`

- Поиск — `/`, текст, `Enter`

- Следующее совпадение — `n`

- Предыдущее совпадение — `N`

Поведение похоже на `man`: при вызове справки часто под капотом тот же `less`. Пейджеры нередко запускаются неявно из других программ.

## Далее →
