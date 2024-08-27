import { BaseEditor, Editor } from 'slate'
import { addLinkLeaf, toggleMark } from './marksAndBlocks'
import { ReactEditor } from 'slate-react'

/**
 * Formatting shortcuts
 */
export const shortcuts = (
  event: React.KeyboardEvent<HTMLInputElement>,
  editor: ReactEditor
) => {
  if (!event.ctrlKey && !event.metaKey) {
    return
  }

  switch (event.key) {
    case 'b':
      event.preventDefault()
      toggleMark(editor, 'bold')
      break
    case 'i':
      event.preventDefault()
      toggleMark(editor, 'italic')
      break
    case 'k':
      event.preventDefault()
      addLinkLeaf(editor)
      break
  }
}
