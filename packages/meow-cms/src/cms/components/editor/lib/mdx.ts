/**
 * Object detailing where MDX attribute values are stored depending on the type of the object
 */
export const mdxAccessors = {
  Literal: 'value.data.estree.body[0].expression.value',
  ArrayExpression: 'value.value',
  ObjectExpression: 'value.value',
  ArrowFunctionExpression: 'value.value',
}

/**
 * Same as the above, but a function
 */
export const mdxAccessorsSwitch = (
  type?:
    | 'Literal'
    | 'ArrayExpression'
    | 'ObjectExpression'
    | 'ArrowFunctionExpression'
) => {
  switch (type) {
    case 'Literal':
      return mdxAccessors['Literal']
    case 'ArrayExpression':
    case 'ObjectExpression':
    case 'ArrowFunctionExpression':
      return mdxAccessors['ArrayExpression']
    default:
      return 'value'
  }
}
