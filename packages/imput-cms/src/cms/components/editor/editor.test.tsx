import { expect, test, describe, vi } from 'vitest'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import Editor, { EditorProps, deserialize, serialize } from './editor'
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
import { MDXNode } from '../../types/mdxNode'
import { AttributeType, getAttributeType } from './lib/mdx'
import { MdxElementShape, ReactAttribute } from './mdxElement'
import { Descendant } from 'slate'

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

describe('MDX Editor', () => {
  describe('component and attribute correction', () => {
    it('removes components that are not in the schema', () => {
      const { result } = deserialize(
        `
          <ReactComponent string="12434" />
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
      ) as any

      expect(result).toStrictEqual([])
    })
    it('removes attributes that are not in the schema', () => {
      const { result } = deserialize(
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
                name: 'notstring',
                type: {
                  widget: 'string',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).toStrictEqual([
        {
          attributeName: 'notstring',
          type: 'Literal',
          value: undefined,
        },
      ])
    })
  })
  describe('deserialization', () => {
    it('correctly parses a string prop', () => {
      const { result } = deserialize(
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
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.String,
          value: '12434',
        },
      ])
    })

    it('correctly parses a literal prop', () => {
      const { result } = deserialize(
        `
          <Component literal={12345} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'literal',
                type: {
                  widget: 'string',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'literal',
          type: AttributeType.Literal,
          value: 12345,
        },
      ])
    })

    it('correctly parses an undefined prop', () => {
      const { result } = deserialize(
        `
          <Component undefined={undefined} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'undefined',
                type: {
                  widget: 'string',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'undefined',
          type: AttributeType.Undefined,
          value: undefined,
        },
      ])
    })

    it('correctly parses an array prop', () => {
      const { result } = deserialize(
        `
          <Component array={[12, "16", () => null, {property: "value"}]} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'string',
                  multiple: true,
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'array',
          type: AttributeType.Array,
          value: [12, '16', undefined, { property: 'value' }],
        },
      ])
    })

    it('correctly parses an object prop', () => {
      const { result } = deserialize(
        `
          <Component object={{
            literal: 0,
            array: [12, "16", () => null, {property: "value"}],
            object: {
              literal: 0
            }
          }} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'object',
                type: {
                  widget: 'object',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'object',
          type: AttributeType.Object,
          value: {
            literal: 0,
            array: [12, '16', undefined, { property: 'value' }],
            object: {
              literal: 0,
            },
          },
        },
      ])
    })

    it('correctly parses an object prop to object', () => {
      const { result } = deserialize(
        `
          <Component object={{
            literal: 0,
            array: [12, "16", () => null, {property: "value"}],
            object: {
              literal: 0
            }
          }} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'object',
                type: {
                  widget: 'object',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'object',
          type: AttributeType.Object,
          value: {
            literal: 0,
            array: [12, '16', undefined, { property: 'value' }],
            object: {
              literal: 0,
            },
          },
        },
      ])
    })

    it('correctly parses an object prop to json', () => {
      const { result } = deserialize(
        `
          <Component object={{
            literal: 0,
            array: [12, "16", () => null, {property: "value"}],
            object: {
              literal: 0
            }
          }} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'object',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'object',
          type: AttributeType.Json,
          value: JSON.stringify({
            literal: 0,
            array: [12, '16', undefined, { property: 'value' }],
            object: {
              literal: 0,
            },
          }),
        },
      ])
    })

    it.only('correctly parses an array prop to json', () => {
      const { result } = deserialize(
        `
          <Component array={[12, "16", () => null, {property: "value"}]} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'array',
          type: AttributeType.Json,
          value: JSON.stringify([12, '16', undefined, { property: 'value' }]),
        },
      ])
    })

    // We need to correct an edge case where
    // components as props with children on a single line
    // aren't parsed by the mdx plugin correctly
    //
    // This wouldn't really be a problem, but we're recursively
    // deserialising these as mdx for better DX
    it('correctly parses a component prop with children', () => {
      const { result } = deserialize(
        `<Component componentProp={<SubComponent>Test</SubComponent>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
            fields: [],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'componentProp',
          type: AttributeType.Component,
          value: [
            expect.objectContaining({
              reactAttributes: [],
              reactChildren: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test',
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ])
    })

    // just to make sure props don't break it
    it('correctly parses a component prop with children and props', () => {
      const { result } = deserialize(
        `<Component componentProp={<SubComponent string="string">Test</SubComponent>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
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
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'componentProp',
          type: AttributeType.Component,
          value: [
            expect.objectContaining({
              reactAttributes: [
                {
                  attributeName: 'string',
                  type: AttributeType.String,
                  value: 'string',
                },
              ],
              reactChildren: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test',
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ])
    })

    // props on different lines also should work
    it('correctly parses a component prop with children and props (2)', () => {
      const { result } = deserialize(
        `<Component componentProp={<SubComponent 
        string="string">Test</SubComponent>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
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
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'componentProp',
          type: AttributeType.Component,
          value: [
            expect.objectContaining({
              reactAttributes: [
                {
                  attributeName: 'string',
                  type: AttributeType.String,
                  value: 'string',
                },
              ],
              reactChildren: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test',
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ])
    })

    // if they're already on multiple lines it should just work
    it('correctly parses a component prop with children and props (2)', () => {
      const { result } = deserialize(
        `<Component componentProp={
        <SubComponent 
        string="string">
        Test

        Test2
        </SubComponent>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
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
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'componentProp',
          type: AttributeType.Component,
          value: [
            expect.objectContaining({
              reactAttributes: [
                {
                  attributeName: 'string',
                  type: AttributeType.String,
                  value: 'string',
                },
              ],
              reactChildren: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Test2',
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ])
    })

    it('correctly parses complex component', () => {
      const { result } = deserialize(
        `<Component name="" date="2024-04-12" datetime="2024-04-20T16:38" boolean={true} variant="option1" padding={8} object={{
  item: "something",
  anotherItem: "somethingelse"
}} array={["Option 1","Option 2"]} numberArray={[12]} >

Children

</Component>`,
        [
          {
            label: 'Component',
            name: 'Component',

            fields: [
              {
                name: 'name',
                label: 'Name',
                type: {
                  widget: 'string',
                  multiple: true,
                  default: ['Leo', 'Evie', 'Lucio'],
                },
              },
              {
                name: 'date',
                label: 'Date',
                type: {
                  widget: 'date',
                  default: '2020-01-01',
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
                  default: true,
                },
              },
              {
                name: 'variant',
                label: 'Variant',
                type: {
                  widget: 'select',
                  options: ['option1', 'option2'],
                  default: 'option2',
                },
              },
              {
                name: 'padding',
                label: 'Padding',
                type: {
                  widget: 'select',
                  options: [4, 8, 12],
                  default: 8,
                },
              },
              {
                name: 'object',
                label: 'Object',
                type: {
                  widget: 'json',
                  default: `{}`,
                },
              },
              {
                name: 'image',
                label: 'Image',
                type: {
                  widget: 'image',
                  default: 'images/screenshot-2023-01-24-at-14.24.01.png',
                },
              },
              {
                name: 'array',
                label: 'Array',
                type: {
                  options: ['Option 1', 'Option 2', 'Option 3'],
                  widget: 'select',
                  multiple: true,
                  default: ['Option 1', 'Option 2'],
                },
              },
              {
                name: 'numberArray',
                label: 'Array',
                type: {
                  options: [8, 12, 16],
                  widget: 'select',
                  multiple: true,
                  default: [8, 16],
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
          },
        ]
      ) as any

      expect(result[0].type).toBe('mdxJsxFlowElement')
      expect(result[0].reactChildren.length).toBe(1)
      expect(result[0].reactAttributes.length).toBe(10)
    })

    it('initialises missing props ', () => {
      const { result } = deserialize(
        `
          <Component />
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
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.Literal,
          value: undefined,
        },
      ])
    })

    it('initialises missing props with default (string)', () => {
      const { result } = deserialize(
        `
          <Component />
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
                  default: 'test',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.String,
          value: 'test',
        },
      ])
    })

    it('initialises missing props with default (string array)', () => {
      const { result } = deserialize(
        `
          <Component />
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
                  default: 'test',
                  multiple: true,
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.Array,
          value: ['test'],
        },
      ])
    })

    it('initialises missing props with default (literal)', () => {
      const { result } = deserialize(
        `
          <Component />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'literal',
                type: {
                  widget: 'boolean',
                  default: true,
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'literal',
          type: AttributeType.Literal,
          value: true,
        },
      ])
    })

    it('initialises missing props with default (array)', () => {
      const { result } = deserialize(
        `
          <Component />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'string',
                  multiple: true,
                  default: ['string', 'string2'],
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'array',
          type: AttributeType.Array,
          value: ['string', 'string2'],
        },
      ])
    })

    it('initialises missing props with default (object)', () => {
      const { result } = deserialize(
        `
          <Component />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'json',
                  default: {
                    key: 'value',
                  },
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'array',
          type: AttributeType.Object,
          value: {
            key: 'value',
          },
        },
      ])
    })

    it('initialises missing props with default (component)', () => {
      const { result } = deserialize(
        `
          <Component />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'component',
                type: {
                  widget: 'markdown',
                  default: '<SubComponent />',
                },
              },
            ],
          },
          {
            label: 'Component',
            name: 'SubComponent',
            fields: [],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'component',
          type: AttributeType.Component,
          value: expect.objectContaining({
            name: 'SubComponent',
            type: 'mdxJsxFlowElement',
          }),
        },
      ])
    })

    it('correctly transforms string to string array', () => {
      const { result } = deserialize(
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
                  multiple: true,
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.Array,
          value: [],
        },
      ])
    })

    it('correctly transforms string to select array', () => {
      const { result } = deserialize(
        `
          <Component select="12434" />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'select',
                type: {
                  widget: 'select',
                  options: ['one', 'two'],
                  multiple: true,
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'select',
          type: AttributeType.Array,
          value: [],
        },
      ])
    })

    it('correctly transforms array string to undefined', () => {
      const { result } = deserialize(
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
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'string',
          type: AttributeType.Literal,
          value: undefined,
        },
      ])
    })

    it('correctly initializes component prop from empty', () => {
      const { result } = deserialize(
        `
          <Component />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'component',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes[0]).toStrictEqual({
        attributeName: 'component',
        type: AttributeType.Component,
        value: [
          {
            children: [
              {
                text: '',
              },
            ],
            type: 'paragraph',
          },
        ],
      })
    })

    it('correctly deserializes a fragment component', () => {
      const { result } = deserialize(
        `<>\nText\n\n- listitem\n  - subitem\n- listitem2\n\n Paragraph with a [link](https://google.com)\n</> 
          `,
        []
      ) as any

      const children = result[0].reactChildren as Descendant[]

      expect(children).not.toBe(undefined)

      expect(children).toStrictEqual([
        { type: 'paragraph', children: [{ text: 'Text' }] },
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                { type: 'list_item_text', children: [{ text: 'listitem' }] },
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'list_item_text',
                          children: [{ text: 'subitem' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                { type: 'list_item_text', children: [{ text: 'listitem2' }] },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'Paragraph with a ' },
            {
              type: 'link',
              url: 'https://google.com',
              children: [{ text: 'link' }],
            },
          ],
        },
      ])
    })

    /**
     * Write a test that deserializes an array into a JSON array if
     * the widget is set to "json". It also needs to check that the attribute
     * type is JSON
     */

    it('deserializes an array into a json array', () => {
      const { result } = deserialize(
        `
          <Component array={["item", "item"]} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const attributes = result[0].reactAttributes as ReactAttribute[]

      expect(attributes).not.toBe(undefined)

      expect(attributes).toStrictEqual([
        {
          attributeName: 'array',
          type: AttributeType.Json,
          value: JSON.stringify(['item', 'item']),
        },
      ])
    })
  })
  /**
   * These check that we can correctly identify the type
   * of attribute on a React component
   */
  describe('attribute identification', () => {
    it('identifies string', () => {
      const { result } = deserialize(
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
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.String)
    })
    it('identifies number', () => {
      const { result } = deserialize(
        `
          <Component number={0} />
          `,

        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'number',
                type: {
                  options: [0, 1],
                  widget: 'select',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Literal)
    })
    it('identifies boolean', () => {
      const { result } = deserialize(
        `
          <Component boolean={true} />
          `,

        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'boolean',
                type: {
                  widget: 'boolean',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Literal)
    })
    it('identifies null', () => {
      const { result } = deserialize(
        `
          <Component null={null} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'null',
                type: {
                  widget: 'boolean',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Literal)
    })

    it('identifies array', () => {
      const { result } = deserialize(
        `
          <Component array={[]} />
          `,

        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  multiple: true,
                  options: [0, 1],
                  widget: 'select',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Array)
    })
    it('identifies object', () => {
      const { result } = deserialize(
        `
          <Component array={{}} />
          `,

        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Object)
    })
    it('identifies undefined', () => {
      const { result } = deserialize(
        `
          <Component undefined={undefined} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'undefined',
                type: {
                  widget: 'boolean',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Undefined)
    })
    it('identifies component', () => {
      const { result } = deserialize(
        `
          <Component component={<Test/>} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'component',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Component)
    })
    it('identifies other', () => {
      const { result } = deserialize(
        `
          <Component other={() => null} />
          `,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'other',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const attribute = result[0].attributes[0] as MDXNode

      const attributeType = getAttributeType(attribute)
      expect(attributeType).toBe(AttributeType.Other)
    })
  })
  describe('serialization', () => {
    it('serializes component with string prop', () => {
      const { result } = deserialize(`<Component string="test" />`, [
        {
          label: 'Component',
          name: 'Component',
          fields: [
            {
              label: 'Attribute',
              name: 'string',
              type: {
                widget: 'json',
              },
            },
          ],
        },
      ]) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toContain(`<Component string="test" />`)
    })

    it('serializes component with nested array prop', () => {
      const { result } = deserialize(
        `<Component array={[1, 2, 3, ["Test", "Test"]]} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component array={[1,2,3,["Test","Test"]]} />\n\n`
      )
    })

    it('serializes component with nested object prop (object)', () => {
      const { result } = deserialize(
        `<Component object={{
          test: "string",
          object: {
            another: "test"
          }
        }} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'object',
                type: {
                  widget: 'object',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toContain(
        `<Component object={{test: "string", object: {another: "test"}}} />`
      )
    })

    it('serializes component with nested object prop (json)', () => {
      const { result } = deserialize(
        `<Component object={{
          test: "string",
          object: {
            another: "test"
          }
        }} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'object',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toContain(
        `<Component object={{"test":"string","object":{"another":"test"}}} />`
      )
    })

    it('serializes component with object within array prop', () => {
      const { result } = deserialize(
        `<Component array={[{test: "string", object: { another: "test"}}]} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'array',
                type: {
                  widget: 'string',
                  multiple: true,
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toContain(
        `<Component array={[{test: "string", object: {another: "test"}}]} />`
      )
    })

    it('serializes component with children', () => {
      const { result } = deserialize(`<Component>\nText\n</Component>`, [
        {
          label: 'Component',
          name: 'Component',
          fields: [
            {
              label: 'Attribute',
              name: 'children',
              type: {
                widget: 'markdown',
              },
            },
          ],
        },
      ]) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toContain(`<Component>\n\nText\n\n</Component>`)
    })

    it('serializes component with children and components', () => {
      const { result } = deserialize(
        `<Component>\nText\n<Component>\nText\n</Component>\nTest\n</Component>`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'children',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component>\n\nText\n\n<Component>\n\nText\n\n</Component>\n\nTest\n\n</Component>\n\n`
      )
    })

    it('serializes component with various different children', () => {
      const { result } = deserialize(
        `<Component>\nText\n\n- listitem\n  - subitem\n- listitem2\n\n Paragraph with a [link](https://google.com)\n</Component>`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'children',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component>\n\nText\n\n- listitem\n  - subitem\n- listitem2\n\nParagraph with a [link](https://google.com)\n\n</Component>\n\n`
      )
    })

    it('serializes component with component prop', () => {
      const { result } = deserialize(
        `<Component componentProp={<SubComponent />} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
            fields: [],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component componentProp={<SubComponent/>} />\n\n`
      )
    })

    it('serializes component with component prop and children', () => {
      const { result } = deserialize(
        `<Component componentProp={<SubComponent>\nText\n\n- listitem\n  - subitem\n- listitem2\n\n Paragraph with a [link](https://google.com)\n</SubComponent>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
            fields: [
              {
                label: 'Children',
                name: 'children',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component componentProp={<SubComponent>\n\nText\n\n- listitem\n  - subitem\n- listitem2\n\nParagraph with a [link](https://google.com)\n\n</SubComponent>} />\n\n`
      )
    })

    // there's an edge case where if there's a newline after "<>" and before "Testing"
    // the component won't be deserialized correctly
    // but honestly who cares, if it needs fixed we'll fix it later
    it('serializes component with component prop with markdown content', () => {
      const { result } = deserialize(
        `<Component componentProp={<>Testing\nTesting\n</>} />`,
        [
          {
            label: 'Component',
            name: 'Component',
            fields: [
              {
                label: 'Attribute',
                name: 'componentProp',
                type: {
                  widget: 'json',
                },
              },
            ],
          },
          {
            label: 'SubComponent',
            name: 'SubComponent',
            fields: [
              {
                label: 'Children',
                name: 'children',
                type: {
                  widget: 'markdown',
                },
              },
            ],
          },
        ]
      ) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(
        `<Component componentProp={<>Testing\nTesting\n</>\n\n} />\n\n`
      )
    })

    it('serializes component with component prop with just fragments', () => {
      const { result } = deserialize(`<Component componentProp={<></>} />`, [
        {
          label: 'Component',
          name: 'Component',
          fields: [
            {
              label: 'Attribute',
              name: 'componentProp',
              type: {
                widget: 'json',
              },
            },
          ],
        },
        {
          label: 'SubComponent',
          name: 'SubComponent',
          fields: [
            {
              label: 'Children',
              name: 'children',
              type: {
                widget: 'markdown',
              },
            },
          ],
        },
      ]) as any

      const serialized = result.map((r: any) => serialize(r)).join('')

      expect(serialized).toBe(`<Component componentProp={<>\n</>} />\n\n`)
    })
  })
})
