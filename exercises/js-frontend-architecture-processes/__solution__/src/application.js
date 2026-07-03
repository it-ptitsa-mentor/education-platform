export default () => {
  const containers = document.querySelectorAll('[data-editable-target]');

  containers.forEach((container) => {
    const field = container.dataset.editableTarget;
    const state = { value: '', editing: false };

    const renderText = () => {
      state.editing = false;
      container.innerHTML = '';
      if (state.value === '') {
        const placeholder = document.createElement('i');
        placeholder.textContent = field;
        container.append(placeholder);
        return;
      }
      container.textContent = state.value;
    };

    const renderForm = () => {
      state.editing = true;
      container.innerHTML = '';
      const form = document.createElement('form');

      const label = document.createElement('label');
      label.classList.add('visually-hidden');
      label.setAttribute('for', field);
      label.textContent = field;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = field;
      input.name = field;
      input.value = state.value;

      const submit = document.createElement('input');
      submit.type = 'submit';
      submit.value = `Save ${field}`;

      form.append(label, input, submit);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        state.value = input.value;
        renderText();
      });
      container.append(form);
      input.focus();
      if (state.value !== '') {
        input.select();
      }
    };

    container.addEventListener('click', () => {
      if (!state.editing) {
        renderForm();
      }
    });

    renderText();
  });
};
