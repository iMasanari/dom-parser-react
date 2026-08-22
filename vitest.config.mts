import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    conditions: ['_dom-parser-react-test'],
  },
})
