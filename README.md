[![npm version](https://badge.fury.io/js/dom-parser-react.svg)](https://badge.fury.io/js/dom-parser-react)
[![Tests](https://github.com/iMasanari/dom-parser-react/actions/workflows/tests.yml/badge.svg)](https://github.com/iMasanari/dom-parser-react/actions/workflows/tests.yml)

# DOMParserReact

A small parser that converts HTML to React using the DOMParser API.

## Install

```bash
npm i dom-parser-react react
# or
yarn add dom-parser-react react
```

For use with Node.js (e.g., SSR / SSG), install `jsdom` additionally.

## Usage

```jsx
import React from 'react'
import DOMParserReact, { parse } from 'dom-parser-react'
// import { renderToStaticMarkup as render } from 'react-dom/server'

const App = () =>
  <DOMParserReact source="<h1>HTML Text</h1>" />

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
import DOMParserReact from 'dom-parser-react'
// import { renderToStaticMarkup as render } from 'react-dom/server'

const Title = (props) =>
  <div className="title">
    <h1 {...props} />
  </div>

const App = () =>
  <DOMParserReact source="<h1>HTML Text</h1>" components={{ h1: Title }} />

render(<App />) // `<div class="title"><h1>HTML Text</h1></div>`
```
