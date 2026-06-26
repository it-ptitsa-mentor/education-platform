---
title: "Введение"
module: "Модуль 4"
topic: "JS: Архитектура фронтенда"
buildin_id: b90b8887-0f78-45cf-b7c8-1a9f4d230b22
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Введение

JavaScript и DOM — необходимый фундамент, но для полноценных приложений этого мало. Без дисциплины архитектуры прямая работа с DOM быстро превращает код в неподдерживаемую кашу.

Для маленького виджета на jQuery хватает импровизации. SPA с десятками экранов на тех же приёмах ломается: связи между данными и интерфейсом становятся непрозрачными.

Паттерны вроде MVC и явного state старше React и Vue; в модуле смотрим на них «в чистом виде», без синтаксиса конкретного фреймворка. Многие идеи появились ещё в эпоху первых графических интерфейсов.

Поэтому темы даются на ванильном JS: понимание ролей Model / View / Controller переносится на любой стек.

Основные темы этого курса:

- Управление состоянием и его организация

- Model-View-Controller

- Контролируемые и не контролируемые формы

- Автоматное программирование

- Работа с текстами. Интернационализация, локализация, плюрализация

Чтобы эффективно изучать материалы этого курса, у вас должно быть представление о том, как работает JavaScript в браузере. Нужны базовые навыки: DOM, события и асинхронные запросы — как в примере ниже:

```
document.getElementById("addTaskButton").addEventListener("click", async function() {
    const taskInput = document.getElementById("taskInput")
    const taskText = taskInput.value.trim()

    if (taskText) {
        // Отправка задачи на сервер
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: taskText,
                completed: false
            })
        })

        const newTask = await response.json()
        addTaskToDOM(newTask.title, newTask.id)
        taskInput.value = ""
    }
})
```

### Далее →
