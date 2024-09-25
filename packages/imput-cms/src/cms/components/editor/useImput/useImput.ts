import { useEffect } from 'react'
import { ReactEditor } from 'slate-react'
import { setEditorRef } from '../store'
import { Element, Transforms } from 'slate'
import { defaultNodeTypes } from '../remark-slate'

/**
 * Doesn't do anything in particular, we just move hooks
 * we'd have in the editor component in here for cleanness
 */
export const useImput = (editor: ReactEditor) => {
  /**
   * Sets the global editor ref,
   * used for focusing
   */
  useEffect(() => {
    if (editor) {
      setEditorRef(editor)
    }
  }, [editor])

  /**
   * This checks that the last node of the editor is a paragraph
   * at load time. If it isn't, we create a new paragraph node at the end.
   *
   * This is similar to what we do in normalize, but for some reason normalize
   * doesn't work on editor creation. Not sure why.
   */
  useEffect(() => {
    if (editor.children.length > 0) {
      const lastNode = editor.children[editor.children.length - 1]
      if (
        !Element.isElement(lastNode) ||
        // @ts-expect-error Fix this
        lastNode.type !== defaultNodeTypes.paragraph
      ) {
        Transforms.insertNodes(
          editor,
          // @ts-expect-error Fix this
          { type: defaultNodeTypes.paragraph, children: [{ text: '' }] },
          { at: [editor.children.length] }
        )
        return
      }
    }
  }, [])
}
