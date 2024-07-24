import set from 'lodash/set'
import get from 'lodash/get'

/**
 * Object detailing where MDX attribute values are stored depending on the type of the object
 */
export const mdxAccessors = {
  Literal: 'value.data.estree.body[0].expression.value',
  Identifier: 'value.data.estree.body[0].expression.value',
  ArrayExpression: 'value.value',
  ObjectExpression: 'value.value',
  ArrowFunctionExpression: 'value.value',
  Simple: 'value',
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
    | 'Identifier'
    | 'Simple'
) => {
  switch (type) {
    case 'Literal':
    case 'Identifier':
      return mdxAccessors['Literal']
    case 'ArrayExpression':
    case 'ObjectExpression':
    case 'ArrowFunctionExpression':
      return mdxAccessors['ArrayExpression']
    default:
      return 'value'
  }
}

/**
 * A re-implementation of the set method. Aside from setting the new value to the
 * mdx attribute, it also ensures the correct type is updated
 */
export const setAttribute = (
  obj: Parameters<typeof set>[0],
  accessor: keyof typeof mdxAccessors | undefined,
  value: Parameters<typeof set>[2]
) => {
  set(obj, mdxAccessorsSwitch(accessor), value)
  if (accessor !== undefined)
    set(obj, 'value.data.estree.body[0].expression.type', accessor)

  return obj
}

export const getAttribute = (
  obj: Parameters<typeof get>[0],
  accessor: keyof typeof mdxAccessors | undefined
) => {
  return get(obj, mdxAccessorsSwitch(accessor))
}
