import { JSDOM } from 'jsdom'
import { DOCUMENT_FRAGMENT_NODE } from '../constants/node-type'

export interface RootFragment {
  nodeType: typeof DOCUMENT_FRAGMENT_NODE
  childNodes: ArrayLike<ChildNode>
}

let parser: DOMParser | undefined

export const htmlParser = (source: string): Node | RootFragment => {
  if (!parser) {
    parser = typeof DOMParser === 'function'
      ? new DOMParser
      : new (new JSDOM().window).DOMParser
  }

  const dom = parser.parseFromString(`<!doctype html><body>${source}`, 'text/html')
  const nodes = dom.body.childNodes

  return nodes.length === 1
    ? nodes[0]
    : { nodeType: DOCUMENT_FRAGMENT_NODE, childNodes: nodes }
}
