// @vitest-environment jsdom
// @ts-check

import React from 'react';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import BtnGroup from '../src/BtnGroup.jsx';

test('BtnGroup 1', async () => {
  render(<BtnGroup />);
  const leftBtn = screen.getByRole('button', { name: /left/i });
  const rightBtn = screen.getByRole('button', { name: /right/i });

  expect(leftBtn).not.toHaveClass('active');
  expect(rightBtn).not.toHaveClass('active');

  await userEvent.click(leftBtn);
  expect(leftBtn).toHaveClass('active');

  await userEvent.click(rightBtn);
  expect(rightBtn).toHaveClass('active');
  expect(leftBtn).not.toHaveClass('active');

  await userEvent.click(leftBtn);
  expect(leftBtn).toHaveClass('active');
  expect(rightBtn).not.toHaveClass('active');

  await userEvent.click(leftBtn);
  expect(leftBtn).toHaveClass('active');
  expect(rightBtn).not.toHaveClass('active');
});
