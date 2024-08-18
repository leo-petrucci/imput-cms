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
import { isEmpty } from 'lodash'

/**
 *
 */
export const ComponentEditor = ({
  element,
}: Pick<CustomRenderElementProps, 'element'>) => {
  const editor = useSlateStatic() as ReactEditor
  const mdxElement = element as MdxElementShape

  console.log(mdxElement)

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
    return Object.fromEntries(
      mdxElement.reactAttributes.map((a) => {
        return [a.attributeName, a.value]
      })
    )
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
      // skip if the attribute is children, it's handled somewhere else
      if (name === 'children') continue

      const attributeIndex = clonedMdxElement.reactAttributes.findIndex(
        (a) => a.attributeName === name
      )

      if (attributeIndex > -1) {
        clonedMdxElement.reactAttributes[attributeIndex].value = value
      }
    }

    Transforms.setNodes<MdxElementShape>(
      editor,
      {
        reactAttributes: clonedMdxElement.reactAttributes,
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
