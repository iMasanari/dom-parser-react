// @vitest-environment jsdom

import { expect, it, vi } from 'vitest'
import { DOCUMENT_FRAGMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../src/constants/node-type'
import { htmlParser } from '../src/parser/html-parser'

vi.stubGlobal('__BROWSER__', true)
vi.mock('dom-parser-react/window', () => import('../src/window.browser'))

it('parse a element', () => {
  const node = htmlParser('<div>test</div>', undefined) as Node

  expect(node.nodeType).toStrictEqual(ELEMENT_NODE)
  expect(node.nodeName.toLowerCase()).toStrictEqual('div')

  expect(node.childNodes.length).toStrictEqual(1)
  expect(node.childNodes[0].nodeType).toStrictEqual(TEXT_NODE)
  expect(node.childNodes[0].nodeValue).toStrictEqual('test')
})

it('parse elements', () => {
  const node = htmlParser('<div>1</div><span>2</span>', undefined)

  expect(node.nodeType).toStrictEqual(DOCUMENT_FRAGMENT_NODE)
  expect(node.childNodes.length).toStrictEqual(2)

  expect(node.childNodes[0].nodeType).toStrictEqual(ELEMENT_NODE)
  expect(node.childNodes[0].nodeName.toLowerCase()).toStrictEqual('div')

  expect(node.childNodes[0].childNodes.length).toStrictEqual(1)
  expect(node.childNodes[0].childNodes[0].nodeType).toStrictEqual(TEXT_NODE)
  expect(node.childNodes[0].childNodes[0].nodeValue).toStrictEqual('1')

  expect(node.childNodes[1].nodeType).toStrictEqual(ELEMENT_NODE)
  expect(node.childNodes[1].nodeName.toLowerCase()).toStrictEqual('span')

  expect(node.childNodes[1].childNodes.length).toStrictEqual(1)
  expect(node.childNodes[1].childNodes[0].nodeType).toStrictEqual(TEXT_NODE)
  expect(node.childNodes[1].childNodes[0].nodeValue).toStrictEqual('2')
})

it('table parts contents', () => {
  const node = htmlParser('<td>table data</td>', undefined) as Node

  expect(node.nodeType).toStrictEqual(ELEMENT_NODE)
  expect(node.nodeName.toLowerCase()).toStrictEqual('td')

  expect(node.childNodes.length).toStrictEqual(1)
  expect(node.childNodes[0].nodeType).toStrictEqual(TEXT_NODE)
  expect(node.childNodes[0].nodeValue).toStrictEqual('table data')
})

it('custom parser', () => {
  const parser = vi.fn(() => new DOMParser().parseFromString('<!doctype html><body><template><div>test</div>', 'text/html'))
  const node = htmlParser('<div>test</div>', parser) as Node

  expect(node.childNodes.length).toStrictEqual(1)
  expect(node.childNodes[0].nodeType).toStrictEqual(TEXT_NODE)
  expect(node.childNodes[0].nodeValue).toStrictEqual('test')

  expect(parser).toHaveBeenCalledTimes(1)
  expect(parser).toHaveBeenCalledWith('<!doctype html><body><template><div>test</div>')
})
