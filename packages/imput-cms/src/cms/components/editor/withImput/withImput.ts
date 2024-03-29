import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import { v4 as uuidv4 } from 'uuid'
import { CustomElement } from 'src/cms/types/slate'

/**
 * Adds custom Imput functions for the slate editor
 */
export const withImput = (editor: ReactEditor) => {
  const { isVoid, isInline } = editor

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

    if (selection) {
      Transforms.insertNodes(editor, {
        children: [{ text: '' }],
        // @ts-expect-error
        type: 'paragraph',
        id: uuidv4(),
      })
      return
    }
  }

  /**
   * Used to identify special inline elements. Inline elements can be
   * escaped by pressing right arrow or clicking at the end of the paragraph.
   */
  editor.isInline = (element) => {
    const customElement: CustomElement = element as any
    console.log('customElement', customElement)
    return (
      ['link', 'code_snippet'].includes(customElement.type) || isInline(element)
    )
  }

  return editor
}
