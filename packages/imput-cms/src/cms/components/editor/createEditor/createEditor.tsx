import React from 'react'
import { useFormItem } from '@imput/components/form'
import { useFormContext, useController } from 'react-hook-form'
import Editor, { serialize } from '../editor'
import { DepthProvider } from '../depthContext'

export const CreateEditor = () => {
  const { name, rules } = useFormItem()
  const { control, setValue, watch } = useFormContext()

  const { field } = useController({
    name,
    control,
    rules,
  })

  const rawBody = watch(name)

  const handleChange = React.useCallback(
    (nextValue: any[]) => {
      // field.onChange(serialized)
      field.onChange(nextValue)

      // if this is the main body we save the raw slate array to form
      if (name === 'body') {
        // serialize slate state to a markdown string
        const serialized = nextValue.map((v) => serialize(v)).join('')
        setValue('serializedBody', serialized)
      }
    },
    [field]
  )

  return (
    <Editor
      value={
        rawBody && rawBody.length > 0
          ? rawBody
          : [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ]
      }
      onChange={(value) => handleChange(value)}
    />
  )
}
