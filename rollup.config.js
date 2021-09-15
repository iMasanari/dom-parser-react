// @ts-check

import buble from '@rollup/plugin-buble'
import typescript from '@rollup/plugin-typescript'
import {terser} from 'rollup-plugin-terser'
import packages from './package.json'

const globals = {
  'react': 'React',
}

export default {
  input: './src/index.tsx',
  plugins: [
    typescript(),
    buble(),
  ],
  external: Object.keys(globals),
  output: [{
    format: 'iife',
    file: `dist/${packages.name}.js`,
    name: 'DomParserReact',
    exports: 'named',
    globals,
    plugins: [
      terser(),
    ],
  }, {
    format: 'cjs',
    file: packages.main,
    exports: 'named',
  }, {
    format: 'es',
    file: packages.module,
  }],
}
