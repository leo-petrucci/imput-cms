import { useEffect } from 'react'
import { ReactEditor } from 'slate-react'
import { setEditorRef } from '../store'

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
}
