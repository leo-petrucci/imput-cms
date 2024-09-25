import { useEffect } from 'react'
import { ReactEditor } from 'slate-react'
import { setEditorRef } from '../store'
import { Editor, Element, Transforms } from 'slate'
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
   * We force a normalization as soon as the editor initializes
   * This should be the default Slate behavior imo
   */
  useEffect(() => {
    if (editor.children.length > 0) {
      Editor.normalize(editor, {
        force: true,
      })
    }
  }, [])
}
