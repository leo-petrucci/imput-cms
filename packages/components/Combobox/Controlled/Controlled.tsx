import { useController, useFormContext } from 'react-hook-form'
import React from 'react'
import { Combobox } from '../Combobox'
import { useFormItem } from '../../form'

export interface ControlledComboboxProps
  extends React.ComponentProps<typeof Combobox> {}

const ComboboxControlled = (props: ControlledComboboxProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const {
    field: { value, ...fields },
  } = useController({
    name: name,
    control: form.control,
    rules,
  })

  return (
    <Combobox
      {...props}
      {...fields}
      defaultValue={value}
      onValueChange={(val) => {
        fields.onChange(val?.value)
      }}
      data-testid={`${name}-combobox`}
    />
  )
}

const MultiComboboxControlled = (props: ControlledComboboxProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const {
    field: { value, ...fields },
  } = useController({
    name: name,
    control: form.control,
    rules,
  })

  return (
    <Combobox.Multi
      {...props}
      {...fields}
      defaultValue={value}
      onValueChange={(val) => {
        fields.onChange(val.map((v) => v.value))
      }}
      data-testid={`${name}-combobox`}
    />
  )
}

ComboboxControlled.Multi = MultiComboboxControlled

export { ComboboxControlled as ComboBox }
