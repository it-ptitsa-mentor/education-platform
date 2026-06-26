---
title: "Квантификация"
module: "Модуль 4"
topic: "Регулярные выражения (Regexp)"
buildin_id: e7450505-3f90-4fa8-ada2-1f4d617660b3
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Квантификация

**Квантификация** задаёт, сколько раз может повторяться фрагмент слева — символ, группа или класс.

Квантификатор `?` — «ноль или один раз»:

---

/`colou?`/

colr, `colo`r, `colou`r, `colou`ur, `colou`uur

---

Здесь `?` относится к `u`: либо его нет, либо он один.

С фиксированным `r` на конце — два совпадения:

---

/`colou?r`/

colr, `color`, `colour`, colouur, colouuur

---

С группой `(ou)?` проверяется вся группа целиком; с классом `[ou]?` — один из символов `o` или `u`, не оба:

---

/`col(ou)?r`/

`colr`, color, `colour`, colouur, colouuur

---

/`col[ou]?r`/

`colr`, `color`, colour, colouur, colouuur

---

`+` — один раз и больше (`color` без лишних `u` уже не подходит):

---

/`colou+r`/

colr, color, `colour`, `colouur`, `colouuur`

---

`*` — ноль и больше (все варианты, кроме голого `colr`):

---

/`colou*r`/

colr, `color`, `colour`, `colouur`, `colouuur`

---

Точное число повторений — в фигурных скобках `{}`:

---

/`colou{2}r`/

colr, color, colour, `colouur`, colouuur

---

Диапазон, например от 2 до 3:

---

/`colou{2,3}r`/

colr, color, colour, `colouur`, `colouuur`

---

Без верхней границы — `{1,}`:

---

/`colou{1,}r`/

colr, color, `colour`, `colouur`, `colouuur`, `colouuuur`, `colouuuuur`

## Далее →
