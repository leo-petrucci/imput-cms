import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { MdxElementShape } from '../mdxElement'
import { BlockType } from '../../../contexts/cmsContext/context'
import {
  AttributeType,
  getAttributeType,
  returnValueAttributeType,
} from '../lib/mdx'
import { UnistParent } from 'unist-util-visit/lib'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkSlate from '../../../../cms/components/editor/remark-slate'
import {
  ComplexAttribute,
  MdxArrayExpression,
  MdxLiteral,
  MdxObjectExpression,
} from '../../../types/mdxNode'
import {
  formatComponentWithChildenAndNoNewLines,
  returnArrayValues,
  returnLiteralValues,
  returnObjectValues,
} from './utils'
import { deserialize } from '../editor'
import isArray from 'lodash/isArray'

interface ValidateSchemaOptions {
  schema: BlockType[]
}

/**
 * This remark plugin will parse and fix schemas on deserialization.
 */
export const remarkValidateSchema: Plugin<[ValidateSchemaOptions]> = ({
  schema,
}) => {
  return (tree) => {
    visit(tree, (node, index, parent: UnistParent) => {
      if (node.type === 'mdxJsxFlowElement') {
        const jsxNode = node as MdxElementShape

        const componentSchema = schema.find((c) => c.name === jsxNode.name)

        // we add initialise this here so it's never undefined
        if (!jsxNode.reactAttributes) {
          jsxNode.reactAttributes = []
        }

        // if component doesn't exist in schema, it gets removed
        if (componentSchema === undefined) {
          parent.children.splice(index || 0, 1)
        } else {
          // if it exists we loop through its attributes and check them
          for (const [
            attributeIndex,
            attribute,
          ] of jsxNode.attributes.entries()) {
            const attributeName = attribute.name

            const foundAttributeSchema = componentSchema.fields?.find(
              (a) => a.name === attributeName
            )

            // if the attribute is not defined in the schema it also gets removed
            if (!foundAttributeSchema) {
              jsxNode.attributes.splice(attributeIndex, 1)
            } else {
              // attribute has a schema so we parse it

              let currentAttributeType = getAttributeType(attribute)

              // if the schema expects this to be an array but the value isn't
              // we override it here and skip the parsing altogether
              // we could probably transform the existin value into an array but
              // it's kind of not worth it
              if (
                // @ts-expect-error falsy either way
                foundAttributeSchema.type.multiple &&
                currentAttributeType !== AttributeType.Array
              ) {
                jsxNode.reactAttributes.push({
                  attributeName: foundAttributeSchema.name,
                  type: AttributeType.Array,
                  value: [],
                })
                continue
              }

              // on the other side, if something is an array and it shouldn't be
              // we unset the value
              if (
                // @ts-expect-error falsy either way
                !foundAttributeSchema.type.multiple &&
                currentAttributeType === AttributeType.Array
              ) {
                jsxNode.reactAttributes.push({
                  attributeName: foundAttributeSchema.name,
                  type: AttributeType.Literal,
                  value: undefined,
                })
                continue
              }

              switch (currentAttributeType) {
                case AttributeType.String:
                  jsxNode.reactAttributes.push({
                    attributeName: foundAttributeSchema.name,
                    type: currentAttributeType,
                    value: attribute.value,
                  })
                  break
                case AttributeType.Literal:
                case AttributeType.Undefined:
                  jsxNode.reactAttributes.push({
                    attributeName: foundAttributeSchema.name,
                    type: currentAttributeType,
                    value: (
                      (attribute.value as ComplexAttribute | undefined)?.data
                        .estree.body[0].expression as MdxLiteral
                    ).value,
                  })
                  break
                case AttributeType.Array:
                  jsxNode.reactAttributes.push({
                    attributeName: foundAttributeSchema.name,
                    type: currentAttributeType,
                    value: (
                      (attribute.value as ComplexAttribute | undefined)?.data
                        .estree.body[0].expression as MdxArrayExpression
                    ).elements.map((v) => {
                      if (v.type === 'Literal') {
                        return returnLiteralValues(v)
                      } else if (v.type === 'ArrayExpression') {
                        return returnArrayValues(v)
                      } else if (v.type === 'ObjectExpression') {
                        return returnObjectValues(v)
                      }
                    }),
                  })
                  break
                case AttributeType.Object:
                  const objectValue = returnObjectValues(
                    (attribute.value as ComplexAttribute | undefined)?.data
                      .estree.body[0].expression as MdxObjectExpression
                  )
                  // if the object is going to be edited as JSON then it has to be stringified
                  // or it will cause issues later on
                  //
                  // that said we still want to support objects in case we want to do some
                  // fancy stuff in the future
                  const value =
                    foundAttributeSchema.type.widget === 'json'
                      ? JSON.stringify(objectValue)
                      : objectValue
                  jsxNode.reactAttributes.push({
                    attributeName: foundAttributeSchema.name,
                    type: currentAttributeType,
                    value: value,
                  })
                  break
                case AttributeType.Component:
                  try {
                    // possibly controversial
                    // if the prop is a component we deserialise it as markdown
                    // this way we get nodes that we can use for slate
                    const rawComponent = (attribute.value as ComplexAttribute)
                      .value

                    const { result } = deserialize(
                      formatComponentWithChildenAndNoNewLines(rawComponent),
                      schema
                    )

                    jsxNode.reactAttributes.push({
                      attributeName: foundAttributeSchema.name,
                      type: currentAttributeType,
                      value: result[0],
                    })
                  } catch (err) {
                    const error = err as Error
                    console.log(
                      `Error with deserializing component prop`,
                      error.message
                    )
                  }
                  break
              }
            }
          }

          // we parsed all the existing attributes, but there might still be
          // a drift between the component and the schema
          // in that case we initialise the missing values here
          for (const field of componentSchema.fields || []) {
            if (field.name === 'children') continue

            const reactAttributeIndex = jsxNode.reactAttributes.findIndex(
              (a) => a.attributeName === field.name
            )

            if (reactAttributeIndex < 0) {
              let defaultValue: any | undefined = field.type.default
              let defaultType = field.type.default
                ? returnValueAttributeType(field.type.default)
                : AttributeType.Literal

              // special edge case for component props
              if (field.type.widget === 'markdown' && defaultValue) {
                // default value should be a stringified component
                // so we deserialise it first
                const { result } = deserialize(
                  formatComponentWithChildenAndNoNewLines(defaultValue),
                  schema
                )
                // then we set the new values here
                defaultValue = result[0]
                defaultType = AttributeType.Component
              }

              // @ts-expect-error
              if (field.type.multiple && !isArray(defaultValue)) {
                defaultValue = [defaultValue]
                defaultType = AttributeType.Array
              }

              jsxNode.reactAttributes.push({
                attributeName: field.name,
                type: defaultType,
                value: defaultValue,
              })
            }
          }
        }
      }
    })
    return tree
  }
}

/**
 * Deserialize an MDX string without validation,
 * we use this to verify our schema output or regenerate bad attributes
 */
export const safeDeserialize = (value: string) => {
  const parsed = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSlate)
    .processSync(value)

  return parsed
}
