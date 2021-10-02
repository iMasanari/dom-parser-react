import { ComponentType, createElement, Fragment, useMemo } from 'react'
import { parse, DOMParserReactOptions, RootFragment } from './parser/parse'

export { parse, DOMParserReactOptions }

export interface DOMParserReactProps {
  source: string | Node | RootFragment
  components?: Record<string, ComponentType<any>>
  createElement?: typeof createElement
  Fragment?: ComponentType | string
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
