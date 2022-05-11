// @ts-check

import { join } from 'path'
import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import browserPackages from './browser/package.json'
import packages from './package.json'

const globalName = 'DOMParserReact'

const globals = {
  'react': 'React',
}

const banner = `/*! ${packages.name} v${packages.version} @license ${packages.license} */`

/** @type {import('rollup').RollupOptions} */
const baseConfig = {
  input: './src/index.tsx',
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    typescript(),
    buble(),
  ],
  external: Object.keys({
    ...packages.dependencies,
    ...packages.peerDependencies,
  }),
}

/** @type {import('rollup').RollupOptions} */
const nodeConfig = {
  ...baseConfig,
  output: [{
    format: 'cjs',
    file: packages.main,
    exports: 'named',
    banner,
  }, {
    format: 'es',
    file: packages.module,
    banner,
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
    file: `dist/${packages.name}.js`,
    name: globalName,
    exports: 'named',
    globals,
    banner,
  }, {
    format: 'iife',
    file: `dist/${packages.name}.min.js`,
    name: globalName,
    exports: 'named',
    globals,
    plugins: [
      terser(),
    ],
    banner,
  }, {
    format: 'cjs',
    file: join('browser', browserPackages.main),
    exports: 'named',
    banner,
  }, {
    format: 'es',
    file: join('browser', browserPackages.module),
    exports: 'named',
    banner,
  }],
}

export default [nodeConfig, browserConfig]
