import { expect, test, describe, vi } from 'vitest'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import noop from 'lodash/noop'
import userEvent from '@testing-library/user-event'
import { FieldType } from '../../../contexts/cmsContext/context'
import Form from '@imput/components/form'
import { useForm } from 'react-hook-form'
import React from 'react'
import { EditorFields } from './fields'

vi.mock('../createEditor', () => ({
  CreateEditor: () => <></>,
}))

const setup = (props: FieldType[]) => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(<TestForm onChange={onChange} config={props} />)

  return {
    onChange,
    ...user,
    ...utils,
  }
}

const TestForm = ({
  onChange,
  config,
}: {
  onChange: (form: any) => void
  config: FieldType[]
}) => {
  const form = useForm()

  React.useEffect(() => {
    onChange(form.watch())
  }, [form.watch()])

  return (
    <Form form={form} onSubmit={noop}>
      <EditorFields fields={config} />
    </Form>
  )
}

/**
 * idk why I bothered testing this now
 * it's just a form, there's literally zero custom code
 */

describe('Editor fields', () => {
  test('Single string', () => {
    const { onChange, getByLabelText, type } = setup([
      {
        label: 'String',
        name: 'string',
        widget: 'string',
      },
    ])

    const input = getByLabelText('String') as HTMLInputElement

    act(() => {
      type(input, 'A new string')
    })

    waitFor(() => {
      expect(input.value).toBe('A new string')
      expect(onChange).toHaveBeenCalledWith({
        string: 'A new string',
      })
    })
  })
  test('Multiple string', () => {
    const { onChange, getByLabelText, type, getAllByTestId } = setup([
      {
        label: 'String',
        name: 'string',
        widget: 'string',
        multiple: true,
      },
    ])

    const input = getAllByTestId('input-string', {
      exact: false,
    }) as HTMLInputElement[]

    act(() => {
      input.forEach((i, index) => {
        type(i, `A new string ${index}`)
      })
    })

    waitFor(() => {
      input.forEach((i, index) => {
        expect(i.value).toBe(`A new string ${index}`)
      })

      expect(onChange).toHaveBeenCalledWith({
        string: input.map((i, index) => `A new string ${index}`),
      })
    })
  })
})
