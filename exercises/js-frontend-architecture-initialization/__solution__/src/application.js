import i18next from 'i18next';
import en from './locales/en.js';
import ru from './locales/ru.js';

export default async (container, initialState = {}) => {
  const state = {
    language: { lng: 'en', ...initialState.language },
    data: { clicksCount: 0, ...initialState.data },
  };

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: state.language.lng,
    resources: { en, ru },
  });

  container.innerHTML = [
    '<div class="btn-group" role="group">',
    '<button type="button" class="btn mb-3 btn-primary"></button>',
    '<button type="button" class="btn mb-3 btn-outline-primary"></button>',
    '</div>',
    '<button type="button" class="btn btn-info mb-3 align-self-center"></button>',
    '<button type="button" class="btn btn-warning"></button>',
  ].join('');

  const [enButton, ruButton] = container.querySelectorAll('.btn-group button');
  const counterButton = container.querySelector('.btn-info');
  const resetButton = container.querySelector('.btn-warning');

  const render = () => {
    enButton.textContent = i18n.t('languages.en');
    ruButton.textContent = i18n.t('languages.ru');
    counterButton.textContent = i18n.t('counter.count', { count: state.data.clicksCount });
    resetButton.textContent = i18n.t('reset');
    enButton.classList.toggle('btn-primary', state.language.lng === 'en');
    enButton.classList.toggle('btn-outline-primary', state.language.lng !== 'en');
    ruButton.classList.toggle('btn-primary', state.language.lng === 'ru');
    ruButton.classList.toggle('btn-outline-primary', state.language.lng !== 'ru');
  };

  const switchLanguage = (lng) => async () => {
    state.language.lng = lng;
    await i18n.changeLanguage(lng);
    render();
  };

  enButton.addEventListener('click', switchLanguage('en'));
  ruButton.addEventListener('click', switchLanguage('ru'));
  counterButton.addEventListener('click', () => {
    state.data.clicksCount += 1;
    render();
  });
  resetButton.addEventListener('click', () => {
    state.data.clicksCount = 0;
    render();
  });

  render();
};
