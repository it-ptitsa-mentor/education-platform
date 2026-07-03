const filterFunctions = {
  processor_eq: (laptop, value) => laptop.processor === value,
  memory_eq: (laptop, value) => laptop.memory === parseInt(value, 10),
  frequency_gte: (laptop, value) => laptop.frequency >= parseFloat(value),
  frequency_lte: (laptop, value) => laptop.frequency <= parseFloat(value),
};

export default (laptops) => {
  const form = document.querySelector('form');
  const result = document.querySelector('.result');
  const state = {
    filters: {
      processor_eq: '',
      memory_eq: '',
      frequency_gte: '',
      frequency_lte: '',
    },
  };

  const render = () => {
    const activeFilters = Object.entries(state.filters)
      .filter(([, value]) => value !== '');
    const filtered = laptops.filter(
      (laptop) => activeFilters.every(
        ([name, value]) => filterFunctions[name](laptop, value),
      ),
    );
    result.innerHTML = '';
    if (filtered.length === 0) {
      return;
    }
    const ul = document.createElement('ul');
    filtered.forEach((laptop) => {
      const li = document.createElement('li');
      li.textContent = laptop.model;
      ul.append(li);
    });
    result.append(ul);
  };

  Object.keys(state.filters).forEach((name) => {
    const element = form.elements[name];
    const eventName = element.tagName === 'SELECT' ? 'change' : 'input';
    element.addEventListener(eventName, (event) => {
      state.filters[name] = event.target.value;
      render();
    });
  });

  render();
};
