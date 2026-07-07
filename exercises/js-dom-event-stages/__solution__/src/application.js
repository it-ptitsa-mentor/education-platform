// @ts-check

export default () => {
  const root = document.querySelector('.root');
  const table = document.createElement('table');

  for (let r = 0; r < 3; r += 1) {
    const row = table.insertRow();
    for (let c = 0; c < 3; c += 1) {
      const cell = row.insertCell();
      const span = document.createElement('span');
      span.classList.add('invisible');
      span.textContent = 's';
      cell.append(span);
    }
  }

  let current = 'x';
  table.addEventListener('click', (event) => {
    const cell = event.target.closest('td');
    if (!cell || cell.textContent !== 's') {
      return;
    }
    cell.textContent = current;
    current = current === 'x' ? 'o' : 'x';
  });

  root.append(table);
};
