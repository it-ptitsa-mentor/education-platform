---
title: "Просмотр вперед и назад"
module: "Модуль 4"
topic: "Регулярные выражения (Regexp)"
buildin_id: a9cd610e-c9e0-41ef-a58e-10efc6673150
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Просмотр вперед и назад

Многие движки regex поддерживают **lookahead** (просмотр вперёд) и **lookbehind** (просмотр назад). Зачем они нужны — разберём на примерах.

Шаблон находит подстроку `LudovicXVI`:

---

/`LudovicXVI`/

LudovicXV, `LudovicXVI`, `LudovicXVI`II, LudovicLXVII, LudovicXXL

---

Нужно совпадение с `Ludovic`, за которым идут `XVI`, но сами римские цифры не включать в результат. Оборачиваем хвост в позитивный lookahead:

---

/`Ludovic(?=XVI)`/

LudovicXV, `Ludovic`XVI, `Ludovic`XVIII, LudovicLXVII, LudovicXXL

---

Условия сопоставления те же, что у полного `LudovicXVI`, но `XVI` не входит в захват. Это **позитивный просмотр вперёд** (*positive lookahead*).

Формула: `a(?=b)` находит `a`, только если сразу за ним следует `b`, при этом `b` не попадает в совпадение.

**Негативный** lookahead: вместо `=` пишут `!` — совпадение, если указанного фрагмента *нет* дальше:

---

/`Ludovic(?!XVI)`/

`Ludovic`XV, LudovicXVI, LudovicXVIII, `Ludovic`LXVII, `Ludovic`XXL

---

**Lookbehind** проверяет текст *перед* текущей позицией, не включая его в результат. Позитивный вариант: `(?<=b)a` — `a` только если перед ним `b`.

Для lookbehind добавляют `<`:

---

/`(?<=One )Two`/

One `Two`, Three Two

---

Негативный lookbehind — `=` меняют на `!`:

---

/`(?<!One )Two`/

One Two, Three `Two`

---

## Далее →
