/**
 * Object detailing where MDX attribute values are stored depending on the type of the object
 */
export const mdxAccessors = {
  Literal: 'value.data.estree.body[0].expression.value',
  ArrayExpression: 'value.value',
  ObjectExpression: 'value.value',
  ArrowFunctionExpression: 'value.value',
}
