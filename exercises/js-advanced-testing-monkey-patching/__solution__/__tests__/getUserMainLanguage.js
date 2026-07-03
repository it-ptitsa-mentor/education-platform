import { afterEach, expect, test, vi } from 'vitest';
import getUserMainLanguage from '../getUserMainLanguage.js';

const stubFetch = (data) => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => data })));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

test('определяет основной язык пользователя', async () => {
  stubFetch([{ language: 'php' }, { language: 'javascript' }, { language: 'php' }]);
  expect(await getUserMainLanguage('user')).toBe('php');
  expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/user/repos');
});

test('возвращает null для пользователя без репозиториев', async () => {
  stubFetch([]);
  expect(await getUserMainLanguage('user')).toBeNull();
});
