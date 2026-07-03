export default () => {
  const form = document.querySelector('form');
  const input = document.querySelector('input[type=number]');
  const resetButton = document.querySelector('button');
  const result = document.querySelector('#result');

  let sum = 0;

  const render = () => {
    result.textContent = sum;
    form.reset();
    input.focus();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sum += parseInt(input.value, 10) || 0;
    render();
  });

  resetButton.addEventListener('click', () => {
    sum = 0;
    render();
  });

  render();
};
