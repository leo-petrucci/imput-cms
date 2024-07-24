import { expect, test, describe, vi } from 'vitest'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import Editor, { EditorProps, deserialize } from './editor'
import {
  expectDeeplyNestedProp,
  expectSlateAtributesObject,
  expectProp,
  expectDeeplyNestedPropArray,
  expectSlateObject,
  expectSlateChildrenObject,
} from '../../../../src/test/slateUtils'
import noop from 'lodash/noop'
import userEvent from '@testing-library/user-event'

const mockedUseEditorDepth = vi.fn()

vi.mock('../../../cms/components/editor/depthContext', () => ({
  useEditorDepth: () => {
    mockedUseEditorDepth()

    return {
      addElement: noop,
      removeElement: noop,
      getDepth: () => 0,
      depthArray: [0],
    }
  },
}))

const mockedUseCMS = vi.fn()
const mockedGetSchema = vi.fn()

vi.mock('../../../cms/contexts/cmsContext/useCMSContext', async () => ({
  ...(await vi.importActual('../../../cms/contexts/cmsContext/useCMSContext')),
  useCMS: (props: any) => {
    mockedUseCMS(props)
    return {
      getSchema: () => mockedGetSchema(),
    }
    return {
      getSchema: () => [
        {
          name: 'name',
          label: 'Name',
          type: {
            widget: 'string',
          },
        },
        {
          name: 'date',
          label: 'Date',
          type: {
            widget: 'date',
          },
        },
        {
          name: 'datetime',
          label: 'DateTime',
          type: {
            widget: 'datetime',
          },
        },
        {
          name: 'boolean',
          label: 'Boolean',
          type: {
            widget: 'boolean',
          },
        },
        {
          name: 'variant',
          label: 'Variant',
          type: {
            widget: 'select',
            options: ['option1', 'option2'],
          },
        },
        {
          name: 'padding',
          label: 'Padding',
          type: {
            widget: 'select',
            options: [4, 8, 12],
          },
        },
        {
          name: 'object',
          label: 'Object',
          type: {
            widget: 'json',
          },
        },
        {
          name: 'array',
          label: 'Array',
          type: {
            options: ['Option 1', 'Option 2', 'Option 3'],
            widget: 'select',
            multiple: true,
          },
        },
        {
          name: 'numberArray',
          label: 'Array',
          type: {
            options: [8, 12, 16],
            widget: 'select',
            multiple: true,
          },
        },
        {
          name: 'children',
          label: 'Content',
          type: {
            widget: 'markdown',
          },
        },
      ],
    }
  },
}))

const setup = (props: Omit<EditorProps, 'onChange'>) => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(<Editor {...props} onChange={onChange} debug />)
  const editor = utils.getByTestId('slate-content-editable')

  return {
    onChange,
    editor,
    ...user,
    ...utils,
  }
}

describe.only('MDX Editor', () => {
  describe('deserialization', () => {
    test('Correctly deserializes string', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
          <ReactComponent name="12434" />
          `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([expectSlateAtributesObject([expectProp('12434')])])
      )
    })

    test('Correctly deserializes boolean', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
            <ReactComponent boolean={true} />
            `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([expectDeeplyNestedProp(true)]),
        ])
      )
    })

    test('Correctly deserializes number', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
        <ReactComponent padding={12} />
        `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([expectDeeplyNestedProp(12)]),
        ])
      )
    })

    test('Correctly deserializes number array', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
        <ReactComponent numberArray={[8,16]} />
        `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([expectDeeplyNestedPropArray([8, 16])]),
        ])
      )
    })

    test('Correctly deserializes string array', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
        <ReactComponent array={["Option 2","Option 1"]} />
        `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([
            expectDeeplyNestedPropArray(['Option 2', 'Option 1']),
          ]),
        ])
      )
    })

    test('Correctly deserializes children', () => {
      const { onChange, editor } = setup({
        value: deserialize(`
        <ReactComponent>

        Test Child

        </ReactComponent>
        `).result,
      })

      expect(editor).toBeInTheDocument()
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([expectSlateChildrenObject('Test Child')])
      )
    })
  })
  describe('components and editing', () => {
    test('renders component control button and opens panel', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'name',
          label: 'Name',
          type: {
            widget: 'string',
          },
        },
      ])
      const { getByTestId } = setup({
        value: deserialize(`
                <ReactComponent name="12434" />
                `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      expect(componentButton).toBeInTheDocument()

      await act(() => {
        componentButton.click()
      })

      expect(mockedUseCMS).toHaveBeenCalled()

      expect(screen.getByTestId('component-editor')).toBeInTheDocument()
    })

    test('input works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'name',
          label: 'Name',
          type: {
            widget: 'string',
          },
        },
      ])
      const { getByTestId, onChange } = setup({
        value: deserialize(`
                <ReactComponent name="12434" />
                `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      expect(componentButton).toBeInTheDocument()

      await act(() => {
        componentButton.click()
      })

      expect(mockedUseCMS).toHaveBeenCalled()

      expect(screen.getByTestId('component-editor')).toBeInTheDocument()

      const input = screen.getByLabelText('Name') as HTMLInputElement

      expect(input).toBeInTheDocument()

      await act(() => {
        fireEvent.change(input, { target: { value: 'Changed value' } })
      })

      expect(input.value).toBe('Changed value')

      expect(onChange).toHaveBeenLastCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([expectProp('Changed value')]),
        ])
      )
    })

    test('switch works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'boolean',
          label: 'Boolean',
          type: {
            widget: 'boolean',
          },
        },
      ])

      const { getByTestId, onChange } = setup({
        value: deserialize(`
                  <ReactComponent boolean={true} />
                  `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(screen.getByTestId('component-editor')).toBeInTheDocument()

      const input = screen.getByLabelText('Boolean') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-checked', 'true')

      await act(() => {
        input.click()
      })

      expect(input).toHaveAttribute('aria-checked', 'false')

      expect(onChange).toHaveBeenCalledWith(
        expectSlateObject([
          expectSlateAtributesObject([expectDeeplyNestedProp(false)]),
        ])
      )
    })

    test('number select works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'padding',
          label: 'Padding',
          type: {
            widget: 'select',
            options: [4, 8, 12],
          },
        },
      ])

      const { getByTestId, onChange, click, getByText } = setup({
        value: deserialize(`
                    <ReactComponent padding={12} />
                    `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('12')).toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('4')).toBeInTheDocument()
        expect(getByText('8')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('4'))
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([expectDeeplyNestedProp(4)]),
          ])
        )
      })
    })

    test('string select works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'variant',
          label: 'Variant',
          type: {
            widget: 'select',
            options: ['option1', 'option2'],
          },
        },
      ])

      const { getByTestId, onChange, click, getByText } = setup({
        value: deserialize(`
                      <ReactComponent variant="option2" />
                      `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('option2')).toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('option1')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('option1'))
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([expectDeeplyNestedProp('option1')]),
          ])
        )
      })
    })

    // strings can also be passed within curly brackets
    test('string select works correctly (curly brackets)', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'variant',
          label: 'Variant',
          type: {
            widget: 'select',
            options: ['option1', 'option2'],
          },
        },
      ])

      const { getByTestId, onChange, click, getByText } = setup({
        value: deserialize(`
                        <ReactComponent variant={"option2"} />
                        `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('option2')).toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('option1')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('option1'))
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([expectDeeplyNestedProp('option1')]),
          ])
        )
      })
    })

    test('string select works correctly (curly brackets)', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'variant',
          label: 'Variant',
          type: {
            widget: 'select',
            options: ['option1', 'option2'],
          },
        },
      ])

      const { getByTestId, onChange, click, getByText } = setup({
        value: deserialize(`
                          <ReactComponent variant={"option2"} />
                          `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('option2')).toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('option1')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('option1'))
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([expectDeeplyNestedProp('option1')]),
          ])
        )
      })
    })

    test('number array select works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'numberArray',
          label: 'Array',
          type: {
            options: [8, 12, 16],
            widget: 'select',
            multiple: true,
          },
        },
      ])

      const {
        getByTestId,
        onChange,
        click,
        getByText,
        getAllByText,
        queryByText,
      } = setup({
        value: deserialize(`
          <ReactComponent numberArray={[12,16]} />
            `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('12')).toBeInTheDocument()
      expect(getByText('16')).toBeInTheDocument()
      expect(queryByText('8')).not.toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('8')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('8'))
      })

      await waitFor(() => {
        expect(getAllByText('8').length).toBe(2)
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([
              expect.objectContaining({
                value: expect.objectContaining({
                  value: '[12,16,8]',
                }),
              }),
            ]),
          ])
        )
      })

      await act(() => {
        click(getAllByText('16')[1])
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([
              expect.objectContaining({
                value: expect.objectContaining({
                  value: '[12,8]',
                }),
              }),
            ]),
          ])
        )
      })
    })

    test('string array select works correctly', async () => {
      mockedGetSchema.mockImplementation(() => [
        {
          name: 'array',
          label: 'Array',
          type: {
            options: ['Option 1', 'Option 2', 'Option 3'],
            widget: 'select',
            multiple: true,
          },
        },
      ])

      const {
        getByTestId,
        onChange,
        click,
        getByText,
        getAllByText,
        queryByText,
      } = setup({
        value: deserialize(`
          <ReactComponent array={["Option 2","Option 3"]} />
              `).result,
      })

      const componentButton = getByTestId('ReactComponent-block')

      await act(() => {
        componentButton.click()
      })

      expect(getByTestId('component-editor')).toBeInTheDocument()

      const input = getByTestId('combobox') as HTMLInputElement

      expect(input).toBeInTheDocument()
      expect(getByText('Option 2')).toBeInTheDocument()
      expect(getByText('Option 3')).toBeInTheDocument()
      expect(queryByText('Option 1')).not.toBeInTheDocument()

      await act(() => {
        click(input)
      })

      await waitFor(() => {
        expect(getByText('Option 1')).toBeInTheDocument()
      })

      await act(() => {
        click(getByText('Option 1'))
      })

      await waitFor(() => {
        expect(getAllByText('Option 1').length).toBe(2)
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([
              expect.objectContaining({
                value: expect.objectContaining({
                  value: JSON.stringify(['Option 2', 'Option 3', 'Option 1']),
                }),
              }),
            ]),
          ])
        )
      })

      await act(() => {
        click(getAllByText('Option 3')[1])
      })

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expectSlateObject([
            expectSlateAtributesObject([
              expect.objectContaining({
                value: expect.objectContaining({
                  value: JSON.stringify(['Option 2', 'Option 1']),
                }),
              }),
            ]),
          ])
        )
      })
    })
  })
})
