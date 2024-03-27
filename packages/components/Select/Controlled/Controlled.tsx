import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../form'
import { Select as BaseSelect, SelectProps } from '../Select'

export interface ControlledInputProps extends SelectProps {}

const Select = ({ children, ...rest }: ControlledInputProps) => {
  const childrenArray = React.Children.toArray(children) as JSX.Element[]

  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field, fieldState } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: rest.defaultValue || '',
    shouldUnregister: true,
  })

  const defaultValue = childrenArray.find(
    (child) => child.props.value === field.value
  )?.props.value

  return (
    <BaseSelect
      {...rest}
      {...field}
      id={field.name}
      value={defaultValue}
      onChange={(e) => field.onChange(e.target.value)}
      className={`${fieldState.invalid ? 'invalid' : ''}`}
    >
      {children}
    </BaseSelect>
  )
}

export { Select }
