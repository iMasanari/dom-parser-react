// @ts-check

import { join } from 'path'
import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import browserPackages from './browser/package.json'
import rootPackages from './package.json'

const globalName = 'DOMParserReact'

const globals = {
  'react': 'React',
}

/** @type {import('rollup').RollupOptions} */
const baseConfig = {
  input: './src/index.tsx',
  treeshake: 'smallest',
  plugins: [
    typescript(),
    buble(),
  ],
  external: Object.keys({
    ...rootPackages.dependencies,
    ...rootPackages.peerDependencies,
  }),
}

/** @type {import('rollup').RollupOptions} */
const nodeConfig = {
  ...baseConfig,
  output: [{
    format: 'cjs',
    file: rootPackages.main,
    exports: 'named',
  }, {
    format: 'es',
    file: rootPackages.module,
  }],
}

/** @type {import('rollup').RollupOptions} */
const browserConfig = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    replace({
      preventAssignment: true,
      values: { 'typeof DOMParser': JSON.stringify('function') },
    }),
  ],
  output: [{
    format: 'iife',
    file: `dist/${rootPackages.name}.js`,
    name: globalName,
    exports: 'named',
    globals,
  }, {
    format: 'iife',
    file: `dist/${rootPackages.name}.min.js`,
    name: globalName,
    exports: 'named',
    globals,
    plugins: [
      terser(),
    ],
  }, {
    format: 'cjs',
    file: join('browser', browserPackages.main),
    exports: 'named',
  }, {
    format: 'es',
    file: join('browser', browserPackages.module),
    exports: 'named',
  }],
}

export default [nodeConfig, browserConfig]
