import { Editor, Element, Path, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import { defaultNodeTypes } from '../../remark-slate'
import { KeyboardEvent } from 'react'
import isHotkey from 'is-hotkey'

/**
 * Returns whether cursor is within a code_block element
 */
export const isWithinCodeBlock = (editor: ReactEditor) => {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {
    const [block, blockPath] =
      Editor.above(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          // @ts-expect-error
          n.type === defaultNodeTypes.code_block,
      }) || []
    return Boolean(block)
  }
  return false
}

/**
 * returns whether specific path is child of a code_block
 */
export const elementIsWithinCodeBlock = (editor: ReactEditor, path: Path) => {
  const [block] =
    Editor.above(editor, {
      at: path,
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        // @ts-expect-error
        n.type === defaultNodeTypes.code_block,
    }) || []
  return Boolean(block)
}

/**
 * Listens to onKeyDown events. If the cursor is within a codeblock, adds a tab space
 */
export const codeBlockOnKeyDown = (
  editor: ReactEditor,
  event: KeyboardEvent
) => {
  if (isHotkey('tab', event.nativeEvent) && isWithinCodeBlock(editor)) {
    const [block] =
      Editor.above(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          // @ts-expect-error
          n.type === defaultNodeTypes.code_block,
      }) || []

    if (block) {
      // handle tab key, insert spaces
      event.preventDefault()

      Editor.insertText(editor, '  ')
    }
  }
}
