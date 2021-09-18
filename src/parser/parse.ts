import { ComponentType, createElement, ReactNode } from 'react'
import { DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../constants/node-type'
import { HTML_NAMESPACE } from '../constants/web-namespace'
import { domPropertyRecord } from './properties'
import { parseStyle } from './style-parser'

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
  const isHtml = node.namespaceURI === HTML_NAMESPACE

  const tagName = isHtml ? node.tagName.toLowerCase() : node.tagName
  const attributes = getAttributeNames(node)

  const Component = options.components
    ? options.components[tagName] || tagName
    : tagName

  const props = {} as Record<string, unknown>

  attributes.forEach((attr) => {
    if (attr === 'style') {
      props[attr] = parseStyle(node.getAttribute(attr) || '')
    } else {
      const key = domPropertyRecord[attr] || attr

      props[key] = (isHtml && key !== 'list' && key in node)
        ? node[key as keyof HTMLElement]
        : node.getAttribute(attr) || ''
    }
  })

  // for SVG
  if (!isHtml) {
    props.dangerouslySetInnerHTML = { __html: node.innerHTML }

    return options.createElement(Component, props)
  }

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
