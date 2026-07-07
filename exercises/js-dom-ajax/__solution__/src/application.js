// @ts-check

export default () => {
  const inputs = document.querySelectorAll('[data-autocomplete]');

  inputs.forEach((input) => {
    const url = input.dataset.autocomplete;
    const name = input.dataset.autocompleteName;
    const list = document.querySelector(`ul[data-autocomplete-name="${name}"]`);

    input.addEventListener('input', async () => {
      const response = await fetch(url);
      const items = await response.json();

      list.innerHTML = '';
      const values = Array.isArray(items) && items.length > 0 ? items : ['Nothing'];
      values.forEach((value) => {
        const item = document.createElement('li');
        item.textContent = value;
        list.append(item);
      });
    });
  });
};
