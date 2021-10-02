import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DOMParserReact from '../src'
import { createDom } from '../src/server'

it('renders server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source={createDom('<div class="html">serverside text</div>')} />
  )

  expect(markup).toBe('<div class="html">serverside text</div>')
})
