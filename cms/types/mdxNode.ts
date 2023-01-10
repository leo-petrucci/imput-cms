/**
 * Used for simple props, like bools, strings and numbers
 */
export interface MdxLiteral {
  type: 'Literal'
  raw: string
  value: number | boolean | string
}

/**
 * Used for array props. Arrays are deconstructed to simpler types
 */
export interface MdxArrayExpression {
  type: 'ArrayExpression'
  elements: (MdxLiteral | MdxObjectExpression | MdxArrayExpression)[]
}

/**
 * Used for object props. Each property is stored in the `properties` array, then its broken down into simpler types.
 */
export interface MdxObjectExpression {
  type: 'ObjectExpression'
  properties: {
    key: MdxIdentifier
    value: MdxLiteral | MdxObjectExpression | MdxArrayExpression
  }[]
}
/**
 * Used in function props. Currently not supported so fuck it.
 */
export interface MdxArrowunctionExpression {
  type: 'ArrowFunctionExpression'
  params: MdxIdentifier[]
  body: any
}

/**
 * Used in other properties
 */
export interface MdxIdentifier {
  type: 'identifier'
  name: string
}

export interface MDXNode {
  type: 'mdxJsxAttribute'
  name: string
  value:
    | string
    | {
        type: 'mdxJsxAttributeValueExpression'
        value: string
        data: {
          estree: {
            type: 'program'
            start: number
            end: number
            sourcetype: 'module'
            body: {
              type: 'ExpressionStatement'
              expression:
                | MdxLiteral
                | MdxArrayExpression
                | MdxObjectExpression
                | MdxArrowunctionExpression
            }[]
          }
        }
      }
}
