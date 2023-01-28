import { useFormItem } from 'cms/components/forms/form/form'
import { useController, useFormContext } from 'react-hook-form'
import ReactSelect, { GroupBase, Props } from 'react-select'

function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return <ReactSelect {...props} />
}

interface ControlledSelectProps {
  name?: string
}

function Controlled<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group> & ControlledSelectProps) {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: props.defaultValue,
  })
  return (
    <ReactSelect
      {...props}
      {...field}
      onChange={(v) => {
        // @ts-expect-error
        field.onChange(v.value)
      }}
    />
  )
}

Select.Controlled = Controlled

export default Select
