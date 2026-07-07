// @ts-check

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080', {
    waitUntil: 'domcontentloaded',
  });
});

test('i18n', async ({ page }) => {
  await page.locator('button', { hasText: /^Factorial 1$/ }).click();
  await expect(await page.locator('text=Factorial of 1 is 1')).toHaveCount(1);

  await page.locator('button', { hasText: /^Factorial 5$/ }).click();
  await expect(await page.locator('text=Factorial of 5 is 120')).toHaveCount(1);

  await page.locator('button', { hasText: /^Factorial 10$/ }).click();
  await expect(await page.locator('text=Factorial of 10 is 3628800')).toHaveCount(1);

  await page.locator('button', { hasText: /^Factorial 20$/ }).click();
  await expect(await page.locator('text=Factorial of 20 is 2432902008176640000')).toHaveCount(1);

  await page.locator('button', { hasText: /^Русский$/ }).click();
  await page.locator('button', { hasText: /^Факториал 10$/ }).click();
  await expect(await page.locator('text=Factorial of 10 is 3628800')).toHaveCount(1);
});
