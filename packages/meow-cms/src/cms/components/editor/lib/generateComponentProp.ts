import { BlockType } from '../../../contexts/cmsContext/context'
import { MDXNode } from '../../../types/mdxNode'

/**
 * Generates an empty attribute for the specific type of field and block
 * @param fieldType - the type of field to generate
 */
export const generateComponentProp = (
  fieldType: NonNullable<BlockType['fields']>[0]
) => {
  switch (fieldType.type.widget) {
    case 'date':
    case 'datetime':
    case 'image':
    case 'string':
    default:
      return {
        name: fieldType.name,
        type: 'mdxJsxAttribute',
        value: fieldType.type.default || '',
      } as unknown as MDXNode
      break
    case 'select':
    case 'boolean':
      if (fieldType.type.widget === 'select' && fieldType.type.multiple) {
        const jsonNode: MDXNode = {
          type: 'mdxJsxAttribute',
          name: fieldType.name,
          value: {
            type: 'mdxJsxAttributeValueExpression',
            value: '',
            data: {
              estree: {
                type: 'program',
                start: 0,
                end: 1,
                sourcetype: 'module',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [],
                    },
                  },
                ],
              },
            },
          },
        }
        return jsonNode
      } else {
        const literalNode: MDXNode = {
          type: 'mdxJsxAttribute',
          name: fieldType.name,
          value: {
            type: 'mdxJsxAttributeValueExpression',
            value: '',
            data: {
              estree: {
                type: 'program',
                start: 0,
                end: 1,
                sourcetype: 'module',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Literal',
                      raw: `${fieldType.type.default}`,
                      // @ts-expect-error the error isn't actually applicable here, it won't be an array
                      value: fieldType.type.default || undefined,
                    },
                  },
                ],
              },
            },
          },
        }
        return literalNode
      }
    case 'json':
      const jsonNode: MDXNode = {
        type: 'mdxJsxAttribute',
        name: fieldType.name,
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: '',
          data: {
            estree: {
              type: 'program',
              start: 0,
              end: 1,
              sourcetype: 'module',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ObjectExpression',
                    properties: [],
                  },
                },
              ],
            },
          },
        },
      }
      return jsonNode
      break
  }
}
