export const parseStyle = (inlineStyle: string) => {
  const tokens = inlineStyle.trim().split(/([:;'"\\]|\/\*|\*\/)/)
  const style = {} as Record<string, string>

  let modeToken: '\'' | '"' | '/*' | null = null
  let isEscape = false
  let property = ''
  let value = ''

  for (let i = 0, len = tokens.length; i < len; ++i) {
    const token = tokens[i]

    if (!token) continue

    // comment mode
    if (modeToken === '/*') {
      if (token === '*/') {
        modeToken = null
      }

      continue
    }

    // escaped token
    if (isEscape) {
      value += token
      isEscape = false

      continue
    }

    isEscape = token === '\\'

    // css string value mode (quotation)
    if (modeToken) {
      value += token

      if (modeToken === token) {
        modeToken = null
      }

      continue
    }

    if (token === ':') {
      property = value.trim()
        .replace(/^-ms-/, 'ms-')
        .replace(/-(.)/g, (_, char) => char.toUpperCase())

      value = ''

      continue
    }

    if (token === ';') {
      style[property] = value.trim()

      property = ''
      value = ''

      continue
    }

    if (token === '\'' || token === '"') {
      value += token
      modeToken = token

      continue
    }

    if (token === '/*') {
      modeToken = token

      continue
    }

    // other token
    value += token
  }

  value = value.trim()

  if (value) {
    style[property] = value
  }

  return style
}
