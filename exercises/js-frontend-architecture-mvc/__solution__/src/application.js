export default () => {
  document.querySelectorAll('.list-group a').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      const group = tab.closest('.list-group');
      group.querySelectorAll('a').forEach((link) => {
        link.classList.remove('active');
        const pane = document.querySelector(link.getAttribute('href'));
        pane.classList.remove('active', 'show');
      });
      tab.classList.add('active');
      const pane = document.querySelector(tab.getAttribute('href'));
      pane.classList.add('active', 'show');
    });
  });
};
