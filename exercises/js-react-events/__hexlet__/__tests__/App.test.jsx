// @ts-check

import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carousel from '../src/Carousel.jsx'

test('Carousel', async () => {
  const images = ['/images/first.jpeg', '/images/second.jpeg', '/images/third.jpeg']
  const vdom = <Carousel images={images} />
  const { asFragment } = render(vdom)
  expect(asFragment()).toMatchSnapshot()

  // const next = wrapper.find('.carousel-control-next');
  const next = () => screen.getByRole('button', { name: 'Next' })
  const prev = () => screen.getByRole('button', { name: 'Previous' })
  // const prev = wrapper.find('.carousel-control-prev');

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(prev())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(prev())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(prev())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(prev())
  expect(asFragment()).toMatchSnapshot()
})

test('Carousel 2', async () => {
  const images = ['/images/1.jpeg', '/images/2.jpeg', '/images/3.jpeg']
  const vdom = <Carousel images={images} />
  const { asFragment } = render(vdom)
  expect(asFragment()).toMatchSnapshot()

  const next = () => screen.getByText('Next')

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(next())
  expect(asFragment()).toMatchSnapshot()
})
