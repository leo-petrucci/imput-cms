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

/**
 * Renders the correct fields for the currently loaded collection
 */
const EditorFields = ({ fields }: { fields?: FieldType[] }) => {
  return (
    <>
      {fields?.map((f) => {
        const renderControl = () => {
          switch (f.widget) {
            case 'string':
              return <Input />
            case 'date':
              return <Input type="date" />
            case 'datetime':
              return <Input type="datetime-local" />
            case 'markdown':
              return <CreateEditor />
            case 'image':
              return <ImagePicker.Controlled />
            case 'boolean':
              return <SwitchControlled />
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
