import { isObject } from 'lodash'
import { BaseEditor, Descendant, Transforms } from 'slate'
import { MdxElementShape } from '../mdxElement'

/**
 * Edits a component's children
 */
export const editReactChildren = (
  /**
   * Id of the node we want to edit
   */
  id: string,
  /**
   * The entire deserialized MDX element
   */
  mdxElement: MdxElementShape,
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * The value we'll change the children to
   */
  value: Descendant[]
) => {
  Transforms.setNodes<MdxElementShape>(
    editor,
    {
      ...mdxElement,
      reactChildren: value,
    },
    {
      match: (node) => {
        // @ts-ignore
        return node.id === id
      },
    }
  )
}
