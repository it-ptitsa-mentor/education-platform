// @ts-check

export default () => {
  const form = document.querySelector('.feedback-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const result = document.createElement('div');
    const lines = [
      'Feedback has been sent',
      `Email: ${data.get('email')}`,
      `Name: ${data.get('name')}`,
      `Comment: ${data.get('comment')}`,
    ];
    lines.forEach((text) => {
      const line = document.createElement('div');
      line.textContent = text;
      result.append(line);
    });

    form.replaceWith(result);
  });
};
