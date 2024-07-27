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
  describe('Typable array of strings', () => {
    it('Corrects undefined to array of strings', () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            widget: 'string',
            multiple: true,
          },
        },
      ])
      const { getByTestId } = setup({
        element: mockedElement([getUndefinedAttribute()]),
      })

      expect(mockedSetNode).toHaveBeenLastCalledWith(
        undefined,
        expect.objectContaining({
          attributes: expect.arrayContaining([
            expect.objectContaining({
              name: 'attribute',
              type: 'mdxJsxAttribute',
              value: expect.objectContaining({
                value: '[""]',
                data: expect.objectContaining({
                  estree: expect.objectContaining({
                    body: expect.arrayContaining([
                      expect.objectContaining({
                        expression: expect.objectContaining({
                          type: 'ArrayExpression',
                        }),
                      }),
                    ]),
                  }),
                }),
              }),
            }),
          ]),
        }),
        { at: [0, 0] }
      )
    })
    it('Corrects empty string to array of strings', () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            widget: 'string',
            multiple: true,
          },
        },
      ])
      const { getByTestId } = setup({
        element: mockedElement([getEmptyStringAttribute()]),
      })

      expect(mockedSetNode).toHaveBeenLastCalledWith(
        undefined,
        expect.objectContaining({
          attributes: expect.arrayContaining([
            expect.objectContaining({
              name: 'attribute',
              type: 'mdxJsxAttribute',
              value: expect.objectContaining({
                value: '[""]',
                data: expect.objectContaining({
                  estree: expect.objectContaining({
                    body: expect.arrayContaining([
                      expect.objectContaining({
                        expression: expect.objectContaining({
                          type: 'ArrayExpression',
                        }),
                      }),
                    ]),
                  }),
                }),
              }),
            }),
          ]),
        }),
        { at: [0, 0] }
      )
    })

    it('Can edit values', async () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Attribute',
          type: {
            widget: 'string',
            multiple: true,
          },
        },
      ])
      const { getByTestId, type } = setup({
        element: mockedElement([getEmptyStringAttribute()]),
      })

      const input = getByTestId('input-attribute.0') as HTMLInputElement

      await type(input, 'Testing')

      expect(mockedSetNode).toHaveBeenLastCalledWith(
        undefined,
        expect.objectContaining({
          attributes: expect.arrayContaining([
            expect.objectContaining({
              name: 'attribute',
              type: 'mdxJsxAttribute',
              value: expect.objectContaining({
                value: '["Testing"]',
                data: expect.objectContaining({
                  estree: expect.objectContaining({
                    body: expect.arrayContaining([
                      expect.objectContaining({
                        expression: expect.objectContaining({
                          type: 'ArrayExpression',
                        }),
                      }),
                    ]),
                  }),
                }),
              }),
            }),
          ]),
        }),
        { at: [0, 0] }
      )
    })
  })
  describe('Date input', () => {
    it('Does not correct undefined ', async () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Date',
          type: {
            widget: 'date',
          },
        },
      ])
      const { getByTestId } = setup({
        element: mockedElement([getUndefinedAttribute()]),
      })

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  value: 'undefined',
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: undefined,
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
          { at: [0, 0] }
        )
      })
    })
    it('Can be edited', async () => {
      mockSchema.mockImplementation(() => [
        {
          name: 'attribute',
          label: 'Date',
          type: {
            widget: 'date',
          },
        },
      ])
      const { getByLabelText, type, clear } = setup({
        element: mockedElement([getUndefinedAttribute()]),
      })

      const input = getByLabelText('Date') as HTMLInputElement

      await clear(input)
      await type(input, '2020-01-01')

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  // we don't use this so it's okay
                  value: 'undefined',
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: '2020-01-01',
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
          { at: [0, 0] }
        )
      })
    })
  })

  describe('Boolean input', () => {
    it('Corrects empty string to undefined', async () => {
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
      const {} = setup({
        element: mockedElement([getEmptyStringAttribute()]),
      })

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: undefined,
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
          { at: [0, 0] }
        )
      })
    })
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
        element: mockedElement([getFalseAttribute()]),
      })

      const switchInput = getByTestId('input-attribute')

      await click(switchInput)

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: true,
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
          { at: [0, 0] }
        )
      })

      await click(switchInput)

      await waitFor(() => {
        expect(mockedSetNode).toHaveBeenLastCalledWith(
          undefined,
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: false,
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
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
        element: mockedElement([getUndefinedAttribute()]),
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
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: 'option1',
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
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
        element: mockedElement([getUndefinedAttribute()]),
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
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'Literal',
                            value: 8,
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
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
        element: mockedElement([getUndefinedAttribute()]),
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
          expect.objectContaining({
            attributes: expect.arrayContaining([
              expect.objectContaining({
                name: 'attribute',
                type: 'mdxJsxAttribute',
                value: expect.objectContaining({
                  value: '["Option 1","Option 3"]',
                  data: expect.objectContaining({
                    estree: expect.objectContaining({
                      body: expect.arrayContaining([
                        expect.objectContaining({
                          expression: expect.objectContaining({
                            type: 'ArrayExpression',
                          }),
                        }),
                      ]),
                    }),
                  }),
                }),
              }),
            ]),
          }),
          { at: [0, 0] }
        )
      })
    })
  })
})
