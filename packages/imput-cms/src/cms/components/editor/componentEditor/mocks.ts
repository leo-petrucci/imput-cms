export const mockedElement = (attributes: Array<any>) => ({
  id: 'ebe7c4ab-2ccf-4482-ba55-7002233a9f8e',
  name: 'ReactComponent',
  type: 'mdxJsxFlowElement',
  reactChildren: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Is this going to break stuff',
        },
      ],
    },
    {
      children: [
        {
          text: 'Apparently not!',
        },
      ],
      type: 'paragraph',
      id: '3d5586ad-6c40-4326-bf5e-4ed7f51b5a50',
    },
  ],
  children: [
    {
      text: '',
    },
  ],
  attributes,
})

/**
 * Returns an undefined attribute value
 */
export const getUndefinedAttribute = (name: string = 'attribute') => ({
  type: 'mdxJsxAttribute',
  name,
  value: {
    type: 'mdxJsxAttributeValueExpression',
    value: 'undefined',
    data: {
      estree: {
        type: 'Program',
        start: 329,
        end: 338,
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              start: 329,
              end: 338,
              loc: {
                start: {
                  line: 12,
                  column: 22,
                  offset: 329,
                },
                end: {
                  line: 12,
                  column: 31,
                  offset: 338,
                },
              },
              name: 'undefined',
              range: [329, 338],
            },
            start: 329,
            end: 338,
            loc: {
              start: {
                line: 12,
                column: 22,
                offset: 329,
              },
              end: {
                line: 12,
                column: 31,
                offset: 338,
              },
            },
            range: [329, 338],
          },
        ],
        sourceType: 'module',
        comments: [],
        loc: {
          start: {
            line: 12,
            column: 22,
            offset: 329,
          },
          end: {
            line: 12,
            column: 31,
            offset: 338,
          },
        },
        range: [329, 338],
      },
    },
  },
})

/**
 * Returns an empty string attribute value
 */
export const getEmptyStringAttribute = (name: string = 'attribute') => ({
  type: 'mdxJsxAttribute',
  name,
  value: '',
})
