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

![BOM-объекты — иллюстрация 1](course/theory/assets/restored/04-modul-4/03-js-dom-api/17-bom-obekty/1.png)
### Navigator

Данные о браузере и окружении: user agent, язык, разрешения, список плагинов:

![BOM-объекты — иллюстрация 2](course/theory/assets/restored/04-modul-4/03-js-dom-api/17-bom-obekty/2.png)
### Location

Работа с адресной строкой. Присвоение `href` загружает другой URL:

```
location.href = 'https://example.com'
```

![BOM-объекты — иллюстрация 3](course/theory/assets/restored/04-modul-4/03-js-dom-api/17-bom-obekty/3.png)
### History

Переходы по истории вкладки. В SPA историю дополняют без полной перезагрузки страницы — через `history.pushState` и обработку `popstate`:

![BOM-объекты — иллюстрация 4](course/theory/assets/restored/04-modul-4/03-js-dom-api/17-bom-obekty/4.png)
### Fetch

Современный способ [AJAX](https://ru.wikipedia.org/wiki/AJAX)-запросов — функция `fetch()`:

![BOM-объекты — иллюстрация 5](course/theory/assets/restored/04-modul-4/03-js-dom-api/17-bom-obekty/5.png)
Подробнее — в уроке про сетевые запросы.

## Далее →
