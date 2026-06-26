---
title: "BOM-объекты"
module: "Модуль 4"
topic: "JS: DOM API"
buildin_id: f84380cd-e813-48e1-bb0b-a13899fcc9ae
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# BOM-объекты

- [Navigator](https://buildin.ai/f84380cd-e813-48e1-bb0b-a13899fcc9ae#dc992cd0-01e3-43c7-a47a-df831da7e25c)

- [Location](https://buildin.ai/f84380cd-e813-48e1-bb0b-a13899fcc9ae#4fcf99c2-bf74-4a46-a511-bba09612f350)

- [History](https://buildin.ai/f84380cd-e813-48e1-bb0b-a13899fcc9ae#2095d388-e658-429a-8c80-76341d51e574)

- [Fetch](https://buildin.ai/f84380cd-e813-48e1-bb0b-a13899fcc9ae#3266af4e-813b-402a-a0b3-a774f99e327c)

**BOM** (Browser Object Model) — объекты, через которые скрипт управляет браузером. Большинство из них доступны как свойства `window`. Ниже — самые частые.

<!-- IMG (из Buildin, перезалить отдельно) -->
### Navigator

Данные о браузере и окружении: user agent, язык, разрешения, список плагинов:

<!-- IMG (из Buildin, перезалить отдельно) -->
### Location

Работа с адресной строкой. Присвоение `href` загружает другой URL:

```
location.href = 'https://example.com'
```

<!-- IMG (из Buildin, перезалить отдельно) -->
### History

Переходы по истории вкладки. В SPA историю дополняют без полной перезагрузки страницы — через `history.pushState` и обработку `popstate`:

<!-- IMG (из Buildin, перезалить отдельно) -->
### Fetch

Современный способ [AJAX](https://ru.wikipedia.org/wiki/AJAX)-запросов — функция `fetch()`:

<!-- IMG (из Buildin, перезалить отдельно) -->
Подробнее — в уроке про сетевые запросы.

## Далее →
