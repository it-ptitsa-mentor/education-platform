import axios from 'axios'

// Список добавленных задач GET
const response = await axios.get(routes.tasksPath())
// response.data содержит объект: { items: [{ name: 'имя задачи' }, { ... }]  }

// Добавление новой задачи POST
const response = await axios.post(routes.tasksPath(), data) // Где data это { name: 'имя задачи' }
// response.status содержит 201 в случае успеха