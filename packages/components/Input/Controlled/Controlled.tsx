import React from 'react'
import { Input as BaseInput, InputProps } from '../Input'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../form'

export interface ControlledInputProps extends InputProps {}

const Input = ({ ...rest }: ControlledInputProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: rest.defaultValue,
  })

  return <BaseInput {...rest} {...field} />
}

Input.displayName = 'Input'

export { Input }
