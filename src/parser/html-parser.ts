import { getWindow } from 'dom-parser-react/window'
import { DOCUMENT_FRAGMENT_NODE } from '../constants/node-type'

export interface RootFragment {
  nodeType: typeof DOCUMENT_FRAGMENT_NODE
  childNodes: ArrayLike<ChildNode>
}

let parser: DOMParser | undefined

const defaultParse = (source: string) => {
  parser ??= __BROWSER__ ? new DOMParser() : new (getWindow()).DOMParser()

  return parser.parseFromString(source, 'text/html')
}

export const htmlParser = (source: string, parse: ((source: string) => Document) | undefined): Node | RootFragment => {
  const dom = (parse ?? defaultParse)(`<!doctype html><body><template>${source}`)
  const nodes = (dom.body.firstChild as HTMLTemplateElement).content.childNodes

  return nodes.length === 1
    ? nodes[0]
    : { nodeType: DOCUMENT_FRAGMENT_NODE, childNodes: nodes }
}
