import { BaseSelection, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { create } from 'zustand'

/**
 * Global store for the editor's element
 * We use this to focus the editor from anywhere
 * because it's a bitch to do otherwise
 */

interface EditorStore {
  editorRef: HTMLElement | null
  lastSelection: BaseSelection | null
  setEditor: (editor: ReactEditor) => void
  setLastSelection: (lastSelection: BaseSelection) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  editorRef: null,
  lastSelection: null,
  setEditor: (editor: ReactEditor) => {
    const editorRef = ReactEditor.toDOMNode(editor, editor)
    set({ editorRef })
  },
  setLastSelection: (lastSelection: BaseSelection) => {
    set({ lastSelection })
  },
}))

/**
 * Focus the editor
 */
export const focusEditor = () => {
  useEditorStore.getState().editorRef?.focus()
}

/**
 * Sets the editor ref globally
 */
export const setEditorRef = (editor: ReactEditor) => {
  useEditorStore.getState().setEditor(editor)
}

/**
 * Saves the last position of the cursor (selection)
 */
export const setLastSelection = (editor: ReactEditor) => {
  useEditorStore.getState().setLastSelection(editor.selection)
}

/**
 * Returns the stored cursor position
 */
export const getLastSelection = () => {
  return useEditorStore.getState().lastSelection
}

/**
 * Focuses the editor and restores the last cursor position
 */
export const focusAndRestoreSelection = (editor: ReactEditor) => {
  setTimeout(() => {
    focusEditor()
    setTimeout(() => {
      Transforms.select(editor, getLastSelection()!)
    }, 10)
  }, 0)
}
