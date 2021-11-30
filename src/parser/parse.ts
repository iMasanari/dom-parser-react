import { ComponentType, createElement } from 'react'
import { DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../constants/node-type'
import { HTML_NAMESPACE } from '../constants/web-namespace'
import { htmlParser, RootFragment } from './html-parser'
import { domPropertyRecord } from './properties'
import { parseStyle } from './style-parser'

const map = Array.prototype.map as {
  call: <T, U>(list: ArrayLike<T>, fn: (value: T, index: number, self: T[]) => U) => U[]
}

export interface DOMParserReactOptions {
  createElement: typeof createElement
  Fragment: ComponentType | string
  components?: Record<string, ComponentType<any>>
}

export const parse = (source: string, options: DOMParserReactOptions): JSX.Element | string | null => {
  const dom = htmlParser(source)

  return transform(dom, options)
}

const transform = (node: Node | RootFragment, options: DOMParserReactOptions): JSX.Element | string | null => {
  const nodeType = node.nodeType

  if (nodeType === ELEMENT_NODE) {
    return element(node as HTMLElement, options)
  }

  if (nodeType === DOCUMENT_NODE || nodeType === DOCUMENT_FRAGMENT_NODE) {
    return root(node as RootFragment, options)
  }

  if (nodeType === TEXT_NODE) {
    return text(node as Text)
  }

  return null
}

const element = (node: HTMLElement, options: DOMParserReactOptions) => {
  const isHtml = node.namespaceURI === HTML_NAMESPACE

  const tagName = isHtml ? node.tagName.toLowerCase() : node.tagName
  const attributes = getAttributeNames(node)

  const Component = options.components
    ? options.components[tagName] || tagName
    : tagName

  const props = {} as Record<string, unknown>

  attributes.forEach((attr) => {
    const value = node.getAttribute(attr) || ''

    if (attr === 'style') {
      props[attr] = parseStyle(value)
    } else {
      const property = domPropertyRecord[attr] || attr

      props[property] = (
        isHtml &&
        property !== 'list' &&
        property in node &&
        typeof node[property as keyof HTMLElement] !== 'string'
      )
        ? node[property as keyof HTMLElement]
        : value
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

const root = (node: DocumentFragment | RootFragment, options: DOMParserReactOptions) =>
  options.createElement(
    options.Fragment,
    null,
    ...children(node.childNodes, options)
  )

const text = (node: Text) => node.data

const children = (children: ArrayLike<ChildNode>, options: DOMParserReactOptions) =>
  map.call(children, child => transform(child, options)).filter(Boolean)

const getAttributeNames = (node: HTMLElement) => {
  // for IE
  if (node.getAttributeNames == undefined) {
    return map.call(node.attributes, attr => attr.name)
  }

  return node.getAttributeNames()
}
