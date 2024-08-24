import { BaseEditor, Editor } from 'slate'
import { toggleMark } from './marksAndBlocks'

/**
 * Formatting shortcuts
 */
export const shortcuts = (
  event: React.KeyboardEvent<HTMLInputElement>,
  editor: BaseEditor
) => {
  if (!event.ctrlKey && !event.metaKey) {
    return
  }

  switch (event.key) {
    case 'b': {
      event.preventDefault()
      toggleMark(editor, 'bold')
      break
    }
    case 'i': {
      event.preventDefault()
      toggleMark(editor, 'italic')
      break
    }
  }
}
