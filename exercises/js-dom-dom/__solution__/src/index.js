// @ts-check

const lines = document.body.textContent
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

document.body.innerHTML = lines.map((line) => `<p>${line}</p>`).join('');
