import { expect, test, describe, vi } from 'vitest'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import noop from 'lodash/noop'
import userEvent from '@testing-library/user-event'
import { FieldType } from '../../../contexts/cmsContext/context'
import Form from '@imput/components/form'
import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentEditor } from './componentEditor'
import {
  getEmptyStringAttribute,
  getFalseAttribute,
  getSimplerUndefinedAttribute,
  getUndefinedAttribute,
  mockedElement,
} from './mocks'
import { CustomElement } from '../../../types/slate'
import { deserialize } from '../editor'

const mockedSetNode = vi.fn()

vi.mock('slate', () => ({
  Node: {
    get: () => ({
      reactChildren: [],
    }),
  },
  Transforms: {
    setNodes: (...args: any[]) => {
      mockedSetNode(...args)
    },
  },
}))

const mockedFindPath = vi.fn()

vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: () => {
      mockedFindPath()
      return [0, 0]
    },
  },
  useSlateStatic: () => {},
}))

vi.mock('../../../../cms/components/editor', () => ({
  Editor: () => <></>,
}))

const mockSchema = vi.fn()

vi.mock('../../../../cms/contexts/cmsContext/useCMSContext', () => ({
  useCMS: () => ({
    getSchema: () => mockSchema(),
  }),
}))

const setup = ({ element }: { element: CustomElement }) => {
  const user = userEvent.setup()
  const utils = render(<ComponentEditor element={element} />)

  return {
    ...utils,
    ...user,
  }
}

describe('Component editor', () => {
  describe('strings', () => {
    it('Can edit array values', async () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'string',
          label: 'Attribute',
          type: {
            widget: 'string',
            multiple: true,
          },
        },
      ])
      const { getByTestId, type } = setup({
        element: deserialize(
          `
            <Component string={["12434"]} />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  label: 'Attribute',
                  name: 'string',
                  type: {
                    widget: 'string',
                    multiple: true,
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const input = getByTestId('input-string.0') as HTMLInputElement

      await type(input, 'Testing')

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'string',
                type: 'Array',
                value: ['12434Testing'],
              },
            ],
          },
          expect.anything()
        )
      })
    })
    it('Can edit values', async () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'string',
          label: 'Attribute',
          type: {
            widget: 'string',
          },
        },
      ])
      const { getByTestId, type } = setup({
        element: deserialize(
          `
            <Component string="12434" />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  label: 'Attribute',
                  name: 'string',
                  type: {
                    widget: 'string',
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const input = getByTestId('input-string') as HTMLInputElement

      await type(input, 'Testing')

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'string',
                type: 'String',
                value: '12434Testing',
              },
            ],
          },
          expect.anything()
        )
      })
    })
  })

  describe('Boolean input', () => {
    it('Can be edited', async () => {
      mockedSetNode.mockClear()
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Boolean',
          type: {
            widget: 'boolean',
          },
        },
      ])
      const { getByTestId, click } = setup({
        element: deserialize(
          `
            <Component attribute={false} />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  label: 'Attribute',
                  name: 'attribute',
                  type: {
                    widget: 'boolean',
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const switchInput = getByTestId('input-attribute')

      await click(switchInput)

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'attribute',
                type: 'Literal',
                value: true,
              },
            ],
          },
          { at: [0, 0] }
        )
      })

      await click(switchInput)

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'attribute',
                type: 'Literal',
                value: false,
              },
            ],
          },
          { at: [0, 0] }
        )
      })
    })
  })

  describe('Select input', () => {
    it('Can be edited (string)', async () => {
      mockedSetNode.mockClear()
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            widget: 'select',
            options: ['option1', 'option2'],
          },
        },
      ])
      const { getByTestId, click, getByText } = setup({
        element: deserialize(
          `
            <Component attribute={"option2"} />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  name: 'attribute',
                  label: 'Attribute',
                  type: {
                    widget: 'select',
                    options: ['option1', 'option2'],
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const combobox = getByTestId('attribute-combobox')

      await click(combobox)

      await waitFor(async () => {
        const option1 = getByText('option1')
        expect(option1).toBeInTheDocument()
        await click(option1)
      })

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'attribute',
                type: 'Literal',
                value: 'option1',
              },
            ],
          },
          { at: [0, 0] }
        )
      })
    })

    it('Can be edited (int)', async () => {
      mockedSetNode.mockClear()
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            widget: 'select',
            options: [4, 8, 16],
          },
        },
      ])
      const { getByTestId, click, getByText } = setup({
        element: deserialize(
          `
            <Component attribute={4} />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  name: 'attribute',
                  label: 'Attribute',
                  type: {
                    widget: 'select',
                    options: [4, 8, 16],
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const combobox = getByTestId('attribute-combobox')

      await click(combobox)

      await waitFor(async () => {
        const eight = getByText(8)
        expect(eight).toBeInTheDocument()
        await click(eight)
      })

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'attribute',
                type: 'Literal',
                value: 8,
              },
            ],
          },
          { at: [0, 0] }
        )
      })
    })

    it('Can be edited (multiselect)', async () => {
      mockedSetNode.mockClear()
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            options: ['Option 1', 'Option 2', 'Option 3'],
            widget: 'select',
            multiple: true,
          },
        },
      ])
      const { getByTestId, click, getByText } = setup({
        element: deserialize(
          `
            <Component attribute={4} />
            `,
          [
            {
              label: 'Component',
              name: 'Component',
              fields: [
                {
                  name: 'attribute',
                  label: 'Attribute',
                  type: {
                    options: ['Option 1', 'Option 2', 'Option 3'],
                    widget: 'select',
                    multiple: true,
                  },
                },
              ],
            },
          ]
        ).result[0] as any,
      })

      const combobox = getByTestId('attribute-combobox')

      await click(combobox)

      await waitFor(async () => {
        const option1 = getByText('Option 1')
        const option3 = getByText('Option 3')
        expect(option1).toBeInTheDocument()
        expect(getByText('Option 2')).toBeInTheDocument()
        expect(option3).toBeInTheDocument()
        await click(option1)
        await click(option3)
      })

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          {
            reactAttributes: [
              {
                attributeName: 'attribute',
                type: 'Array',
                value: ['Option 1', 'Option 3'],
              },
            ],
          },
          { at: [0, 0] }
        )
      })
    })
  })
})
