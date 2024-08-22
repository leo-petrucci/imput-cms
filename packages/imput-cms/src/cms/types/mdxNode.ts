/**
 * Used for simple props, like bools, strings and numbers
 */
export interface MdxLiteral {
  type: 'Literal'
  raw: string
  value: number | boolean | string | undefined
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
 * Apparently fragments are their own type, who knew?
 */
export interface MdxFragmentExpression {
  type: 'JSXFragment'
  closingFragment: {
    type: 'JSXClosingFragment'
  }
  openingFragment: {
    type: 'JSXOpeningFragment'
  }
  // this is going to be serialised separately
  // so we don't actually need types for it
  children: any[]
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
  type: 'Identifier'
  name: string
  value: string
}

export interface MDXJSXElement {
  type: 'JSXElement'
  openingElement: {
    type: 'JSXOpeningelement'
    /**
     * I'm assuming attributes are the same type
     */
    attributes: MDXNode[]
    name: {
      type: 'JSXIdentifier'
      /**
       * Name of the component
       */
      name: string
    }
    selfClosing: boolean
    closingelement: null | {
      type: 'JSXClosingElement'
      name: {
        type: 'JSXIdentifier'
        /**
         * Name of the component
         */
        name: string
      }
    }
    // this is going to be serialised separately
    // so we don't actually need types for it
    children: any[]
  }
}

export interface MDXNode {
  type: 'mdxJsxAttribute'
  name: string
  value?: ComplexAttribute | string
}

/**
 * The shape of a complex attribute
 */
export interface ComplexAttribute {
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
          | MdxIdentifier
          | MDXJSXElement
          | MdxFragmentExpression
      }[]
    }
  }
}
