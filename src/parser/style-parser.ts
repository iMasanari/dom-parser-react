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

    // comment
    if (modeToken === '/*') {
      if (token === '*/') {
        modeToken = null
      }

      continue
    }

    if (isEscape) {
      value += token
      isEscape = false

      continue
    }

    isEscape = token === '\\'

    // quotation
    if (modeToken) {
      value += token

      if (modeToken === token) {
        modeToken = null
      }

      continue
    }

    switch (token) {
      case ':':
        property = value.trim()
          .replace(/^-ms-/, 'ms-')
          .replace(/-(.)/g, (_, char) => char.toUpperCase())

        value = ''

        break
      case ';':
        style[property] = value.trim()

        property = ''
        value = ''

        break
      case '\'':
      case '"':
        value += token
        modeToken = token

        break
      case '/*':
        modeToken = token

        break
      default:
        value += token
    }
  }

  value = value.trim()

  if (value) {
    style[property] = value
  }

  return style
}
