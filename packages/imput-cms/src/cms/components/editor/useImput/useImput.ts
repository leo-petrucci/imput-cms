import { useCallback, useEffect } from 'react'
import { ReactEditor } from 'slate-react'
import { setEditorRef } from '../store'
import { Editor, Element, NodeEntry, Range } from 'slate'
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

  const decorate = useCallback(([node, path]: NodeEntry) => {
    if (editor.selection != null) {
      if (
        !Editor.isEditor(node) &&
        Editor.string(editor, [path[0]]) === '' &&
        Range.includes(editor.selection, path) &&
        Range.isCollapsed(editor.selection)
      ) {
        return [
          {
            ...editor.selection,
            placeholder: true,
          },
        ]
      }
      if (
        Element.isElement(node) &&
        // @ts-expect-error
        node.type === defaultNodeTypes.code_line
      ) {
        // @ts-expect-error
        const ranges = editor.nodeToDecorations.get(node) || []
        return ranges
      }

      return []
    }
    return []
  }, [])

  return { decorate }
}
