// @vitest-environment jsdom

import { createElement } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { expect, it, vi, beforeEach, afterEach } from 'vitest'
import DOMParserReact from '../src'

vi.mock('jsdom', () => ({ JSDOM: undefined }))

declare global {
  interface Window {
    IS_REACT_ACT_ENVIRONMENT: unknown
  }
}

window.IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement = null!
let root: Root = null!

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container!)
})

afterEach(() => {
  // cleanup on exiting
  act(() => root.unmount())
  root = null!
  container!.remove()
  container = null!
})

it('renders html text', () => {
  act(() => {
    root.render(<DOMParserReact source={'<div class="html">html text</div>'} />)
  })

  expect(container!.innerHTML).toBe('<div class="html">html text</div>')

  act(() => {
    root.render(<DOMParserReact source="<div>html text 2" />)
  })

  expect(container!.innerHTML).toBe('<div>html text 2</div>')
})

it('renders styles', () => {
  act(() => {
    root.render(<DOMParserReact source={'<div style="padding: 10px;"></div>'} />)
  })

  expect(container!.innerHTML).toBe('<div style="padding: 10px;"></div>')
})

it('renders input list', () => {
  act(() => {
    root.render(<DOMParserReact source={'<input list="list" /><datalist id="list"></datalist>'} />)
  })

  expect(container!.innerHTML).toBe('<input list="list"><datalist id="list"></datalist>')
})

it('renders a ref', () => {
  act(() => {
    root.render(<DOMParserReact source={'<a href="./link">link</a>'} />)
  })

  expect(container!.innerHTML).toBe('<a href="./link">link</a>')
})

it('renders boolean value', () => {
  act(() => {
    root.render(<DOMParserReact source="<input readonly checked />" />)
  })

  expect(container!.innerHTML).toBe('<input readonly="" checked="">')
})

it('renders components', () => {
  const components = {
    div: ({ children, ...props }: any) => (
      <div {...props} className={`div ${props.className}`}>
        <span className="span">{children}</span>
      </div>
    ),
  }

  act(() => {
    root.render(<DOMParserReact source={'<div class="text">components</div>'} components={components} />)
  })

  expect(container!.innerHTML).toBe(
    '<div class="div text"><span class="span">components</span></div>'
  )
})

it('renders svg text', () => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M19 12H6M12 5l-7 7 7 7"></path>
</svg>
`.trim()

  act(() => {
    root.render(<DOMParserReact source={svg} />)
  })

  expect(container!.innerHTML).toBe(svg)
})
