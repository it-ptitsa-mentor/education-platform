import { afterEach, expect, test, vi } from 'vitest';
import getUserMainLanguage from '../getUserMainLanguage.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('определяет основной язык пользователя', async () => {
  // Добавьте правильные данные в мок fetch, чтобы тест прошел
  vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => [] })));

  const result = await getUserMainLanguage('user');
  expect(result).toBe('php');
});
