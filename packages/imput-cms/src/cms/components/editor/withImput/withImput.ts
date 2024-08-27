import { ReactEditor } from 'slate-react'
import { Element, Transforms } from 'slate'
import { v4 as uuidv4 } from 'uuid'
import { CustomElement } from '../../../../cms/types/slate'
import { getCurrentNodeType } from './utils'
import { defaultNodeTypes } from '../remark-slate'

/**
 * Adds custom Imput functions for the slate editor
 */
export const withImput = (editor: ReactEditor) => {
  const { isVoid, isInline, normalizeNode } = editor

  /**
   * A void is an element with text that can't be edited
   * Here we use them as buttons, so they can be clicked and
   * you can interact with them (images and components)
   */
  editor.isVoid = (element) => {
    // @ts-ignore
    return element.type === 'mdxJsxFlowElement' ||
      // @ts-ignore
      element.type === 'image'
      ? // @ts-ignore
        //  || element.type === 'code_block'
        true
      : isVoid(element)
  }

  /**
   * We override new paragraph insertions by pressing "Enter".
   * Whenever a new paragraph is addded we ensure the styles are reset
   * (e.g. if the previous entry was a heading, the new one will be a paragraph)
   * As well as assigning each node a unique id.
   */
  editor.insertBreak = () => {
    const { selection } = editor
    const currentNode = getCurrentNodeType(editor)

    if (selection) {
      switch (currentNode) {
        // we want to stop the default behavior when
        // an mdx element is selected
        // so we can open it when the user presses enter instead
        case defaultNodeTypes.mdxJsxFlowElement:
          break
        default:
          Transforms.insertNodes(editor, {
            children: [{ text: '' }],
            // @ts-expect-error
            type: 'paragraph',
            id: uuidv4(),
          })
          break
      }
    }

    /**
     * It really annoys me when editors allow you to add blocks
     * but then don't leave a space after them at the end of
     * the editor for you to continue typing.
     * This fixes that by adding a paragraph at the end
     * if the last node isn't a paragraph
     */
    editor.normalizeNode = ([node, path]) => {
      if (path.length === 0) {
        if (editor.children.length > 0) {
          const lastNode = editor.children[editor.children.length - 1]
          if (
            !Element.isElement(lastNode) ||
            // @ts-expect-error
            // TODO: Fix this type
            lastNode.type !== defaultNodeTypes.paragraph
          ) {
            Transforms.insertNodes(
              editor,
              // @ts-expect-error
              // TODO: Fix this type
              { type: defaultNodeTypes.paragraph, children: [{ text: '' }] },
              { at: [editor.children.length] }
            )
            return
          }
        }
      }

      normalizeNode([node, path])
    }
  }

  /**
   * Used to identify special inline elements. Inline elements can be
   * escaped by pressing right arrow or clicking at the end of the paragraph.
   */
  editor.isInline = (element) => {
    const customElement: CustomElement = element as any
    return (
      ['link', 'code_snippet'].includes(customElement.type) || isInline(element)
    )
  }

  return editor
}
