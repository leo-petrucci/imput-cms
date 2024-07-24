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
})
