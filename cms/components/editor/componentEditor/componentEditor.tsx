import isString from 'lodash/isString'
import set from 'lodash/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { ReactEditor, useSlate } from 'slate-react'
import Editor from 'cms/components/editor'
import { CustomRenderElementProps } from 'cms/components/editor/element'
import { editAttributes } from 'cms/components/editor/lib/editAttributes'
import { editReactChildren } from 'cms/components/editor/lib/editReactChildren'
import { MdxElementShape } from 'cms/components/editor/mdxElement'
import Label from 'cms/components/designSystem/label'
import Flex from 'cms/components/designSystem/flex'
import { Node } from 'slate'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import Select from 'cms/components/designSystem/select'
import Switch from 'cms/components/designSystem/switch'
import Input from 'cms/components/designSystem/input'
import { MDXNode } from 'cms/types/mdxNode'
import CodeBlockEditor from 'cms/components/editor/codeblockEditor'
import Box from 'cms/components/designSystem/box'
import { mdxAccessors } from '../lib/mdx'

/**
 *
 */
const ComponentEditor = (props: CustomRenderElementProps) => {
  const { element } = props
  const editor = useSlate() as ReactEditor
  const mdxElement = element as MdxElementShape
  const { id } = mdxElement

  const path = ReactEditor.findPath(editor, element as unknown as Node)

  const { getSchema } = useCMS()

  const componentSchema = getSchema(mdxElement.name)

  return (
    <>
      <Flex direction="column" gap="2">
        {componentSchema?.map((c) => {
          // children are handled differently
          if (c.name === 'children') {
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
            // case 'json':
            //   return (
            //     <Flex direction="column" gap="1" key={c.name}>
            //       <Label htmlFor={`select-prop-${c.name}`}>{c.label}</Label>
            //       <CodeBlockEditor
            //         {...props}
            //         key={c.name}
            //         value={prop}
            //         editor={editor}
            //         name={prop.name}
            //         json={value as string}
            //       />
            //     </Flex>
            //   )
          }
        })}

        <Flex direction="column" gap="1">
          <Label htmlFor={`component-children`}>Children</Label>
          <Editor
            value={mdxElement.reactChildren}
            onChange={(val) => editReactChildren(path, mdxElement, editor, val)}
          />
        </Flex>
      </Flex>
    </>
  )
}

export default ComponentEditor
