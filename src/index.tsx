import { ComponentType, createElement, Fragment, useMemo } from 'react'
import { parse, DomParserReactOptions } from './compiler/parse'

export { parse, DomParserReactOptions }

export interface DomParserReactProps {
  source: string | Node
  components?: Record<string, ComponentType<any>>
  createElement?: typeof createElement
  Fragment?: ComponentType | string
  deps?: unknown[]
}

export default function DomParserReact(props: DomParserReactProps) {
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
