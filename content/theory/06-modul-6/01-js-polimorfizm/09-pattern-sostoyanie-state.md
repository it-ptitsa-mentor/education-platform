---
title: "Паттерн Состояние (State)"
module: "Модуль 6"
topic: "JS: Полиморфизм"
buildin_id: 7f5b57ff-5e02-480c-bf67-110bf0d7ec16
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Паттерн Состояние (State)

Паттерн «Состояние» — наглядная замена `if` полиморфизмом подтипов. Его часто применяют, когда нужно реально снизить сложность. Разберём на поведении экрана телефона.

*Модели телефонов различаются; для урока взят один конкретный сценарий.*

Три базовых режима:

1. Телефон выключен. Экран не реагирует на прикосновения.

1. Телефон включен, экран погашен. Прикосновение (не смахивание) включает экран.

1. Телефон и экран включены. Реакция на жесты зависит от активного приложения.

Смоделируем это в классе экрана с событиями touch и swipe:

```
class MobileScreen {
  constructor() {
    // В самом начале телефон выключен
    this.powerOn = false
    this.screenOn = false
  }

  // Включение питания
  powerOn() {
    this.powerOn = true
  }

  // Прикосновение
  touch() {
    // Если питание выключено, то ничего не происходит
    if (!this.powerOn) {
      return
    }

    // Если экран был выключен, то его надо включить
    if (!this.screenOn) {
      this.screenOn = true
    }

    // На событие должно реагировать текущее активное приложение
    this.notify('touch')
  }

  // Смахивание
  swipe() {
    // Если выключено питание или экран, то ничего не происходит
    if (!this.powerOn || !this.screenOn) {
      return
    }

    // На событие должно реагировать текущее активное приложение
    this.notify('swipe')
  }
}
```

Два события — уже много ветвлений. В реальности событий больше, и каждое должно учитывать питание и экран.

«В лоб» получится лавина `if` в каждом обработчике. Код хрупкий: новые состояния и события — источник багов, картину целиком удержать трудно.

Сложность снижают два шага: явное состояние и полиморфизм подтипов.

## Явно выделенное состояние

Сейчас экран держится на флагах — булевых переменных:

```
constructor() {
  this.powerOn = false;
  this.screenOn = false;
}
```

Флаги часто (не всегда) сигналят о слабой архитектуре: их множат и комбинируют. Логика на пересечении флагов усложняет анализ:

```
if (!this.powerOn || !this.screenOn) {
  return
}
```

Такой стиль называют «флаговым программированием». Состояний обычно больше двух — одного флага мало.

Выход — одна переменная с именем состояния. У нас три:

- Power Off: питание отключено (экран тоже).

- Screen Disabled: питание есть, экран погашен.

- Screen On: экран активен.

```
class MobileScreen {
  constructor() {
    this.stateName = 'powerOff'
  }

  powerOn() {
    this.stateName = 'screenDisabled'
  }

  touch() {
    if (this.stateName === 'powerOff') {
      return
    }

    if (this.stateName === 'screenDisabled') {
      this.stateName = 'screenOn'
    }

    this.notify('touch')
  }

  swipe() {
    if (this.stateName !== 'screenOn') {
      return
    }

    // На событие должно реагировать текущее активное приложение
    this.notify('swipe')
  }
}
```

Проверки комбинаций флагов исчезли. Состояния читаются проще, чем набор булевых полей.

## Классы Состояний

Чтобы убрать `if`, нужен полиморфизм. Явное состояние показывает: поведение зависит от режима — значит, режимы оформляем отдельными классами.

Экран перестаёт ветвиться и делегирует текущему состоянию:

```
import PowerOffState from './states/PowerOffState.js'
import ScreenDisabledState from './states/ScreenDisabledState.js'
import ScreenOnState from './states/ScreenOnState.js'

class MobileScreen {
  constructor() {
    // Список состояний нужен для переключений между ними
    // Иначе возможно появление циклических зависимостей внутри состояний
    this.states = {
      powerOff: PowerOffState,
      screenDisabled: ScreenDisabledState,
      screenOn: ScreenOnState,
    }
    // Начальное состояние
    // Внутрь передается текущий объект
    // Это нужно для смены состояний (примеры ниже)
    this.state = new this.states.powerOff(this)
  }

  powerOn() {
    // Предыдущее состояние нас не волнует
    // Все данные хранятся в самом экране
    // Объекты-состояния не имеют своих данных
    this.state = new this.states.screenDisabled(this)
  }

  touch() {
    this.state.touch()
  }

  swipe() {
    this.state.swipe()
  }
}

// Обратите внимание что с точки зрения внешнего кода (пользователя экрана)
// ничего не изменилось.
```

Экран почти пустой: стартовое состояние и делегирование. Классы состояний:

```
class PowerOffState {
  constructor(screen) {
    this.screen = screen
  }

  touch() {
    // ничего не происходит
  }

  swipe() {
    // ничего не происходит
  }
}
```

Выключенный телефон не реагирует. `ScreenDisabledState`:

```
class ScreenDisabledState {
  constructor(screen) {
    this.screen = screen
  }

  touch() {
    // Включаем экран. В конструктор нужно передать сам экран.
    this.screen.state = new this.screen.states.screenOn(this.screen)
    // Оповещаем текущую программу об активации
    this.screen.notify('touch')
  }

  swipe() {
    // ничего не происходит
  }
}
```

Touch переводит в `ScreenOnState` — поэтому в состояние передают ссылку на экран.

`ScreenOnState` — единственное, где жесты доходят до приложений:

```
class ScreenOnState {
  constructor(screen) {
    this.screen = screen
  }

  touch() {
    this.screen.notify('touch')
  }

  swipe() {
    this.screen.notify('swipe')
  }
}
```

Условных конструкций не осталось. Поведение в каждом режиме видно в своём классе. Цена — больше файлов и строк.

Главное: классы состояний дают полиморфизм, но не хранят бизнес-данные. Воздействие в итоге идёт на сам экран — сущность, которую упрощаем.

## Далее →
