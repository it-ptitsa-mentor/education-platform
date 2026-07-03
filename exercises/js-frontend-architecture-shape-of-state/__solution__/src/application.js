export default () => {
  const listsContainer = document.querySelector('[data-container="lists"]');
  const tasksContainer = document.querySelector('[data-container="tasks"]');
  const newListForm = document.querySelector('[data-container="new-list-form"]');
  const newTaskForm = document.querySelector('[data-container="new-task-form"]');

  const state = {
    lists: [{ id: 1, name: 'General' }],
    currentListId: 1,
    tasks: [],
    nextListId: 2,
  };

  const renderTasks = () => {
    tasksContainer.innerHTML = '';
    const tasks = state.tasks.filter((task) => task.listId === state.currentListId);
    if (tasks.length === 0) {
      return;
    }
    const ul = document.createElement('ul');
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.textContent = task.name;
      ul.append(li);
    });
    tasksContainer.append(ul);
  };

  const renderLists = () => {
    listsContainer.innerHTML = '';
    const ul = document.createElement('ul');
    state.lists.forEach((list) => {
      const li = document.createElement('li');
      if (list.id === state.currentListId) {
        const b = document.createElement('b');
        b.textContent = list.name;
        li.append(b);
      } else {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = list.name;
        a.addEventListener('click', (event) => {
          event.preventDefault();
          state.currentListId = list.id;
          renderLists();
          renderTasks();
        });
        li.append(a);
      }
      ul.append(li);
    });
    listsContainer.append(ul);
  };

  newListForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = newListForm.elements.name.value;
    state.lists.push({ id: state.nextListId, name });
    state.nextListId += 1;
    newListForm.reset();
    renderLists();
  });

  newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = newTaskForm.elements.name.value;
    state.tasks.push({ listId: state.currentListId, name });
    newTaskForm.reset();
    renderTasks();
  });

  renderLists();
  renderTasks();
};
