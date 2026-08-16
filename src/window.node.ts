import { JSDOM } from 'jsdom'

export const getWindow = () =>
  typeof window === 'object' ? window : new JSDOM().window as typeof window
