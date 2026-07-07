// @ts-check

export default () => {
  const button = document.getElementById('alert-generator');
  const container = document.querySelector('.alerts');
  let count = 0;

  button.addEventListener('click', () => {
    count += 1;
    const alert = document.createElement('div');
    alert.classList.add('alert', 'alert-primary');
    alert.textContent = `Alert ${count}`;
    container.prepend(alert);
  });
};
