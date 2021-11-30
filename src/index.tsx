import { ComponentType, createElement, Fragment, useMemo } from 'react'
import { parse, DOMParserReactOptions } from './parser/parse'

export { parse, DOMParserReactOptions }

export interface DOMParserReactProps {
  source: string
  createElement?: typeof createElement
  Fragment?: ComponentType | string
  components?: Record<string, ComponentType<any>>
  deps?: unknown[]
}

export default function DOMParserReact(props: DOMParserReactProps) {
  const element = useMemo(() => (
    parse(props.source, {
      createElement: props.createElement || createElement,
      Fragment: props.Fragment || Fragment,
      components: props.components,
    })
    // eslint-disable-next-line
  ), props.deps || [props.source])

  return typeof element === 'string' ? <Fragment>{element}</Fragment> : element
}
