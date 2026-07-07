// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import MyForm from '../src/MyForm.jsx'

test('MyForm', async () => {
  const { asFragment } = render(<MyForm />)

  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /address/i })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /city/i })).toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: /country/i })).toBeInTheDocument()
  expect(screen.getByRole('checkbox', { name: /accept rules/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

  expect(asFragment()).toMatchSnapshot()
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /back/i }))
  expect(screen.getByRole('form')).toHaveFormValues({
    acceptRules: false,
    address: '',
    city: '',
    country: '',
    email: '',
    password: '',
  })

  await userEvent.click(screen.getByRole('checkbox', { name: /accept rules/i }))
  await userEvent.type(screen.getByRole('textbox', { name: /city/i }), 'My City')
  await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@email.com')
  await userEvent.type(screen.getByLabelText(/password/i), 'mysuperpass')
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /country/i }), ['russia'])
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(screen.getByRole('button', { name: /back/i }))

  expect(screen.getByRole('form')).toHaveFormValues({
    acceptRules: true,
    address: '',
    city: 'My City',
    country: 'russia',
    email: 'test@email.com',
    password: 'mysuperpass',
  })
})
