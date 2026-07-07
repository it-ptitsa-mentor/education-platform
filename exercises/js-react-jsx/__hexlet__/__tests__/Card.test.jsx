// tests/Card.test.jsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import getCard from '../src/Card.jsx'

describe('getCard snapshots', () => {
  it('Card 1: title and text', () => {
    const vdom = getCard({ title: 'title 1', text: 'text 1' })
    const { container } = render(vdom)
    expect(prettyDOM(container)).toMatchSnapshot()
  })

  it('Card 2: different title and text', () => {
    const vdom = getCard({ title: 'title 2', text: 'text 2' })
    const { container } = render(vdom)

    expect(prettyDOM(container)).toMatchSnapshot()
  })

  it('Card 3: empty params returns null', () => {
    const vdom = getCard({})
    expect(vdom).toBeNull()
  })

  it('Card 4: only title', () => {
    const vdom = getCard({ title: 'title 1' })
    const { container } = render(vdom)

    expect(prettyDOM(container)).toMatchSnapshot()
  })

  it('Card 5: only text', () => {
    const vdom = getCard({ text: 'text 1' })
    const { container } = render(vdom)

    expect(prettyDOM(container)).toMatchSnapshot()
  })
})
