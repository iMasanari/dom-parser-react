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

### Sanitize

DOMParserReact does not sanitize HTML. Please use text that has been sanitized beforehand.

```jsx
import DOMParserReact from 'dom-parser-react'
import DOMPurify from 'dompurify'

const sanitized = DOMPurify.sanitize(`<a href="javascript:alert('xxx')">HTML Text</a>`)

const App = () =>
  <DOMParserReact source={sanitized} />
```

## API

### `<DOMParserReact {...props} />`

HTML 文字列を React 要素に変換します。

#### Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `source` | `string` | 変換する HTML 文字列。 |
| `components?` | `Record<string, React.ComponentType> \| undefined` | HTML 要素を React コンポーネントで置き換えます。「Custom Components」参照。 |
| `domParser?` | `((source: string) => Document) \| undefined` | Document 変換に使われるパーサー。デフォルトでは `DOMParser` を使用した変換が行われ、サニタイズは実施されません。 |
| `createElement?` | `typeof React.createElement \| undefined` | `React.createElement` を変更する場合は指定してください。 |
| `Fragment?` | `React.ComponentType \| string \| undefined` | `React.Fragment` を変更する場合は指定してください。 |
| `deps?` | `unknown[]` | 変換結果のメモ化の依存配列。デフォルトは `[props.source]` です。 |

#### Returns

`JSX.Element`

`props.source` を React 変換した結果を返します。

#### Example

```jsx
import DOMParserReact from 'dom-parser-react'

const App = () =>
  <DOMParserReact source="<h1>HTML Text</h1>" />
```

### `parse(source, options)`

HTML 文字列を React 要素に変換します。

#### Paramaters

| Paramater | Type | Description |
| :-- | :-- | :-- |
| `source` | `string` | 変換する HTML 文字列。 |
| `options` | `object` | 変換設定。 |

#### Options

| Paramater | Type | Description |
| :-- | :-- | :-- |
| `createElement` | `typeof React.createElement` | `React.createElement` を指定してください。 |
| `Fragment` | `React.ComponentType \| string` | `React.Fragment` を指定してください。 |
| `components?` | `Record<string, React.ComponentType> \| undefined` | HTML 要素を React コンポーネントで置き換えます。「Custom Components」参照 |
| `domParser?` | `((source: string) => Document) \| undefined` | Document 変換に使われるパーサー。デフォルトでは `DOMParser` を使用した変換が行われ、サニタイズは実施されません。 |

#### Returns

`JSX.Element | string | null`

`source` を、`options` の内容で変換した結果を返します。

#### Example

```jsx
import React from 'react'
import { parse } from 'dom-parser-react'

const contents = parse("<h1>HTML Text for parse API</h1>", {
  createElement: React.createElement,
  Fragment: React.Fragment,
})
```

### `getWindow()` from `dom-parser-react/window`

import 解決に `browser` condition がある状態（Next.jsでのブラウザ用出力コード等）はブラウザの `window`、それ以外の環境では `jsdom` の `window` を返します。

#### Returns

`Window`

ブラウザの `window`、または `jsdom` の `window`

#### Example

```jsx
import { getWindow } from 'dom-parser-react/window'
import DOMParserReact from 'dom-parser-react'

const sampleParser = (source) =>
  new (getWindow()).DOMParser().parseFromString(source, 'text/html')

const App = () =>
  <DOMParserReact source="<h1>HTML Text</h1>" domParser={sampleParser} />
```

## Note

`'dom-parser-react'` は、import 解決に `browser` condition がある状態（Next.js でのクライアント用出力コード等）はブラウザ用ソースコード、それ以外の場合では `jsdom` を使用したソースコードを使用します。  
import condition が使用できない場合や、Node.js であっても `jsdom` を使用したくない場合は、`'dom-parser-react/browser'` から import してください。
