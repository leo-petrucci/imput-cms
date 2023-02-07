import { Widgets } from '../../../../../cms/contexts/cmsContext/context'
import { useCMS } from '../../../../../cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from '../../../../../cms/queries/github'
import isArray from 'lodash/isArray'
import React from 'react'
import Select from '../../../../../cms/components/designSystem/select'
import { useController, useFormContext } from 'react-hook-form'
import { GroupBase, Props } from 'react-select'
import { useFormItem } from '../../../../../cms/components/forms/form/form'

type SelectAndWidget = React.ComponentProps<typeof Select> &
  Omit<
    Extract<
      Widgets,
      {
        widget: 'relation'
      }
    >,
    'widget'
  >

export interface RelationSelectProps extends SelectAndWidget {}

const RelationSelect = ({
  collection,
  value_field,
  display_fields,
  ...props
}: RelationSelectProps) => {
  const { collections } = useCMS()
  const foundCollection = collections.find((c) => c.name === collection)

  if (!foundCollection) {
    throw new Error(
      `Could not find collection "${collection}" on relation widget.`
    )
  }

  const { isSuccess, data } = useGetGithubCollection(foundCollection!.folder)

  const valueKey = value_field
  const displayKey = display_fields || value_field

  const optionsMemo = React.useMemo(() => {
    if (isSuccess) {
      return data?.map((d) => {
        const value = d.data[valueKey]
        const label = d.data[displayKey]
        if (!value || !label) {
          throw new Error(
            `An error occurred while displaying data in the relation widget. Are you sure your "value_field" and "display_fields" properties exist in the "${collection}" collection?`
          )
        }

        return {
          value,
          label,
        }
      })
    } else {
      return []
    }
  }, [isSuccess])

  // this should handle single selects
  // as well as multi selects with multiple values
  // and multi selects with non-array values
  const valueMemo = React.useMemo(() => {
    if (props.value && isSuccess) {
      if (isArray(props.value)) {
        return props.value.map((v: any) =>
          optionsMemo?.find((o) => o.value === v)
        )
      } else {
        return optionsMemo?.find((o) => o.value === props.value)
      }
    } else {
      return undefined
    }
  }, [props.value, isSuccess, optionsMemo])

  if (!isSuccess) return <>Loading...</>

  return (
    <Select {...props} value={valueMemo || undefined} options={optionsMemo} />
  )
}

interface ControlledSelectProps extends SelectAndWidget {
  name?: string
}

function Controlled<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: ControlledSelectProps) {
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
    <RelationSelect
      {...props}
      {...fields}
      value={value}
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

RelationSelect.Controlled = Controlled

export default RelationSelect
