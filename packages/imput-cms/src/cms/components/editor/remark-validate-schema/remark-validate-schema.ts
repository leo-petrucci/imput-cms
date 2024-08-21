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
import {
  ComplexAttribute,
  MdxArrayExpression,
  MdxLiteral,
  MdxObjectExpression,
} from '../../../types/mdxNode'
import {
  formatComponentWithChildenAndNoNewLines,
  isEmptyFragment,
  returnArrayValues,
  returnEmtpyParagraph,
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
        // we also consider ANOTHER (!) edge case, in which a component
        // is just a JSX fragment, which doesn't have a name
        if (componentSchema === undefined && jsxNode.name !== null) {
          parent.children.splice(index || 0, 1)
        } else {
          // if it exists we loop through its attributes and check them

          if (componentSchema) {
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
                  currentAttributeType === AttributeType.Array &&
                  foundAttributeSchema.type.widget !== 'json'
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
                    const attributeValue = (
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
                    })

                    jsxNode.reactAttributes.push({
                      attributeName: foundAttributeSchema.name,
                      type:
                        foundAttributeSchema.type.widget === 'json'
                          ? AttributeType.Json
                          : currentAttributeType,
                      value:
                        foundAttributeSchema.type.widget === 'json'
                          ? JSON.stringify(attributeValue)
                          : attributeValue,
                    })
                    break

                  case AttributeType.Object:
                    const objectValue = returnObjectValues(
                      (attribute.value as ComplexAttribute | undefined)?.data
                        .estree.body[0].expression as MdxObjectExpression
                    )
                    // if the object is going to be edited as JSON then it has to be stringified
                    // or it will cause issues later on. It also has its own type for serializing
                    // correctly later.
                    //
                    // that said we still want to support objects in case we want to do some
                    // fancy stuff in the future
                    const value =
                      foundAttributeSchema.type.widget === 'json'
                        ? JSON.stringify(objectValue)
                        : objectValue
                    jsxNode.reactAttributes.push({
                      attributeName: foundAttributeSchema.name,
                      type:
                        foundAttributeSchema.type.widget === 'json'
                          ? AttributeType.Json
                          : currentAttributeType,
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

                      let newValue = result

                      // edge case, we don't want to handle fragments like components
                      // if it's an empty fragment we just render an empty paragraph
                      if (isEmptyFragment(result[0] as MdxElementShape)) {
                        newValue = returnEmtpyParagraph()
                      }

                      jsxNode.reactAttributes.push({
                        attributeName: foundAttributeSchema.name,
                        type: currentAttributeType,
                        value: newValue,
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

              // if an attribute is supposed to be there but doesn't exist
              if (reactAttributeIndex < 0) {
                let defaultValue: any | undefined = field.type.default
                let defaultType = field.type.default
                  ? returnValueAttributeType(field.type.default)
                  : AttributeType.Literal

                // special edge case for component props
                if (field.type.widget === 'markdown') {
                  if (defaultValue) {
                    // default value should be a stringified component
                    // so we deserialise it first
                    const { result } = deserialize(
                      formatComponentWithChildenAndNoNewLines(defaultValue),
                      schema
                    )
                    // then we set the new values here
                    defaultValue = result[0]
                  } else {
                    defaultValue = returnEmtpyParagraph()
                  }
                  defaultType = AttributeType.Component
                }

                // @ts-expect-error
                // if it's supposed to be an array and it's not
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
      }
    })
    return tree
  }
}
