// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import prettify from '../src/prettify.js'

test('prettify paragraph', () => {
  const expected = '<p>Text</p>'
  document.documentElement.innerHTML = expected
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})

test('prettify text in div', () => {
  const expected = '<div><p>Text</p></div>'
  document.documentElement.innerHTML = '<div>Text</div>'
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})

test('prettify multiple text nodes in multiple divs', () => {
  const expected = 'Text<div><div><p>Text</p></div><p>Op</p></div><div><p>My</p></div>'
  document.documentElement.innerHTML = 'Text<div><div>Text</div><p>Op</p></div><div>My</div>'
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})

test('prettify with different levels', () => {
  const expected = `Text
  <div>
    <div><p>Text</p></div>
    <p>Op</p>
  </div>
  <div><p>My</p></div>`
  document.documentElement.innerHTML = `Text
  <div>
    <div>Text</div>
    <p>Op</p>
  </div>
  <div>My</div>`
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})

test('prettify complex tree', () => {
  const expected = `Text
  <div>
    <div><p>complex</p><div><p>test</p></div></div>
    <div><p>Text</p></div>
    <p>Op</p>
  </div>
  <div><p>My</p></div>`
  document.documentElement.innerHTML = `Text
  <div>
    <div>complex<div>test</div></div>
    <div>Text</div>
    <p>Op</p>
  </div>
  <div>My</div>`
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})

test('prettify text and paragraph in same div', () => {
  const expected = '<div><p>text1</p><p>something</p><p>text2</p></div>'
  document.documentElement.innerHTML = '<div>text1<p>something</p>text2</div>'
  prettify(document)
  expect(document.body.innerHTML).toEqual(expected)
})
