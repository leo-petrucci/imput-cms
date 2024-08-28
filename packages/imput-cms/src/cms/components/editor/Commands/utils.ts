import { Editor, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

/**
 * This deletes the `/` character used to open the command popover
 */
export const deleteCommandCharacter = (editor: ReactEditor) => {
  const { selection } = editor
  if (selection && Range.isCollapsed(selection)) {
    const start = Editor.before(editor, selection.anchor, {
      unit: 'character',
    })
    if (start) {
      const range = {
        anchor: start,
        focus: selection.anchor,
      }
      const text = Editor.string(editor, range)
      if (text === '/') {
        Transforms.delete(editor, { at: range })
      }
    }
  }
}

export const commandDecorator = (editor: ReactEditor, [node, path]) => {
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
  }
  return []
}
