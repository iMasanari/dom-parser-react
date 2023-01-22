import { expect, it } from 'vitest'
import { parseStyle } from '../src/parser/style-parser'

it('escape and quotes', () => {
  expect(parseStyle("font-family: I'm")).toStrictEqual({
    fontFamily: "I'm",
  })

  expect(parseStyle("font-family: 'I\\'m'")).toStrictEqual({
    fontFamily: "'I\\'m'",
  })

  expect(parseStyle('font-family: "\\\\";')).toStrictEqual({
    fontFamily: '"\\\\"',
  })

  expect(parseStyle('font-family: "/*", "*/"')).toStrictEqual({
    fontFamily: '"/*", "*/"',
  })
})

// Based https://github.com/remarkablemark/style-to-object/blob/master/test/data.js

it('general', () => {
  expect(parseStyle('display: inline-block;')).toStrictEqual({
    display: 'inline-block',
  })

  expect(parseStyle('color:red;')).toStrictEqual({
    color: 'red',
  })

  expect(parseStyle('margin: 0 auto;')).toStrictEqual({
    margin: '0 auto',
  })

  expect(parseStyle(`
    font-size: .75em;
    position:absolute;width: 33.3%;
    z-index:1337;
  `)).toStrictEqual({
    fontSize: '.75em',
    position: 'absolute',
    width: '33.3%',
    zIndex: '1337',
  })
})

it('multiple of same property', () => {
  expect(parseStyle('color:rgba(0,0,0,1);color:white;')).toStrictEqual({
    color: 'white',
  })
})

it('missing semicolon', () => {
  expect(parseStyle('line-height: 42')).toStrictEqual({
    lineHeight: '42',
  })

  expect(parseStyle('font-style:italic; text-transform:uppercase')).toStrictEqual({
    fontStyle: 'italic',
    textTransform: 'uppercase',
  })
})

it('extra whitespace', () => {
  expect(parseStyle(' padding-bottom : 1px')).toStrictEqual({
    paddingBottom: '1px',
  })

  expect(parseStyle('padding:   12px  0 ')).toStrictEqual({
    padding: '12px  0',
  })

  expect(parseStyle(`
    -moz-border-radius: 10px 5px;
    -webkit-border-top-left-radius: 10px;
    -webkit-border-top-right-radius: 5px;
    -webkit-border-bottom-right-radius: 10px;
    -webkit-border-bottom-left-radius: 5px;
    border-radius: 10px 5px;
  `)).toStrictEqual({
    MozBorderRadius: '10px 5px',
    WebkitBorderTopLeftRadius: '10px',
    WebkitBorderTopRightRadius: '5px',
    WebkitBorderBottomRightRadius: '10px',
    WebkitBorderBottomLeftRadius: '5px',
    borderRadius: '10px 5px',
  })
})

it('text and url', () => {
  expect(parseStyle('content: "Lorem ipsum"')).toStrictEqual({
    content: '"Lorem ipsum"',
  })

  expect(parseStyle('content: "foo: bar;";')).toStrictEqual({
    content: '"foo: bar;"',
  })

  expect(parseStyle('background-image: url("http://cdn.example.com/image.png?v=42");')).toStrictEqual({
    backgroundImage: 'url("http://cdn.example.com/image.png?v=42")',
  })

  expect(parseStyle('background: #123456 url("https://foo.bar/image.png?v=2")')).toStrictEqual({
    background: '#123456 url("https://foo.bar/image.png?v=2")',
  })
})

it('property prefix', () => {
  expect(parseStyle('-webkit-hyphens: auto; -moz-hyphens: auto; -ms-hyphens: auto; hyphens: auto;')).toStrictEqual({
    WebkitHyphens: 'auto',
    MozHyphens: 'auto',
    msHyphens: 'auto',
    hyphens: 'auto',
  })
})

it('value prefix', () => {
  expect(parseStyle(`
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  `)).toStrictEqual({
    display: 'flex',
  })
})

it('comment', () => {
  expect(parseStyle('/* color: #f00; */ background: blue;')).toStrictEqual({
    background: 'blue',
  })

  expect(parseStyle('top: 0; /* comment */ bottom: 42rem;')).toStrictEqual({
    top: '0',
    bottom: '42rem',
  })

  expect(parseStyle(`
    right: 0; /* comment */
    /* comment */   left: 42rem;
  `)).toStrictEqual({
    right: '0',
    left: '42rem',
  })
})

it('custom', () => {
  expect(parseStyle('foo: bar;')).toStrictEqual({
    foo: 'bar',
  })

  expect(parseStyle('foo:bar; baz:qux')).toStrictEqual({
    foo: 'bar',
    baz: 'qux',
  })
})
