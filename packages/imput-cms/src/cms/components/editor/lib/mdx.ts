import set from 'lodash/set'
import get from 'lodash/get'
import { MDXNode } from '../../../types/mdxNode'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { BlockType } from '../../../contexts/cmsContext/context'

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

export enum AttributeType {
  String = 'String',
  Array = 'Array',
  Object = 'Object',
  Undefined = 'Undefined',
  Component = 'Component',
  Literal = 'Literal',
  Json = 'Json',
  Other = 'Other',
}

/**
 * Returns a correct enum depending on the type of the attribute
 */
export const getAttributeType = (attribute: MDXNode) => {
  if (isAttributeString(attribute)) {
    return AttributeType.String
  } else {
    // I know it's stupid to do isString here as well but this way the types are correct
    const attributeType = !isString(attribute.value)
      ? attribute.value?.data.estree.body[0].expression.type || 'Literal'
      : 'Literal'

    switch (attributeType) {
      // literals are numbers, nulls, or booleans
      case 'Literal':
        return AttributeType.Literal
      case 'ArrayExpression':
        return AttributeType.Array
      case 'ObjectExpression':
        return AttributeType.Object
      case 'Identifier':
        return AttributeType.Undefined
      case 'JSXElement':
      case 'JSXFragment':
        return AttributeType.Component
      default:
        return AttributeType.Other
    }
  }
  return AttributeType.Other
}

/**
 * Returns the attribute type for a specific value
 * we use this to identify default types
 */
export const returnValueAttributeType = (value: any) => {
  if (isString(value)) {
    return AttributeType.String
  } else if (isArray(value)) {
    return AttributeType.Array
  } else if (isObject(value)) {
    return AttributeType.Object
  } else if (value === undefined) {
    return AttributeType.Undefined
  } else {
    return AttributeType.Literal
  }
}

/**
 * Given a widget type returns the correct AttributeType enum
 * it should be. e.g. "string" -> AttributeType.String
 */
export const getSchemaAttributeType = (
  type: NonNullable<BlockType['fields']>[0]['type']
) => {
  if (type.widget !== 'json' && type.widget !== 'markdown' && type.multiple) {
    return AttributeType.Array
  }
  switch (type.widget) {
    case 'string':
    case 'date':
    case 'image':
    case 'datetime':
      return AttributeType.String
    case 'boolean':
    case 'relation':
    case 'select':
      return AttributeType.Literal
    case 'markdown':
      return AttributeType.Component
    case 'json':
      return AttributeType.Object
  }
}

/**
 * Commonly used method to check if the attribute is a string
 */
export const isAttributeString = (attribute: MDXNode) => {
  return isString(attribute.value)
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
