---
title: "История"
module: "Модуль 2"
topic: "Основы командной строки"
buildin_id: a2e6c3d6-45cf-4b75-94d8-1bb1ee433ed8
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# История

Чем дольше вы в shell, тем чаще нужно повторить старую команду. Проще всего листать историю стрелками «вверх» и «вниз»: «вверх» — предыдущая команда, «вниз» — следующая.

В уроке — как устроена история bash и где она экономит время.

Команды bash складываются в файл `.bash_history` в домашнем каталоге. Каждый ввод дописывается туда; запись на диск обычно происходит при завершении сессии. С файлом можно работать как с обычным текстом. Сколько строк хранить, задаёт `HISTFILESIZE`: если переменная есть — берётся её число, если нет — файл может расти без обрезки:

```
tail .bash_history

rm -r one/
env
HOME=/tmp cd
pwd
cd
echo $HOME
export HOME=/tmp
id
exit
id
```

[Terminal session recording](https://asciinema.org/a/RFDHy4Bw8xKnBTq1AsJyWS8u0/iframe?cols=120&rows=15&preload=1)

Проще посмотреть историю командой `history`:

```
history

 1  docke rps
 2  free -m
 3  docker ps
 4  docker exec -it 8678a6520641 bash
 5  ls
 6  exit
 7  docker ps
 8  docker exec -it 1209b6e5ce6b bash
 ...
```

[Terminal session recording](https://asciinema.org/a/CXsg76yT8h7WEIut5uEVV4kJ7/iframe?cols=120&rows=15&preload=1)

Вывод похож на `.bash_history`, но с номерами слева. `history 5` покажет только пять последних команд. По номеру можно перезапустить команду без набора текста:

```
# Эта команда имела второй номер в списке выше
!2

free -m
              total        used        free      shared  buff/cache   available
Mem:           1998        1532          75          21         390         227
Swap:             0           0           0
```

[Terminal session recording](https://asciinema.org/a/N5uUGxC4HDATcu4hiI3RiO2gJ/iframe?cols=120&rows=12&preload=1)

Историю можно прогнать через grep:

```
history | grep export

 174  export HOME=/tmp
 183  history | grep export
```

[Terminal session recording](https://asciinema.org/a/v5y6BmTwpZO9t6dwWMeDMZdoU/iframe?cols=120&rows=12&preload=1)

Отдельный приём — **реверсивный поиск**: `Ctrl + r` включает поиск по истории. Вы печатаете символы — bash показывает ближайшее совпадение; повторный `Ctrl + r` переключает на следующее:

[Terminal session recording](https://asciinema.org/a/EYtMWjzh7VfnDKJsC8mwGYlde/iframe?cols=120&rows=12&preload=1)

<!-- IMG (из Buildin, перезалить отдельно) -->
На скриншоте — расширенный вариант через утилиту [fzf.](https://github.com/junegunn/fzf#installation)

---

### Самостоятельная работа

Проанализируйте историю на своем локальном компьютере и поэкспериментируйте с реверсивным поиском.

## Далее →
