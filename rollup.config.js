// @ts-check

import { join } from 'path'
import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import rootPackages from './package.json'
import serverPackages from './server/package.json'

const globals = {
  'react': 'React',
  'jsdom': 'JSDOM',
}

export default [{
  input: './src/index.tsx',
  plugins: [
    typescript(),
    buble(),
  ],
  external: Object.keys(globals),
  output: [{
    format: 'iife',
    file: `dist/${rootPackages.name}.js`,
    name: 'DomParserReact',
    exports: 'named',
    globals,
    plugins: [
      terser(),
    ],
  }, {
    format: 'cjs',
    file: rootPackages.main,
    exports: 'named',
  }, {
    format: 'es',
    file: rootPackages.module,
  }],
}, {
  input: './src/server.ts',
  plugins: [
    typescript(),
    buble(),
    replace({ 
      preventAssignment: true,
      values: { 'process.env.TARGET': JSON.stringify('node') },
     }),
  ],
  external: Object.keys(globals),
  output: [{
    format: 'cjs',
    file: join('server', serverPackages.main),
    exports: 'named',
  }],
}, {
  input: './src/server.ts',
  plugins: [
    typescript(),
    buble(),
    replace({
      preventAssignment: true,
      values: { 'process.env.TARGET': JSON.stringify('browser') },
    }),
  ],
  external: Object.keys(globals),
  output: [{
    format: 'cjs',
    file: join('server', serverPackages.browser),
    exports: 'named',
  }],
}]
