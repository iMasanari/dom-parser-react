import { createElement as ReactCreateElement, Fragment as ReactFragment, useMemo } from 'react'
import { parse, type DOMParserReactOptions } from './parser/parse'

export { DOMParserReactOptions, parse }

export interface DOMParserReactProps extends Partial<DOMParserReactOptions> {
  source: string
  deps?: unknown[]
}

export default function DOMParserReact({ source, deps, ...options }: DOMParserReactProps) {
  const createElement = options.createElement || ReactCreateElement
  const Fragment = options.Fragment || ReactFragment

  const element = useMemo(() => (
    parse(source, {
      ...options,
      createElement,
      Fragment,
    })
    // eslint-disable-next-line
  ), deps || [source])

  return typeof element === 'string' ? /* @__PURE__ */ createElement(Fragment, null, element) : element
}
