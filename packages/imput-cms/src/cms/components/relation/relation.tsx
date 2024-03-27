import { Widgets } from '../../contexts/cmsContext/context'
import { useCMS } from '../../contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from '../../queries/github'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '@imput/components'
import { Combobox, ComboboxPrimtive } from '@imput/components/Combobox'

type SelectAndWidget = Omit<
  Extract<
    Widgets,
    {
      widget: 'relation'
    }
  >,
  'widget'
>

export interface RelationSelectProps
  extends SelectAndWidget,
    Pick<React.ComponentProps<typeof Combobox>, 'value'> {
  isMulti?: boolean
  onValueChange: (value: any) => any
}

const RelationSelectComponent = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimtive>,
  RelationSelectProps
>(
  (
    {
      collection,
      value_field,
      display_fields,
      isMulti,
      value,
      onValueChange,
    }: RelationSelectProps,
    forwardedRef
  ) => {
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

    if (!isSuccess) return <>Loading...</>

    if (isMulti) {
      return (
        <Combobox.Multi
          ref={forwardedRef}
          options={optionsMemo}
          // should be an array
          defaultValue={value}
          onValueChange={onValueChange}
        />
      )
    }

    return (
      <Combobox
        // @ts-expect-error
        ref={forwardedRef}
        options={optionsMemo}
        defaultValue={value}
        onValueChange={onValueChange}
      />
    )
  }
)

interface ControlledSelectProps extends SelectAndWidget {
  name?: string
  isMulti?: boolean
}

function Controlled(props: ControlledSelectProps) {
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
      onValueChange={(v) => {
        if (props.isMulti) {
          // @ts-ignore
          fields.onChange(v.map((o) => o.value))
        } else {
          fields.onChange(v?.value)
        }
      }}
    />
  )
}

const RelationSelect = Object.assign(RelationSelectComponent, { Controlled })

export default RelationSelect
