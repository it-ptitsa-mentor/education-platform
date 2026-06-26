---
title: "Позиция внутри строки"
module: "Модуль 4"
topic: "Регулярные выражения (Regexp)"
buildin_id: fbeccddc-0b2f-4cd3-8889-f1e021b39118
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Позиция внутри строки

Специальные якоря и границы слова уточняют, *где* в строке должен стоять фрагмент шаблона.

Базовый пример:

---

/`java`/

`java`

---

Слово `java` совпало с целой строкой. Regex ищет совпадения в **подстроках**, а не только в «целых строках».

Если вокруг есть лишний текст, совпадение всё равно найдётся — иногда это нежелательно:

---

/`java`/

asdf`java` asdf

---

Для контроля позиции служат якоря и `\b` / `\B`.

### Начало строки

`^` в начале шаблона — совпадение только с позиции start of line:

---

/`^java`/

`java` ruby clojurescript javascript

---

Без `^` — и внутри `javascript`:

---

/`java`/

`java` ruby clojurescript `java`script

---

### Конец строки

`$` — конец строки (или перед финальным `\n` в multiline-режиме).

Без `$` два вхождения `script`:

/`script`/

java ruby clojure`script` java`script`

---

С `$` — только в конце:

---

/`script$`/

java ruby clojurescript java`script`

---

### Границы слова

`a\b` — буква `a` в **конце** слова:

---

/`a\b`/

jav`a` ruby clojurescript javascript

---

`\B` инвертирует: `a` не на границе слова:

---

/`a\B`/

j`a`va ruby clojurescript j`a`v`a`script

---

`\bj` — `j` в **начале** слова:

---

/`\bj`/

`j`ava ruby clojurescript `j`avascript

---

`\Bj` — `j` не на начале слова:

---

/`\Bj`/

java ruby clo`j`urescript`j` javascript

---

`\Bj\B` — `j` ни в начале, ни в конце слова (например, внутри `clojurescriptj`):

---

/`\Bj\B`/

java ruby clo`j`urescript`j`j javascript

## Далее →
