import React from 'react'
import { Textarea as BaseTextarea, TextareaProps } from '../Textarea'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../form'

export interface ControlledTextareaProps extends TextareaProps {}

const Textarea = ({ ...rest }: ControlledTextareaProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: rest.defaultValue,
  })

  return <BaseTextarea {...rest} {...field} />
}

Textarea.displayName = 'Textarea'

export { Textarea }
