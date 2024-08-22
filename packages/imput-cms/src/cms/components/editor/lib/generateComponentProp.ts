import isArray from 'lodash/isArray'
import { BlockType } from '../../../contexts/cmsContext/context'
import { MDXNode } from '../../../types/mdxNode'
import { ReactAttribute } from '../mdxElement'
import { AttributeType } from './mdx'

/**
 * Generates an empty attribute for the specific type of field and block
 * @param fieldType - the type of field to generate
 */
export const generateComponentProp = (
  fieldType: NonNullable<BlockType['fields']>[0]
): ReactAttribute => {
  switch (fieldType.type.widget) {
    case 'date':
    case 'datetime':
    case 'image':
    case 'string':
      const isMultiple = fieldType.type.multiple || false
      if (isMultiple) {
        let value: any[] = []
        if (isArray(fieldType.type.default)) {
          value = fieldType.type.default
        }
        return {
          attributeName: fieldType.name,
          type: AttributeType.Array,
          value,
        }
      }
      return {
        attributeName: fieldType.name,
        type: AttributeType.String,
        value: fieldType.type.default?.toString() || '',
      }
    case 'select':
      if (fieldType.type.multiple) {
        let value: any[] = []
        if (
          fieldType.type.default &&
          isArray(fieldType.type.default) &&
          fieldType.type.default.every((value) =>
            // @ts-expect-error
            fieldType.type.options.includes(value)
          )
        ) {
          value = fieldType.type.default
        }
        return {
          attributeName: fieldType.name,
          type: AttributeType.Array,
          value,
        }
      } else {
        let value = undefined
        if (
          fieldType.type.default &&
          !isArray(fieldType.type.default) &&
          fieldType.type.options.includes(fieldType.type.default)
        ) {
          value = fieldType.type.default
        }
        return {
          attributeName: fieldType.name,
          type: AttributeType.Literal,
          value,
        }
      }
    case 'boolean':
      let boolValue = undefined
      if (typeof fieldType.type.default === 'boolean') {
        boolValue = fieldType.type.default
      }
      return {
        attributeName: fieldType.name,
        type: AttributeType.Literal,
        value: boolValue,
      }
    case 'json':
      let value = ''

      try {
        value = JSON.stringify(fieldType.type.default)
      } catch (err) {}

      return {
        attributeName: fieldType.name,
        type: AttributeType.Json,
        value,
      }
    case 'markdown':
      return {
        attributeName: fieldType.name,
        type: AttributeType.Component,
        value: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      }
    case 'object':
      let objValue = {}
      if (typeof fieldType.type.default === 'object') {
        objValue = fieldType.type.default
      }
      return {
        attributeName: fieldType.name,
        type: AttributeType.Object,
        value: objValue,
      }
    default:
      return {
        attributeName: fieldType.name,
        type: AttributeType.Literal,
        value: undefined,
      }
  }
}
