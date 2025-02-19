import { ComponentType, createElement as ReactCreateElement, Fragment as ReactFragment, useMemo } from 'react'
import { parse, type DOMParserReactOptions } from './parser/parse'

export { parse, DOMParserReactOptions }

export interface DOMParserReactProps {
  source: string
  createElement?: typeof ReactCreateElement
  Fragment?: ComponentType | string
  components?: Record<string, ComponentType<any>>
  deps?: unknown[]
}

export default function DOMParserReact(props: DOMParserReactProps) {
  const createElement = props.createElement || ReactCreateElement
  const Fragment = props.Fragment || ReactFragment

  const element = useMemo(() => (
    parse(props.source, {
      createElement,
      Fragment,
      components: props.components,
    })
    // eslint-disable-next-line
  ), props.deps || [props.source])

  return typeof element === 'string' ? /* @__PURE__ */ createElement(Fragment, null, element) : element
}
