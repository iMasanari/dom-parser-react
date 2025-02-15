import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import DOMParserReact from '../src'

it('renders element for server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source='<div class="html">serverside text</div>' />
  )

  expect(markup).toBe('<div class="html">serverside text</div>')
})

it('renders elements for server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source='<div class="html">serverside text</div><p>test</p>' />
  )

  expect(markup).toBe('<div class="html">serverside text</div><p>test</p>')
})

it('renders components for server', () => {
  const components = {
    div: ({ children, ...props }: any) => (
      <div {...props} className={`div ${props.className}`}>
        <span className="span">{children}</span>
      </div>
    ),
  }

  const markup = renderToStaticMarkup(
    <DOMParserReact source='<div class="text">components</div>' components={components} />
  )

  expect(markup).toBe('<div class="div text"><span class="span">components</span></div>')
})

it('renders table parts content for server', () => {
  const markup = renderToStaticMarkup(
    <DOMParserReact source='<td class="table">serverside text</td>' />
  )

  expect(markup).toBe('<td class="table">serverside text</td>')
})
