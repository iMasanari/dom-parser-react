import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DOMParserReact from '../src'

it('renders element for server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source={'<div class="html">serverside text</div>'} />
  )

  expect(markup).toBe('<div class="html">serverside text</div>')
})

it('renders elements for server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source={'<div>serverside text</div><p>test</p>'} />
  )

  expect(markup).toBe('<div>serverside text</div><p>test</p>')
})
