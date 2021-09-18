import { JSDOM } from 'jsdom'
import { DOCUMENT_FRAGMENT_NODE } from './constants/node-type'
import { RootFragment } from './parser/parse'

export const createDom = (source: string): Node | RootFragment => {
  const { DOMParser } = new JSDOM().window
  const parser = new DOMParser()
  const dom = parser.parseFromString(`<!doctype html><body>${source}`, 'text/html')
  const nodes = dom.body.childNodes

  return nodes.length === 1
    ? nodes[0]
    : { nodeType: DOCUMENT_FRAGMENT_NODE, childNodes: nodes }
}
