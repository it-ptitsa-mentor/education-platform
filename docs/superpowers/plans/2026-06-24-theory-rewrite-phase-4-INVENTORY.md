# Phase 4 Inventory — Modules 4 & 5

> Generated: 2026-06-24 | Prep for theory rewrite — **inventory only, no content changes**
> Plan: see phase doc in this directory

**Prerequisite:** Phase 3 merged

**Freeze:** `04-modul-4`, `05-modul-5` in `FROZEN_MODULES`

**Effort (plan):** ~32–45 h review

---

## Summary

| Module | Lessons | Topics | codepen files (refs) | IMG files (refs) | hexlet files (refs) | `source: platform` | todo |
|--------|---------|--------|--------------------|------------------|---------------------|--------------------|------|
| `04-modul-4` | 65 | 5 | 10 (24) | 19 (38) | 28 (53) | 0 | 65 |
| `05-modul-5` | 41 | 2 | 21 (70) | 9 (10) | 29 (93) | 0 | 41 |
| **Total** | **106** | **7** | **31 (94)** | **28 (48)** | **57 (146)** | **0** | **106** |

---

## Module 4 (`04-modul-4`)

- **Branch:** `content/theory-m4-rewrite`
- **PRs (plan):** ~6 PR
- **Lessons:** 65 (plan: 65)

### Pitfalls

- **async/Promise** — термины для квизов не трогать
- **DOM** — имена методов (`querySelector`, `addEventListener`) exact
- **regexp** — паттерны в примерах не ломать
- **архитектура** — абстрактные схемы; light rewrite только в prose

### Topics & lessons

### `01-js-asinhronnoe-programmirovanie` (plan: 15 lessons, PRs: 1)

**Actual:** 15 lessons | codepen files: 0 (0 refs) | IMG files: 4 (5 refs) | hexlet files: 7 (7 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-obrabotka-oshibok.md` | Обработка ошибок | — | 679 | hex×1 |
| `02-taymery.md` | Таймеры | — | 853 | — |
| `03-http-zaprosy.md` | HTTP-запросы | — | 473 | hex×1 |
| `04-vvedenie.md` | Введение | — | 255 | — |
| `05-new-promise.md` | new Promise | — | 505 | img×1, hex×1 |
| `06-stek-vyzovov-call-stack.md` | Стек вызовов (Call Stack) | — | 615 | img×2, hex×1 |
| `07-uporyadochivanie-asinhronnyh-operaciy.md` | Упорядочивание асинхронных операций | — | 691 | hex×1 |
| `08-vozvrat-v-asinhronnom-kode.md` | Возврат в асинхронном коде | — | 446 | — |
| `09-obrabotka-oshibok-v-promisah.md` | Обработка ошибок в промисах | — | 517 | img×1 |
| `10-cepochka-promisov.md` | Цепочка промисов | — | 792 | hex×1 |
| `11-asinhronnyy-kod.md` | Асинхронный код | — | 1089 | img×1, hex×1 |
| `12-promisy-promise.md` | Промисы (Promise) | — | 872 | — |
| `13-async-await.md` | Async/Await | — | 718 | — |
| `14-promise-all.md` | Promise.all | — | 458 | — |
| `15-parallelnoe-vypolnenie-operaciy.md` | Параллельное выполнение операций | — | 579 | — |

### `02-js-prodvinutoe-testirovanie` (plan: 9 lessons, PRs: 1)

**Actual:** 9 lessons | codepen files: 0 (0 refs) | IMG files: 0 (0 refs) | hexlet files: 2 (2 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-inversiya-zavisimostey.md` | Инверсия зависимостей | — | 769 | — |
| `02-moki.md` | Моки | — | 1027 | hex×1 |
| `03-mankipatching.md` | Манкипатчинг | — | 788 | — |
| `04-property-based-testirovanie.md` | Property-based тестирование | — | 1201 | — |
| `05-testirovanie-oshibok.md` | Тестирование ошибок | — | 384 | — |
| `06-vvedenie.md` | Введение | — | 172 | hex×1 |
| `07-testirovanie-koda-vzaimodeystvuyuschego-s-faylami.md` | Тестирование кода, взаимодействующего с файлами | — | 770 | — |
| `08-pobochnye-effekty.md` | Побочные эффекты | — | 352 | — |
| `09-testirovanie-http-zaprosov.md` | Тестирование HTTP-запросов | — | 717 | — |

### `03-js-dom-api` (plan: 18 lessons, PRs: 2 (9+9))

**Actual:** 18 lessons | codepen files: 3 (11 refs) | IMG files: 11 (29 refs) | hexlet files: 10 (22 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-manipulirovanie-dom-derevom.md` | Манипулирование DOM-деревом | — | 655 | — |
| `02-deklarativnyy-poisk-po-dom-derevu.md` | Декларативный поиск по DOM-дереву | — | 598 | — |
| `03-vvedenie-v-sobytiya.md` | Введение в события | — | 1051 | cp×1, hex×1 |
| `04-sobytiya-dokumenta.md` | События документа | — | 353 | img×1, hex×1 |
| `05-vvedenie.md` | Введение | — | 238 | — |
| `06-jquery.md` | JQuery | — | 936 | img×1, hex×1 |
| `07-formy.md` | Формы | — | 526 | — |
| `08-ajax.md` | AJAX | — | 1106 | img×4 |
| `09-dom.md` | DOM | — | 712 | img×4, hex×1 |
| `10-konsol-razrabotchika.md` | Консоль разработчика | — | 234 | img×4 |
| `11-perehvat-i-vsplytie.md` | Перехват и всплытие | — | 781 | cp×8, img×1, hex×8 |
| `12-polifilly.md` | Полифиллы | — | 638 | img×1, hex×1 |
| `13-globalnyy-obekt-window.md` | Глобальный объект Window | — | 426 | img×1 |
| `14-javascript-v-brauzere.md` | JavaScript в браузере | — | 1023 | hex×5 |
| `15-navigaciya-po-dom-derevu.md` | Навигация по DOM-дереву | — | 1052 | img×5 |
| `16-sobytiya-na-praktike.md` | События на практике | — | 617 | cp×2, hex×2 |
| `17-bom-obekty.md` | BOM-объекты | — | 175 | img×5, hex×1 |
| `18-upravlenie-uzlami-dom.md` | Управление узлами DOM | — | 902 | img×2, hex×1 |

### `04-regulyarnye-vyrazheniya-regexp` (plan: 12 lessons, PRs: 1)

**Actual:** 12 lessons | codepen files: 0 (0 refs) | IMG files: 1 (1 refs) | hexlet files: 0 (0 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-poisk-po-usloviyu.md` | Поиск по условию | — | 295 | — |
| `02-flagi.md` | Флаги | — | 359 | — |
| `03-alternativa.md` | Альтернатива | — | 436 | — |
| `04-gruppirovka-i-obratnaya-svyaz.md` | Группировка и обратная связь | — | 683 | — |
| `05-zhadnost.md` | Жадность | — | 259 | — |
| `06-vvedenie.md` | Введение | — | 297 | img×1 |
| `07-prosmotr-vpered-i-nazad.md` | Просмотр вперед и назад | — | 323 | — |
| `08-predstavlenie-simvolov-i-metasimvol.md` | Представление символов и метасимвол | — | 500 | — |
| `09-simvolnye-klassy.md` | Символьные классы | — | 554 | — |
| `10-kvantifikaciya.md` | Квантификация | — | 373 | — |
| `11-modifikatory.md` | Модификаторы | — | 425 | — |
| `12-poziciya-vnutri-stroki.md` | Позиция внутри строки | — | 346 | — |

### `05-js-arhitektura-frontenda` (plan: 11 lessons, PRs: 1)

**Actual:** 11 lessons | codepen files: 7 (13 refs) | IMG files: 3 (3 refs) | hexlet files: 9 (22 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-otrisovka-rendering-sostoyaniya.md` | Отрисовка (рендеринг) состояния | — | 1388 | cp×2, hex×2 |
| `02-sostoyanie-form.md` | Состояние форм | — | 841 | cp×1, hex×1 |
| `03-kompleksnoe-sostoyanie.md` | Комплексное состояние | — | 1144 | cp×1, hex×2 |
| `04-inicializaciya-prilozheniya.md` | Инициализация приложения | — | 668 | hex×3 |
| `05-normalizaciya-dannyh.md` | Нормализация данных | — | 1050 | hex×1 |
| `06-sostoyanie-otobrazheniya-ui-state.md` | Состояние отображения (UI State) | — | 1000 | cp×2, img×1, hex×2 |
| `07-programmirovanie-s-yavno-vydelennym-sostoyaniem.md` | Программирование с явно выделенным состоянием | — | 1342 | cp×1, hex×1 |
| `08-vvedenie.md` | Введение | — | 294 | — |
| `09-mvc.md` | MVC | — | 1362 | cp×2, img×1, hex×4 |
| `10-sostoyanie-prilozheniya.md` | Состояние приложения | — | 1205 | cp×4, img×1, hex×6 |
| `11-organizaciya-tekstov-interfeysa.md` | Организация текстов интерфейса | — | 1231 | — |

---

## Module 5 (`05-modul-5`)

- **Branch:** `content/theory-m5-rewrite`
- **PRs (plan):** ~3 PR
- **Lessons:** 41 (plan: 41)

### Pitfalls

- **React API** — `useState`, `useEffect`, JSX — stable names
- **Redux/RTK** — slice, reducer, dispatch — match quiz wording
- **Create React App / Vite** — не менять стек без sync с exercises

### Topics & lessons

### `01-js-react` (plan: 30 lessons, PRs: 2 (15+15))

**Actual:** 30 lessons | codepen files: 20 (68 refs) | IMG files: 4 (5 refs) | hexlet files: 24 (80 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-vvedenie.md` | Введение | — | 850 | cp×2, hex×4 |
| `02-komponenty.md` | Компоненты | — | 905 | cp×2, hex×2 |
| `03-jsx.md` | JSX | — | 694 | — |
| `04-props.md` | Props | — | 388 | cp×2, hex×2 |
| `05-rabota-s-kollekciyami.md` | Работа с коллекциями | — | 758 | cp×2, hex×2 |
| `06-razlichiya-jsx-i-html.md` | Различия jsx и html | — | 299 | cp×4, hex×4 |
| `07-obrabotka-imen-klassov.md` | Обработка имён классов | — | 395 | — |
| `08-children.md` | Children | — | 916 | cp×6, hex×6 |
| `09-sostoyanie.md` | Состояние | — | 1058 | cp×8, hex×9 |
| `10-sobytiya.md` | События | — | 335 | cp×2, hex×3 |
| `11-avtomatnoe-programmirovanie.md` | Автоматное программирование | — | 629 | cp×2, hex×3 |
| `12-formy.md` | Формы | — | 489 | cp×6, hex×6 |
| `13-neizmenyaemost.md` | Неизменяемость | — | 795 | cp×2, hex×4 |
| `14-vlozhennye-komponenty.md` | Вложенные компоненты | — | 549 | cp×4, hex×4 |
| `15-funkcionalnye-komponenty.md` | Функциональные компоненты | — | 339 | cp×4, hex×5 |
| `16-kontekst-context-api.md` | Контекст (Context API) | — | 1041 | cp×6, hex×6 |
| `17-virtual-dom.md` | Virtual Dom | — | 575 | img×2, hex×1 |
| `18-testirovanie.md` | Тестирование | — | 495 | hex×1 |
| `19-asinhronnaya-obrabotka.md` | Асинхронная обработка | — | 331 | hex×1 |
| `20-zhiznennyy-cikl-komponenta.md` | Жизненный цикл компонента | — | 741 | hex×1 |
| `21-proizvoditelnost.md` | Производительность | — | 820 | cp×2, img×1, hex×2 |
| `22-refs.md` | Refs | — | 417 | cp×4, hex×4 |
| `23-vvedenie-v-huki.md` | Введение в хуки | — | 282 | cp×2, img×1, hex×2 |
| `24-huk-usestate.md` | Хук useState | — | 597 | cp×4, hex×4 |
| `25-huk-useeffect.md` | Хук useEffect | — | 817 | cp×2, hex×2 |
| `26-huk-usecontext.md` | Хук useContext | — | 741 | — |
| `27-huk-useref.md` | Хук useRef | — | 242 | cp×2, hex×2 |
| `28-huki-usecallback-i-usememo.md` | Хуки useCallback и useMemo | — | 1232 | img×1 |
| `29-kompoziciya-komponentov.md` | Композиция компонентов | — | 506 | — |
| `30-zaklyuchenie.md` | Заключение | — | 104 | — |

### `02-react-redux-toolkit` (plan: 11 lessons, PRs: 1)

**Actual:** 11 lessons | codepen files: 1 (2 refs) | IMG files: 5 (5 refs) | hexlet files: 5 (13 refs)

| File | Title | source | words | media/hexlet |
|------|-------|--------|-------|--------------|
| `01-vvedenie.md` | Введение | — | 352 | — |
| `02-redux.md` | Redux | — | 1001 | img×1 |
| `03-redyusery.md` | Редьюсеры | — | 621 | img×1, hex×1 |
| `04-midlvary.md` | Мидлвары | — | 1297 | img×1 |
| `05-podklyuchenie-redux-toolkit-k-react.md` | Подключение Redux Toolkit к React | — | 1206 | cp×2, img×1, hex×2 |
| `06-podrobnee-o-slaysah.md` | Подробнее о слайсах | — | 928 | img×1, hex×3 |
| `07-normalizaciya-dannyh-v-redux.md` | Нормализация данных в Redux | — | 476 | — |
| `08-mehanizm-entity-adapter.md` | Механизм Entity Adapter | — | 441 | — |
| `09-mehanizm-extrareducers.md` | Механизм ExtraReducers | — | 289 | hex×1 |
| `10-asinhronnye-zaprosy.md` | Асинхронные запросы | — | 1126 | hex×6 |
| `11-rtk-query.md` | RTK Query | — | 1691 | — |

---

## Timeline (plan)

| Block | Weeks |
|-------|-------|
| M4 all | 4–5 |
| M5 all | 2–3 |

## Exit criteria

```bash
rg -i hexlet content/theory/04-modul-4 content/theory/05-modul-5
python3 scripts/check-theory-lesson.py --module 04-modul-4 --only-rewritten
python3 scripts/check-theory-lesson.py --module 05-modul-5 --only-rewritten
```
