import { Select } from '@imput/components/Select/Controlled'
import Form from '@imput/components/form'
import { useForm } from 'react-hook-form'
import React from 'react'

export type SortByProps = {
  values?: {
    sortBy: string
    direction: 'asc' | 'desc'
  }
  options?: string[]
  onChange?: (val: NonNullable<SortByProps['values']>) => void
}

const SortBy = (
  { onChange, options, values }: SortByProps = {
    values: {
      sortBy: '',
      direction: 'desc',
    },
  }
) => {
  const form = useForm({
    defaultValues: values,
  })

  React.useEffect(() => {
    onChange?.(form.watch())
  }, [form.watch()])

  return (
    <Form
      form={form}
      onSubmit={() => {}}
      className="imp-w-full imp-flex imp-gap-2"
    >
      <Form.Item label="Direction" name="direction" className="imp-flex-1">
        <Select>
          <option value={'asc'}>Ascending</option>
          <option value={'desc'}>Descending</option>
        </Select>
      </Form.Item>
      <Form.Item label="Sort by" name="sortBy" className="imp-flex-1">
        <Select>
          {options?.map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}

export { SortBy }
