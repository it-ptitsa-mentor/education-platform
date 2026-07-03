export default (companies) => {
  const container = document.querySelector('.container');
  const state = { selected: null };

  const render = () => {
    const oldDescription = container.querySelector('div');
    if (oldDescription) {
      oldDescription.remove();
    }
    if (state.selected !== null) {
      const description = document.createElement('div');
      description.textContent = state.selected.description;
      container.append(description);
    }
  };

  companies.forEach((company) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = company.name;
    button.addEventListener('click', () => {
      state.selected = state.selected === company ? null : company;
      render();
    });
    container.append(button);
  });
};
