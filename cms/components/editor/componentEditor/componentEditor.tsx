import { isString } from 'lodash'
import { ReactEditor, useSlate } from 'slate-react'
import Editor from '../editor'
import { CustomRenderElementProps } from '../element'
import { editAttributes } from '../lib/editAttributes'
import { editReactChildren } from '../lib/editReactChildren'
import { MdxElementShape } from '../mdxElement'
import Label from '../../designSystem/label'
import Flex from '../../designSystem/flex'
import { Node } from 'slate'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'
import Select from '../../designSystem/select'
import Switch from '../../designSystem/switch'
import Input from '../../designSystem/input'

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
    <Flex direction="column" gap="2">
      {componentSchema?.map((c) => {
        // children are handled differently
        if (c.name === 'children') {
          return
        }

        const prop = mdxElement.attributes.find((a) => a.name === c.name)

        if (prop === undefined) {
          return <>There was an error with your schema.</>
        }

        let value: any

        if (isString(prop.value)) {
          value = prop.value
        } else {
          value = prop.value.value
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
                    editAttributes(
                      path,
                      mdxElement,
                      prop,
                      editor,
                      e.target.value
                    )
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
                    editAttributes(path, mdxElement, prop, editor, val)
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

            console.log({
              options,
              value,
              selectVal,
            })
            return (
              <Flex direction="column" gap="1" key={c.name}>
                <Label htmlFor={`select-prop-${c.name}`}>{c.label}</Label>
                <Select
                  defaultValue={selectVal}
                  onChange={(option) => {
                    if (option)
                      editAttributes(
                        path,
                        mdxElement,
                        prop,
                        editor,
                        option.value
                      )
                  }}
                  options={options}
                />
              </Flex>
            )
        }
      })}
      {mdxElement.attributes.map((a) => {
        /**
         * If the prop is a string it's easy
         */
        // if (isString(a.value)) {
        //   return (
        //     <Flex direction="column" key={a.name}>
        //       <Label htmlFor={`string-prop-${a.name}`}>{a.name}</Label>
        //       <input
        //         type="text"
        //         id={`string-prop-${a.name}`}
        //         defaultValue={a.value}
        //         onChange={(e) => {
        //           editAttributes(path, mdxElement, a, editor, e.target.value)
        //         }}
        //       />
        //     </Flex>
        //   )
        //   /**
        //    * If it's not a string we'll have to figure out what it is exactly
        //    */
        // } else {
        //   return (
        //     <CodeBlockEditor
        //       {...props}
        //       key={a.name}
        //       value={a}
        //       editor={editor}
        //     />
        //   )
        // }
      })}
      <Flex direction="column" gap="1">
        <Label htmlFor={`component-children`}>Children</Label>
        <Editor
          value={mdxElement.reactChildren}
          onChange={(val) => editReactChildren(id, mdxElement, editor, val)}
        />
      </Flex>
    </Flex>
  )
}

export default ComponentEditor
