import isString from 'lodash/isString'
import set from 'lodash/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { ReactEditor, useSlateStatic } from 'slate-react'
import Editor from '../../../../cms/components/editor'
import { CustomRenderElementProps } from '../../../../cms/components/editor/element'
import { editAttributes } from '../../../../cms/components/editor/lib/editAttributes'
import { editReactChildren } from '../../../../cms/components/editor/lib/editReactChildren'
import { MdxElementShape } from '../../../../cms/components/editor/mdxElement'
import Label from '../../../../cms/components/designSystem/label'
import Flex from '../../../../cms/components/designSystem/flex'
import { Descendant, Node } from 'slate'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import Select from '../../../../cms/components/designSystem/select'
import Switch from '../../../../cms/components/designSystem/switch'
import Input from '../../../../cms/components/designSystem/input'
import { MDXNode } from '../../../../cms/types/mdxNode'
import { Box } from '@meow/components'
import { mdxAccessors } from '../../../../cms/components/editor/lib/mdx'
import Codeblock from '../../../../cms/components/designSystem/codeblock'
import React from 'react'

/**
 *
 */
const ComponentEditor = (props: CustomRenderElementProps) => {
  const { element } = props
  const editor = useSlateStatic() as ReactEditor
  const mdxElement = element as MdxElementShape
  const { id } = mdxElement

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

  return (
    <>
      <Flex direction="column" gap="2">
        {componentSchema?.map((c) => {
          // children are handled differently
          // markdown can only be used for children
          if (c.name === 'children' || c.type.widget === 'markdown') {
            return
          }

          // match prop to schema from settings
          let prop = {
            ...(mdxElement.attributes.find(
              (a) => a.name === c.name
            ) as MDXNode),
          }

          // if prop is undefined it means the schema does not match the prop and we stop the component here
          if (prop === undefined) {
            return (
              <Box
                key={c.name}
                css={{
                  background: '$red-100',
                  borderRadius: '$md',
                  padding: '$2',
                  color: '$red-700',
                  fontSize: '$sm',
                }}
              >
                There was an error with your schema and a control for {c.name}{' '}
                could not be rendered.
              </Box>
            )
          }

          let value: any

          if (isString(prop.value)) {
            value = prop.value
          } else {
            // different types require different handling
            switch (prop.value.data.estree.body[0].expression.type) {
              // For bools and numbers we want to get the raw (unstringified) value
              case 'Literal':
                value = get(
                  prop,
                  mdxAccessors[prop.value.data.estree.body[0].expression.type]
                )
                break
              // For arrays and objects we'll just pull a string and render it in a special editor
              case 'ArrayExpression':
              case 'ObjectExpression':
                value = get(
                  prop,
                  mdxAccessors[prop.value.data.estree.body[0].expression.type]
                )
                break
            }
          }

          switch (c.type.widget) {
            case 'date':
            case 'datetime':
            case 'string':
              const getInputType = () => {
                switch (c.type.widget) {
                  case 'date':
                    return 'date'
                  case 'datetime':
                    return 'datetime-local'
                  default:
                  case 'string':
                    return 'text'
                }
              }
              return (
                <Flex direction="column" gap="1" key={c.name}>
                  <Label htmlFor={`string-prop-${c.name}`}>{c.label}</Label>
                  <Input
                    type={getInputType()}
                    name={`string-prop-${c.name}`}
                    defaultValue={value}
                    onChange={(e) => {
                      var newObj = cloneDeep(prop)
                      set(newObj, 'value', e.target.value)
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </Flex>
              )
            case 'boolean':
              return (
                <Flex direction="column" gap="1" key={c.name}>
                  <Label htmlFor={`boolean-prop-${c.name}`}>{c.label}</Label>
                  <Switch
                    name={`boolean-prop-${c.name}`}
                    checked={value as boolean}
                    onCheckedChange={(val) => {
                      var newObj = cloneDeep(prop)
                      set(
                        newObj,
                        mdxAccessors[
                          prop.value.data.estree.body[0].expression.type
                        ],
                        val
                      )
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </Flex>
              )
            case 'select':
              const options = c.type.options.map((v) => ({
                value: v,
                label: v,
              }))
              const selectVal = options.find((o) => o.value === value)

              return (
                <Flex direction="column" gap="1" key={c.name}>
                  <Label htmlFor={`select-prop-${c.name}`}>{c.label}</Label>
                  <Select
                    defaultValue={selectVal}
                    onChange={(option) => {
                      if (option) {
                        var newObj = cloneDeep(prop)
                        set(
                          newObj,
                          mdxAccessors[
                            prop.value.data.estree.body[0].expression.type
                          ],
                          option.value
                        )
                        editAttributes(path, mdxElement, newObj, editor)
                      }
                    }}
                    options={options}
                  />
                </Flex>
              )
            case 'json':
              return (
                <Flex direction="column" gap="1" key={c.name}>
                  <Label htmlFor={`select-prop-${c.name}`}>{c.label}</Label>
                  <Codeblock
                    defaultValue={value}
                    hideLanguageSelect
                    language="json"
                    onValueChange={(code: any) => {
                      var newObj = cloneDeep(prop)
                      set(
                        newObj,
                        mdxAccessors[
                          prop.value.data.estree.body[0].expression.type
                        ],
                        code
                      )
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </Flex>
              )
          }
        })}

        {hasChildren && (
          <Flex direction="column" gap="1">
            <Label htmlFor={`component-children`}>Children</Label>
            <Editor
              value={reactChildren!}
              onChange={
                (val) => editReactChildren(path, mdxElement, editor, val)
                // editReactChildrenById(id, mdxElement, editor, val)
              }
            />
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default ComponentEditor
