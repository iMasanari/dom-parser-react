// @ts-check

import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import packages from './package.json' assert { type: 'json' }

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
    esbuild(),
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
    file: packages.exports['.'].require,
    exports: 'named',
    banner,
  }, {
    format: 'es',
    file: packages.exports['.'].default,
    banner,
  }],
}

/** @type {import('rollup').RollupOptions} */
const browserConfig = {
  ...baseConfig,
  plugins: [
    // @ts-expect-error
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
      minify({ banner }),
    ],
  }, {
    format: 'cjs',
    file: packages.exports['.'].browser.require,
    exports: 'named',
    banner,
  }, {
    format: 'es',
    file: packages.exports['.'].browser.default,
    exports: 'named',
    banner,
  }],
}

/** @type {import('rollup').RollupOptions} */
const dtsConfig = {
  ...baseConfig,
  plugins: [
    dts(),
  ],
  output: [{
    format: 'es',
    file: packages.types,
    banner,
  }],
}
export default [nodeConfig, browserConfig, dtsConfig]
