import axios from 'axios';
import routes from './routes.js';

export default async () => {
  const form = document.querySelector('form');
  const input = form.querySelector('input[name="name"]');
  const list = document.querySelector('#tasks');

  const state = { tasks: [] };

  const render = () => {
    list.innerHTML = '';
    state.tasks.forEach((task) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = task.name;
      list.append(li);
    });
  };

  const response = await axios.get(routes.tasksPath());
  state.tasks = response.data.items;
  render();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = input.value;
    await axios.post(routes.tasksPath(), { name });
    state.tasks.unshift({ name });
    form.reset();
    render();
  });
};
