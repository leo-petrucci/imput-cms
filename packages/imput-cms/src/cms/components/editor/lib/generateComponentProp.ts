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
        return {
          attributeName: fieldType.name,
          type: AttributeType.Array,
          value: [],
        }
      }
      return {
        attributeName: fieldType.name,
        type: AttributeType.String,
        value: [],
      }
    case 'select':
    case 'boolean':
      if (fieldType.type.widget === 'select' && fieldType.type.multiple) {
        return {
          attributeName: fieldType.name,
          type: AttributeType.Literal,
          value: [],
        }
      } else {
        return {
          attributeName: fieldType.name,
          type: AttributeType.Literal,
          value: fieldType.type.default || undefined,
        }
      }
    case 'json':
      return {
        attributeName: fieldType.name,
        type: AttributeType.Json,
        value: '',
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
      return {
        attributeName: fieldType.name,
        type: AttributeType.Object,
        value: {},
      }
    default:
      return {
        attributeName: fieldType.name,
        type: AttributeType.Literal,
        value: undefined,
      }
  }
}
