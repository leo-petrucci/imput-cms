import { ReactEditor } from 'slate-react'
import isEqual from 'lodash/isEqual'
import { Element, Transforms, Node, Path } from 'slate'
import { v4 as uuidv4 } from 'uuid'
import { CustomElement } from '../../../../cms/types/slate'
import { getCurrentNodeType } from './utils'
import { defaultNodeTypes } from '../remark-slate'

/**
 * Adds custom Imput functions for the slate editor
 */
export const withImput = (editor: ReactEditor) => {
  const { isVoid, isInline, normalizeNode, insertBreak } = editor

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
        case defaultNodeTypes.code_block:
          insertBreak()
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
  }

  /**
   * Normalizing allows us to correct nodes as they're being written
   */
  editor.normalizeNode = ([node, path]) => {
    /**
     * This checks if the parent of the node is a code block
     * if it is and the node isn't a `code_line` it unwraps it
     * (leaving just the plain text) and then rewraps it
     * as a code line.
     *
     * This fixes pasting rich text into code blocks.
     */
    const ancestors = Path.ancestors(path)
    if (ancestors.length > 0) {
      const ancestorsWithoutRoot = ancestors.filter((a) => !isEqual(a, []))
      if (ancestorsWithoutRoot.length > 0) {
        const highestElement = ancestorsWithoutRoot[0]
        const parentIsCodeBlock =
          (Node.get(editor, highestElement) as any).type ===
          defaultNodeTypes.code_block
        if (
          parentIsCodeBlock &&
          Boolean((node as any).type) &&
          (node as any).type !== defaultNodeTypes.code_line
        ) {
          Transforms.unwrapNodes(editor, {
            at: path,
          })
          Transforms.wrapNodes(
            editor,
            {
              // @ts-expect-error TODO: fix this
              type: defaultNodeTypes.code_line,
              // @ts-expect-error TODO: fix this
              children: node.children,
            },
            { at: path }
          )
          return
        }
        return
      }
      return
    }

    /**
     * It really annoys me when editors allow you to add blocks
     * but then don't leave a space after them at the end of
     * the editor for you to continue typing.
     * This fixes that by adding a paragraph at the end
     * if the last node isn't a paragraph
     */
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
        return
      }
      return
    }

    normalizeNode([node, path])
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
