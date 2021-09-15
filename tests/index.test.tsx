/**
 * @jest-environment jsdom
 */

import { createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import DomParserReact from '../src'

let container: HTMLDivElement | null = null

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!)
  container!.remove()
  container = null
})

it('renders html text', () => {
  act(() => {
    render(<DomParserReact source={'<div class="html">html text</div>'} />, container)
  })

  expect(container!.innerHTML).toBe('<div class="html">html text</div>')

  act(() => {
    render(<DomParserReact source="<div>html text 2" />, container)
  })

  expect(container!.innerHTML).toBe('<div>html text 2</div>')
})

it('renders DOM', () => {
  const dom = document.createElement('div')
  dom.textContent = 'dom text'
  dom.className = 'dom'

  act(() => {
    render(<DomParserReact source={dom} />, container)
  })

  expect(container!.innerHTML).toBe('<div class="dom">dom text</div>')
})

it('renders styles', () => {
  act(() => {
    render(<DomParserReact source={'<div style="padding: 10px;"></div>'} />, container)
  })

  expect(container!.innerHTML).toBe('<div style="padding: 10px;"></div>')
})

it('renders components', () => {
  const source = '<div class="text">components</div>'

  const components = {
    div: ({ children, ...props }: any) => (
      <div {...props} className={`div ${props.className}`}>
        <span className="span">{children}</span>
      </div>
    ),
  }

  act(() => {
    render(<DomParserReact source={source} components={components} />, container)
  })

  expect(container!.innerHTML).toBe(
    '<div class="div text"><span class="span">components</span></div>'
  )
})
