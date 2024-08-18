import {
  MdxArrayExpression,
  MdxLiteral,
  MdxObjectExpression,
} from '../../../types/mdxNode'

/**
 * These functions are used to extract and simplify values
 * from deserialised MDX so that they're usable
 * by the CMS
 *
 * These are supposed to be recursive, so if an array
 * is deeply nested within an object they should still work
 * fine
 */

/**
 * Extracts and simplifies values from an array prop
 */
export const returnArrayValues = (
  element: MdxArrayExpression
):
  | ReturnType<typeof returnLiteralValues>
  | ReturnType<typeof returnObjectValues>
  | any[] => {
  return element.elements.map((v) => {
    if (v.type === 'Literal') {
      return returnLiteralValues(v)
    } else if (v.type === 'ObjectExpression') {
      return returnObjectValues(v)
    } else if (v.type === 'ArrayExpression') {
      return returnArrayValues(v)
    }
  })
}

/**
 * Extracts and simplifies values from a literal
 */
export const returnLiteralValues = (element: MdxLiteral) => {
  return element.value
}

/**
 * Extracts and simplifies values from an object
 */
export const returnObjectValues = (element: MdxObjectExpression) => {
  const objectMap: [string, any][] = element.properties.map((p) => {
    const key = p.key.name
    let value = undefined

    if (p.value.type === 'Literal') {
      value = returnLiteralValues(p.value)
    } else if (p.value.type === 'ObjectExpression') {
      value = returnObjectValues(p.value)
    } else if (p.value.type === 'ArrayExpression') {
      value = returnArrayValues(p.value)
    }

    return [key, value]
  })

  return Object.fromEntries(objectMap)
}

/**
 * The MDX deserializer has issues correctly deserializing components
 * that have children and component on a single line like
 * <Component>Child</Component>
 *
 * This adds newlines in those cases so we can recursively
 * deserialize components
 */
export const formatComponentWithChildenAndNoNewLines = (
  componentString: string
) => {
  const regex = /<([A-Z][a-zA-Z]*)([^>]*)?>([^<\n]+)<\/\1>/

  if (regex.test(componentString)) {
    return componentString.replace(
      regex,
      (match, componentName, props, children) => {
        return `<${componentName} ${props}>\n\n${children}\n\n</${componentName}>`
      }
    )
  } else {
    return componentString
  }
}
