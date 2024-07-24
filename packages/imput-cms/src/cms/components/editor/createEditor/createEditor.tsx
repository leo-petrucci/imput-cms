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

  const rawBody = watch('rawBody')

  const handleChange = React.useCallback(
    (nextValue: any[]) => {
      // serialize slate state to a markdown string
      const serialized = nextValue.map((v) => serialize(v)).join('')
      field.onChange(serialized)

      // if this is the main body we save the raw slate array to form
      if (name === 'body') {
        setValue('rawBody', nextValue)
      }
    },
    [field]
  )

  return (
    <DepthProvider>
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
    </DepthProvider>
  )
}
