import { defineConfig, type UserConfig } from 'tsdown'
import packages from './package.json' with { type: 'json' }

declare global {
  const __BROWSER__: boolean
}

const baseConfig = {
  entry: {
    [packages.name]: 'src/index.ts',
  },
  format: ['es', 'cjs'],
  cjsDefault: false,
  banner: `/*! ${packages.name} v${packages.version} @license ${packages.license} */`,
  deps: {
    neverBundle: /^dom-parser-react\//,
  },
  treeshake: {
    moduleSideEffects: [{ test: /^jsdom$/, sideEffects: false }],
  },
} satisfies UserConfig

export default defineConfig([{
  ...baseConfig,
  entry: {
    ...baseConfig.entry,
    'window/browser': 'src/window.browser.ts',
    'window/node': 'src/window.node.ts',
  },
  define: {
    __BROWSER__: JSON.stringify(false),
  },
  exports: {
    customExports: (exports) => {
      const { [`./${packages.name}`]: root, './window/browser': windowBrowser, './window/node': windowNote, ...rest } = exports
      const browser = Object.fromEntries(Object.entries(root as Record<string, string>).map(([k, v]) =>
        [k, v.replace(packages.name, `browser/${packages.name}`)])
      )

      return {
        '.': {
          'browser': browser,
          ...root,
        },
        './window': {
          '_dom-parser-react-test': './src/window.node.ts',
          'browser': windowBrowser,
          ...windowNote,
        },
        './browser': browser,
        ...rest,
      }
    },
    packageJson: false,
  },
}, {
  ...baseConfig,
  entry: {
    [`browser/${packages.name}`]: 'src/index.ts',
  },
  define: {
    __BROWSER__: JSON.stringify(true),
  },
}, {
  ...baseConfig,
  define: {
    __BROWSER__: JSON.stringify(true),
  },
  format: 'iife',
  globalName: 'DOMParserReact',
  dts: false,
  minify: true,
  outputOptions: {
    entryFileNames: '[name].min.js',
    globals: {
      react: 'React',
    },
  },
}])
