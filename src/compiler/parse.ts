import { ComponentType, createElement, ReactNode } from 'react'
import { DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../constants/node-type'
import { HTML_NAMESPACE } from '../constants/web-namespace'
import { domPropertyRecord } from './properties'

export interface RootFragment {
  nodeType: typeof DOCUMENT_FRAGMENT_NODE
  childNodes: ArrayLike<ChildNode>
}

export interface DomParserReactOptions {
  createElement: typeof createElement
  Fragment?: ComponentType | string
  components?: Record<string, ComponentType<any>>
}

export const parse = (source: string | Node | RootFragment, options: DomParserReactOptions): JSX.Element | string | null => {
  const dom = typeof source === 'string' ? createDom(source) : source

  return transform(dom, options)
}

const createDom = (source: string): Node | RootFragment => {
  const parser = new DOMParser()
  const dom = parser.parseFromString(`<!doctype html><body>${source}`, 'text/html')
  const nodes = dom.body.childNodes

  return nodes.length === 1
    ? nodes[0]
    : { nodeType: DOCUMENT_FRAGMENT_NODE, childNodes: nodes }
}

const transform = (node: Node | RootFragment, options: DomParserReactOptions): JSX.Element | string | null => {
  switch (node.nodeType) {
    case ELEMENT_NODE:
      return element(node as HTMLElement, options)
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      return root(node as DocumentFragment, options)
    case TEXT_NODE:
      return text(node as Text)
  }
  return null
}

const element = (node: HTMLElement, options: DomParserReactOptions) => {
  const space = node.namespaceURI

  // TODO: support SVG
  if (space !== HTML_NAMESPACE) return null

  const tagName = node.tagName.toLowerCase()
  const attributes = getAttributeNames(node)

  const Component = options.components
    ? options.components[tagName] || tagName
    : tagName

  const props = {} as Record<string, unknown>

  attributes.forEach((attr) => {
    if (attr === 'style') {
      const style = node[attr]
      const styles = {} as Record<string, unknown>

      for (let i = 0, len = style.length; i < len; i++) {
        const key = style[i]
        const styleName = key.replace(/(^-ms)?-(.)/g, (_, ms, char) =>
          (ms ? 'ms' : '') + char.toUpperCase()
        )

        styles[styleName] = style[key as keyof CSSStyleDeclaration]
      }

      props[attr] = styles
    } else {
      const key = domPropertyRecord[attr] || attr

      props[key] = key in node
        ? node[key as keyof HTMLElement]
        : node.getAttribute(attr) || ''
    }
  })

  return options.createElement(
    Component,
    props,
    ...children(node.childNodes, options)
  )
}

const root = (node: DocumentFragment, options: DomParserReactOptions) =>
  options.createElement(
    options.Fragment || 'div',
    null,
    ...children(node.childNodes, options)
  )

const text = (node: Text) => node.data

const children = (children: ArrayLike<ChildNode>, options: DomParserReactOptions) => {
  const result: ReactNode[] = []

  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    const node = transform(child, options)

    if (node) result.push(node)
  }

  return result
}

const getAttributeNames = (node: HTMLElement) => {
  if (node.getAttributeNames != undefined) {
    return node.getAttributeNames()
  }

  // for IE
  const attributes = node.attributes
  const result = new Array<string>(length)

  for (let i = 0, length = attributes.length; i < length; i++) {
    result[i] = attributes[i].name
  }

  return result
}
