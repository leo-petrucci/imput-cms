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
import { Descendant, Node } from 'slate'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { Input } from '@imput/components/Input'
import { Switch } from '@imput/components/Switch'
import Codeblock from '@imput/components/codeblock'
import { Label } from '@imput/components/Label'
import { Combobox } from '@imput/components/Combobox'
import { MDXNode } from '../../../../cms/types/mdxNode'
import {
  mdxAccessors,
  mdxAccessorsSwitch,
} from '../../../../cms/components/editor/lib/mdx'
import React from 'react'
import { generateComponentProp } from '../lib/generateComponentProp'
import ImagePicker from '../../imagePicker'

/**
 *
 */
const ComponentEditor = (props: CustomRenderElementProps) => {
  const { element } = props
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

  return (
    <>
      <div className="flex flex-col gap-2" data-testid="component-editor">
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
              <div
                key={c.name}
                className="bg-destructive/10 p-2 rounded text-destructive text-sm"
              >
                There was an error with your schema and a control for {c.name}{' '}
                could not be rendered.
              </div>
            )
          }

          let value: any

          // if the user has changed their schema since the last time this component was written
          // `prop` will be `{}`
          // we catch this edge case by generating the attribute on the fly
          if (!prop.value) {
            prop = generateComponentProp(c)
          }

          /**
           * Here we convert deserialized values to values we can use in our components
           */
          if (isString(prop.value)) {
            // if the value is a string, then it's easy
            value = prop.value
          } else {
            // if it's not a string then it'll be a bit more complex
            if (prop.value?.value) {
              try {
                // if it's an array, a number, a boolean then we can just JSON.parse it
                value = JSON.parse(prop.value?.value)
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
            } else {
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
                <div className="flex flex-col gap-1" key={c.name}>
                  <Label htmlFor={`input-string-prop-${c.name}`}>
                    {c.label}
                  </Label>
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
                </div>
              )
            case 'boolean':
              return (
                <div className="flex flex-col gap-1" key={c.name}>
                  <Label htmlFor={`switch-boolean-prop-${c.name}`}>
                    {c.label}
                  </Label>
                  <Switch
                    name={`boolean-prop-${c.name}`}
                    defaultChecked={value as boolean}
                    onCheckedChange={(val) => {
                      var newObj = cloneDeep(prop)
                      set(
                        newObj,
                        mdxAccessors[
                          prop.value!.data.estree.body[0].expression.type
                        ],
                        val
                      )
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </div>
              )
            case 'select':
              const options = c.type.options.map((v) => ({
                value: v,
                label: String(v),
              }))

              // different stuff depending if the component allows multiple values or not
              if (c.type.multiple) {
                const selectVal = options.filter((o) =>
                  value?.includes(o.value)
                )
                return (
                  <div className="flex flex-col gap-1" key={c.name}>
                    <Label htmlFor={`combobox-select-prop-${c.name}`}>
                      {c.label}
                    </Label>

                    <Combobox.Multi
                      options={options}
                      defaultValue={selectVal.map((v) => v.value)}
                      onValueChange={(val) => {
                        if (val) {
                          var newObj = cloneDeep(prop)
                          set(
                            newObj,
                            mdxAccessors[
                              prop.value!.data.estree.body[0].expression.type
                            ],
                            JSON.stringify(val.map((v) => v.value)).replaceAll(
                              '\\',
                              ''
                            )
                          )
                          editAttributes(path, mdxElement, newObj, editor)
                        }
                      }}
                    />
                  </div>
                )
              } else {
                const selectVal = options.find((o) => o.value === value)

                return (
                  <div className="flex flex-col gap-1" key={c.name}>
                    <Label htmlFor={`combobox-select-prop-${c.name}`}>
                      {c.label}
                    </Label>

                    <Combobox
                      id={`combobox-select-prop-${c.name}`}
                      options={options}
                      defaultValue={selectVal?.value}
                      onValueChange={(val) => {
                        var newObj = cloneDeep(prop)
                        set(
                          newObj,
                          mdxAccessorsSwitch(
                            prop.value!.data?.estree.body[0].expression.type
                          ),
                          val?.value
                        )
                        editAttributes(path, mdxElement, newObj, editor)
                      }}
                    />
                  </div>
                )
              }

            case 'json':
              return (
                <div className="flex flex-col gap-1" key={c.name}>
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
                          prop.value!.data.estree.body[0].expression.type
                        ],
                        code
                      )
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </div>
              )
            case 'image':
              return (
                <div className="flex flex-col gap-1" key={c.name}>
                  <Label htmlFor={`select-prop-${c.name}`}>{c.label}</Label>
                  <ImagePicker
                    image={value}
                    onImageChange={(src) => {
                      console.log('newImage', src)
                      var newObj = cloneDeep(prop)
                      set(newObj, 'value', src)
                      editAttributes(path, mdxElement, newObj, editor)
                    }}
                  />
                </div>
              )
          }
        })}

        {hasChildren && (
          <div className="flex flex-col gap-1">
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
