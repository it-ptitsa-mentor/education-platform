import { expect, test } from 'vitest';
import getUserMainLanguage from '../getUserMainLanguage.js';
import OctokitFake from '../support/OctokitFake.js';

test('определяет основной язык пользователя', async () => {
  const data = [
    { language: 'php' },
    { language: 'javascript' },
    { language: 'php' },
  ];
  const client = new OctokitFake(data);
  expect(await getUserMainLanguage('user', client)).toBe('php');
});

test('возвращает null для пользователя без репозиториев', async () => {
  const client = new OctokitFake([]);
  expect(await getUserMainLanguage('user', client)).toBeNull();
});
