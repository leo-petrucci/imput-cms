import isString from 'lodash/isString'
import cloneDeep from 'lodash/cloneDeep'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { Editor } from '../../../../cms/components/editor'
import { CustomRenderElementProps } from '../../../../cms/components/editor/element'
import { setAttributeToMdxElement } from '../../../../cms/components/editor/lib/editAttributes'
import { editReactChildren } from '../../../../cms/components/editor/lib/editReactChildren'
import { MdxElementShape } from '../../../../cms/components/editor/mdxElement'
import { Descendant, Node, Transforms } from 'slate'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { Label } from '@imput/components/Label'
import Form from '@imput/components/form'
import { MDXNode } from '../../../../cms/types/mdxNode'
import {
  getAttribute,
  setAttribute,
} from '../../../../cms/components/editor/lib/mdx'
import React from 'react'
import { generateComponentProp } from '../lib/generateComponentProp'
import { EditorFields } from '../fields'
import { FieldType } from '../../../contexts/cmsContext/context'
import { useForm } from 'react-hook-form'
import isArray from 'lodash/isArray'

/**
 *
 */
export const ComponentEditor = ({
  element,
}: Pick<CustomRenderElementProps, 'element'>) => {
  const editor = useSlateStatic() as ReactEditor
  const mdxElement = element as MdxElementShape

  const path = ReactEditor.findPath(editor, element as unknown as Node)

  const { getSchema } = useCMS()

  const componentSchema = getSchema(mdxElement.name)

  const hasChildren = Boolean(
    componentSchema?.find((c) => c.name === 'children')
  )

  // we need to consider situations in which a component is set up to have children
  // but was saved without having any
  //
  // slate is weird, and if we don't initialise the value that we want to change it'll
  // break as soon as we try to edit children
  //
  // this returns an empty paragraph only if the object accepts children but its children don't exist
  //
  // could be flaky, needs testing 🤷‍♂️
  const reactChildren = React.useMemo(() => {
    // if component has children in schema
    if (hasChildren) {
      const node = Node.get(editor, path) as MdxElementShape
      // but has no children in the editor
      const hasSlateChildren = node.reactChildren.some(
        // @ts-ignore
        (c) => c.type !== undefined
      )

      if (!hasSlateChildren) {
        return [
          {
            // @ts-ignore
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ] as Descendant[]
      }

      return mdxElement.reactChildren as Descendant[]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChildren])

  // @ts-expect-error
  // transform component schema into editor field schema
  // the two shouldn't be different, idk what I was thinking
  const componentsToFields: FieldType[] = React.useMemo(() => {
    return (
      componentSchema
        // we handle children and markdown props differently
        ?.filter((c) => c.name !== 'children' || c.type.widget !== 'markdown')!
        .map((c) => ({
          name: c.name,
          label: c.label,
          widget: c.type.widget,
          // @ts-expect-error fuck typescript
          options: c.type.options || [],
          // @ts-expect-error fuck typescript
          multiple: c.type.multiple || false,
        }))
    )
  }, [])

  // generate defaultvalues in a way that they'll be readable by the form
  const defaultValues = React.useMemo(() => {
    const values = componentSchema!.map((c) => {
      // match prop to schema from settings
      let prop = {
        ...(mdxElement.attributes.find((a) => a.name === c.name) as MDXNode),
      }

      // if the user has changed their schema since the last time this component was written
      // `prop` will be `{}`
      // we catch this edge case by generating the attribute on the fly
      if (!prop.value) {
        prop = generateComponentProp(c)
      }

      let value: any

      /**
       * Here we convert deserialized values to values we can use in our components
       */
      if (isString(prop.value)) {
        // if the value is a string, then it's easy
        value = prop.value
      } else {
        // if it's not a string then it'll be a bit more complex
        try {
          const expressionType = prop.value?.data.estree.body[0].expression.type
          if (expressionType === 'ArrayExpression') {
            // if it's an array, a number, a boolean then we can just JSON.parse it
            value = JSON.parse(prop.value?.value || '')
          } else {
            value = getAttribute(
              prop,
              prop.value?.data.estree.body[0].expression.type
            )
          }
        } catch (err) {
          // however in some cases it can be a JS object
          // {
          //   Test: "something"
          // }
          // which fails when parsed
          // in that case we just take the object as-is
          // since it'll most likely just be edited by a code block
          value = prop.value?.value
        }
      }

      return [c.name, value]
    })

    return Object.fromEntries(values)
  }, [element])

  const form = useForm({ defaultValues })

  const propValues = form.watch()

  /**
   * We listen to changes on the form values, we then go through them one by one
   * and edit a copy of mdxelement. Once the loop is done we commit the new values to the editor.
   *
   * This can definitely be optimised further.
   */
  React.useEffect(() => {
    const clonedMdxElement = cloneDeep(mdxElement)
    for (const [name, value] of Object.entries(propValues)) {
      const propSchema = componentSchema!.find((c) => c.name === name)!
      // match prop to schema from settings
      let prop = {
        ...(clonedMdxElement.attributes.find(
          (a) => a.name === name
        ) as MDXNode),
      }
      // deeply clone the attribute to edit it
      var newObj = prop
      // if the value is an array
      if (isArray(value)) {
        setAttribute(
          newObj,
          'ArrayExpression',
          JSON.stringify(value.map((v) => v)).replaceAll('\\', '')
        )
        const newAttributes = setAttributeToMdxElement(clonedMdxElement, newObj)
        clonedMdxElement.attributes = newAttributes
        // if we use the json widget then we need to parse it differently
      } else if (propSchema && propSchema.type.widget === 'json') {
        setAttribute(newObj, 'ObjectExpression', value)
        const newAttributes = setAttributeToMdxElement(clonedMdxElement, newObj)
        clonedMdxElement.attributes = newAttributes
      } else {
        // everything else we consider it a literal
        setAttribute(newObj, 'Literal', value)
        const newAttributes = setAttributeToMdxElement(clonedMdxElement, newObj)
        clonedMdxElement.attributes = newAttributes
      }
    }

    Transforms.setNodes<MdxElementShape>(
      editor,
      {
        attributes: clonedMdxElement.attributes,
      },
      {
        at: path,
      }
    )
  }, [JSON.stringify(propValues)])

  return (
    <>
      <div
        className="imp-flex imp-flex-col imp-gap-2"
        data-testid="component-editor"
      >
        <Form form={form} onSubmit={() => {}}>
          <EditorFields fields={componentsToFields} />
        </Form>

        {hasChildren && (
          <div className="imp-flex imp-flex-col imp-gap-1">
            <Label htmlFor={`component-children`}>Children</Label>
            <Editor
              value={reactChildren!}
              onChange={(val) => {
                editReactChildren(path, mdxElement, editor, val)
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ComponentEditor
