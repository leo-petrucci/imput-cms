import { expect } from 'vitest'

/**
 * Checks for a deeply nested prop
 */
export const expectDeeplyNestedProp = (value: any) =>
  expect.objectContaining({
    value: expect.objectContaining({
      data: expect.objectContaining({
        estree: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              expression: expect.objectContaining({
                value,
              }),
            }),
          ]),
        }),
      }),
    }),
  })

/**
 * Checks for a deeply nested prop array
 */
export const expectDeeplyNestedPropArray = (value: any[]) =>
  expect.objectContaining({
    value: expect.objectContaining({
      data: expect.objectContaining({
        estree: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              expression: expect.objectContaining({
                elements: expect.arrayContaining(
                  value.map((v) => expect.objectContaining({ value: v }))
                ),
              }),
            }),
          ]),
        }),
      }),
    }),
  })

/**
 * Checks for a non-deeply nested prop
 */
export const expectProp = (value: any) =>
  expect.objectContaining({
    value,
  })

/**
 * Checks for nested slate mdx react children objects
 */
export const expectSlateChildrenObject = (value: any) =>
  expect.objectContaining({
    reactChildren: expect.arrayContaining([
      expect.objectContaining({
        children: expect.arrayContaining([
          expect.objectContaining({
            text: value,
          }),
        ]),
      }),
    ]),
  })

/**
 * Checks for nested slate mdx attribute objects
 */
export const expectSlateAtributesObject = (objects: any[]) =>
  expect.objectContaining({
    attributes: expect.arrayContaining(objects),
  })

/**
 * Checks for slate objects
 */
export const expectSlateObject = (objects: any[]) =>
  expect.arrayContaining(objects)
