import { defineConfig } from 'tsdown'
import packages from './package.json' with { type: 'json' }

declare global {
  const __BROWSER__: boolean
}

const baseConfig = defineConfig({
  entry: {
    [packages.name]: 'src/index.ts',
  },
  format: ['es', 'cjs'],
  cjsDefault: false,
  banner: `/*! ${packages.name} v${packages.version} @license ${packages.license} */`,
  treeshake: {
    moduleSideEffects: [{ test: /^jsdom$/, sideEffects: false }],
  },
})


export default defineConfig([{
  ...baseConfig,
  entry: {
    [`${packages.name}.browser`]: 'src/index.ts',
  },
  define: {
    __BROWSER__: JSON.stringify(true),
  },
}, {
  ...baseConfig,
  define: {
    __BROWSER__: JSON.stringify(false),
  },
  exports: {
    customExports: (exports) => {
      const { '.': root, ...rest } = exports
      const browser = Object.fromEntries(Object.entries(root as Record<string, string>).map(([k, v]) =>
        [k, v.replace(packages.name, `${packages.name}.browser`)])
      )

      return {
        '.': {
          'browser': browser,
          ...root,
        },
        './browser': browser,
        ...rest,
      }
    },
    packageJson: false,
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
