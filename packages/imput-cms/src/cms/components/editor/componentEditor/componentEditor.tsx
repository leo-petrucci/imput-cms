import cloneDeep from 'lodash/cloneDeep'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { CustomRenderElementProps } from '../../../../cms/components/editor/element'
import { MdxElementShape, ReactAttribute } from '../Elements/MdxElement'
import { Descendant, Node, Path, Transforms } from 'slate'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import Form from '@imput/components/form'
import React, { useMemo, useRef } from 'react'
import { EditorFields } from '../fields'
import { FieldType } from '../../../contexts/cmsContext/context'
import { useForm } from 'react-hook-form'
import { editReactChildren } from '../lib/editReactChildren'
import Editor from '../editor'
import { Label } from '@imput/components/Label'
import debounce from 'lodash/debounce'
import { SingleDepthProvider } from '../depthContext/depthContextProvider'

const debouncedUpdateAttributes = (
  editor: ReactEditor,
  reactAttributes: ReactAttribute[],
  path: Path
) => {
  Transforms.setNodes<MdxElementShape>(
    editor,
    {
      reactAttributes,
    },
    {
      at: path,
    }
  )
}

/**
 * This is the central component responsible for editing
 * component props.
 */
export const ComponentEditor = ({
  element,
}: Pick<CustomRenderElementProps, 'element'>) => {
  const editor = useSlateStatic() as ReactEditor
  const mdxElementRef = useRef<MdxElementShape>(element as MdxElementShape)
  const mdxElement = mdxElementRef.current

  const path = ReactEditor.findPath(editor, element as unknown as Node)

  const { getSchema } = useCMS()

  const componentSchema = useMemo(() => {
    if (mdxElement.name) return getSchema(mdxElement.name)
    return undefined
  }, [])

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
  }, [])

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
    const clonedPropValues = cloneDeep(propValues)
    for (const [name, value] of Object.entries(clonedPropValues)) {
      // skip if the attribute is children, it's handled somewhere else
      if (name === 'children') continue

      const attributeIndex = clonedMdxElement.reactAttributes.findIndex(
        (a) => a.attributeName === name
      )

      if (attributeIndex > -1) {
        clonedMdxElement.reactAttributes[attributeIndex].value = value
      }
    }
    debouncedUpdateAttributes(editor, clonedMdxElement.reactAttributes, path)
  }, [JSON.stringify(propValues)])

  return (
    // @ts-expect-error TODO: Fix this
    <SingleDepthProvider id={element.id}>
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
    </SingleDepthProvider>
  )
}

export default ComponentEditor
