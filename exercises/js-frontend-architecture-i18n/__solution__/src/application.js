import i18next from 'i18next';
import en from './locales/en.js';
import ru from './locales/ru.js';

export default async () => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: 'en',
    resources: { en, ru },
  });

  const state = { lng: 'en', clicksCount: 0 };

  const [enButton, ruButton] = document.querySelectorAll('.btn-group button');
  const counterButton = document.querySelector('.btn-info');
  const resetButton = document.querySelector('.btn-warning');

  const render = () => {
    enButton.textContent = i18n.t('languages.en');
    ruButton.textContent = i18n.t('languages.ru');
    counterButton.textContent = i18n.t('counter.count', { count: state.clicksCount });
    resetButton.textContent = i18n.t('reset');
    enButton.classList.toggle('btn-primary', state.lng === 'en');
    enButton.classList.toggle('btn-outline-primary', state.lng !== 'en');
    ruButton.classList.toggle('btn-primary', state.lng === 'ru');
    ruButton.classList.toggle('btn-outline-primary', state.lng !== 'ru');
  };

  const switchLanguage = (lng) => async () => {
    state.lng = lng;
    await i18n.changeLanguage(lng);
    render();
  };

  enButton.addEventListener('click', switchLanguage('en'));
  ruButton.addEventListener('click', switchLanguage('ru'));

  counterButton.addEventListener('click', () => {
    state.clicksCount += 1;
    render();
  });

  resetButton.addEventListener('click', () => {
    state.clicksCount = 0;
    render();
  });

  render();
};
