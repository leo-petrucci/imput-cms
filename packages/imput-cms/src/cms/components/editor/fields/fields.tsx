import React from 'react'
import { FieldType } from '../../../contexts/cmsContext/context'
import ImagePicker from '../../../components/imagePicker'
import { SwitchControlled } from '@imput/components/Switch'
import { ComboBox } from '@imput/components/Combobox/Controlled'
import Relation from '../../../components/relation'
import { Input } from '@imput/components/Input/Controlled'
import ErrorBoundary from '@imput/components/errorBoundary'
import Form from '@imput/components/form'
import { CreateEditor } from '../createEditor'
import { Codeblock } from '@imput/components/codeblock/Controlled'
import { Textarea } from '@imput/components/Textarea/Controlled'
import { useFormContext } from 'react-hook-form'
import { Frame } from '../../organisms/Framed'

/**
 * Renders the correct fields for the currently loaded collection
 */
const EditorFields = ({ fields }: { fields?: FieldType[] }) => {
  return (
    <>
      {fields?.map((f) => {
        const renderControl = () => {
          switch (f.widget) {
            case 'object':
              const Component = f.component

              return (
                <Frame>
                  <Component useFormContext={useFormContext} />
                </Frame>
              )
            // const Wrapped = withFrame(Component)
            // return <Wrapped useFormContext={useFormContext} />
            case 'string':
              return <Input />
            case 'date':
              return <Input type="date" />
            case 'datetime':
              return <Input type="datetime-local" />
            case 'textarea':
              return <Textarea />
            case 'markdown':
              return <CreateEditor />
            case 'image':
              return <ImagePicker.Controlled />
            case 'boolean':
              return <SwitchControlled />
            // TODO: Switch this for an editor block
            // @ts-expect-error fix this later
            case 'json':
              return <Codeblock hideLanguageSelect language="js" />
            case 'select':
              if (f.multiple) {
                return (
                  <ComboBox.Multi
                    options={f.options.map((o) => ({
                      value: o,
                      label: o,
                    }))}
                  />
                )
              }

              return (
                <ComboBox
                  options={f.options.map((o) => ({
                    value: o,
                    label: o,
                  }))}
                />
              )
            case 'relation':
              return (
                <ErrorBoundary>
                  <Relation.Controlled
                    collection={f.collection}
                    value_field={f.value_field}
                    display_fields={f.display_fields}
                    isMulti={f.multiple || false}
                  />
                </ErrorBoundary>
              )
          }
        }

        switch (f.widget) {
          case 'string':
          case 'boolean':
          case 'date':
          case 'datetime':
          case 'image':
            if (f.multiple) {
              return (
                <Form.ItemField
                  hidden={f.hidden}
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  rules={f.rules}
                >
                  {renderControl()}
                </Form.ItemField>
              )
            } else {
              return (
                <Form.Item
                  hidden={f.hidden}
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  rules={f.rules}
                >
                  {renderControl()}
                </Form.Item>
              )
            }
          default:
            return (
              <Form.Item
                hidden={f.hidden}
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                {renderControl()}
              </Form.Item>
            )
        }
      })}
    </>
  )
}

export { EditorFields }
