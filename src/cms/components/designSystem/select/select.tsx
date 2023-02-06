import { useFormItem } from 'cms/components/forms/form/form'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import ReactSelect, { GroupBase, Props } from 'react-select'
import isArray from 'lodash/isArray'

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

  const {
    field: { value, ...fields },
  } = useController({
    name: name,
    control: form.control,
    rules,
  })

  // this should handle single selects
  // as well as multi selects with multiple values
  // and multi selects with non-array values
  const valueMemo = React.useMemo(() => {
    if (value) {
      if (isArray(value)) {
        return value.map((v: any) =>
          // @ts-expect-error
          props.options?.find((o) => o.value === v)
        )
      } else {
        // @ts-expect-error
        return props.options?.find((o) => o.value === value)
      }
    } else {
      return undefined
    }
  }, [value])

  return (
    <ReactSelect
      {...props}
      {...fields}
      // @ts-expect-error
      value={valueMemo || undefined}
      onChange={(v) => {
        if (props.isMulti) {
          // @ts-expect-error
          fields.onChange(v.map((o) => o.value))
        } else {
          // @ts-expect-error
          fields.onChange(v.value)
        }
      }}
    />
  )
}

Select.Controlled = Controlled

export default Select
