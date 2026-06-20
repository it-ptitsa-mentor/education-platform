// Внутри async функции
// Выполнение GET запроса по указанному адресу
const response = await axios.get('https://hexlet.io/lessons?page=2')
// response содержит http-ответ