// @ts-check

export default () => {
  const toggles = document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();

      const nav = toggle.closest('.nav');
      nav.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
      toggle.classList.add('active');

      const pane = document.querySelector(toggle.dataset.bsTarget);
      const content = pane.closest('.tab-content');
      content.querySelectorAll('.tab-pane').forEach((item) => item.classList.remove('active'));
      pane.classList.add('active');
    });
  });
};
