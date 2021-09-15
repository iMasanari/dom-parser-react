# DomParserReact

A small parser that converts HTML to React using the DOMParser API.

## Usage

```jsx
import React from 'react'
import DomParserReact, { parse } from 'dom-parser-react'
// import { renderToStaticMarkup as render } from 'react-dom/server'

const App = () =>
  <DomParserReact source="<h1>HTML Text</h1>" />

render(<App />) // `<h1>HTML Text</h1>`

// or

const contents = parse("<h1>HTML Text for parse API</h1>", {
  createElement: React.createElement,
  Fragment: React.Fragment,
})

render(<>{contents}</>) // `<h1>HTML Text</h1>`
```


### Custom Components

```jsx
import React from 'react'
import DomParserReact from 'dom-parser-react'
// import { renderToStaticMarkup as render } from 'react-dom/server'

const Title = (props) =>
  <div className="title">
    <h1 {...props} />
  </div>

const App = () =>
  <DomParserReact source="<h1>HTML Text</h1>" components={{ h1: Title }} />

render(<App />) // `<div class="title"><h1>HTML Text</h1></div>`
```

## Universal JavaScript (Browser & Node.js)

```jsx
import React from 'react'
import DomParserReact from 'dom-parser-react'
import { createDom } from 'dom-parser-react/server'

const htmlText = '<h1>HTML Text</h1>'

const App = () =>
  <DomParserReact
    source={typeof window === 'object' ? htmlText : createDom(htmlText)}
  />
```
