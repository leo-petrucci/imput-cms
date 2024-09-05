import { useCallback, useContext } from 'react'
import { CommandsContext } from './context'
import { BaseEditor, Editor, Element, NodeEntry, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import { isWithinCodeBlock } from '../Elements/CodeBlockElement/utils'
import { focusAndRestoreSelection, focusEditor } from '../store'

export const useCommands = (editor: ReactEditor) => {
  const {
    open,
    setOpen: setOpenState,
    position,
    setPosition,
  } = useContext(CommandsContext)

  /**
   * Returns the Slate caret position
   */
  const getCaretPosition = () => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      return start
    }

    return null
  }

  /**
   * Converts Slate caret position to window position
   */
  const getCaretPositionOnDom = () => {
    const caretPosition = getCaretPosition()
    if (caretPosition) {
      const domSelection = window.getSelection()
      if (domSelection && domSelection.rangeCount > 0) {
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        return { top: rect.top, left: rect.left }
      }
      return null
    } else {
      console.log('No caret position (no selection or not collapsed)')
      return null
    }
  }

  const onChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
    editor: BaseEditor
  ) => {
    switch (event.key) {
      case '/': {
        setPosition(getCaretPositionOnDom())
        if (!open) {
          setOpen()
        }
        break
      }
    }
  }

  /**
   * Opens the command popover
   */
  const setOpen = () => {
    // we don't want the popover to trigger when someone is writing
    // a code block, that would be annoying
    if (!isWithinCodeBlock(editor)) {
      setOpenState(true)
    }
  }

  /**
   * Closes the command popover and refocuses the editor
   */
  const setClosed = () => {
    setOpenState(false)
  }

  const restoreSelection = () => {
    focusAndRestoreSelection(editor)
  }

  return {
    onChange,
    position,
    open,
    setOpen,
    setClosed,
    restoreSelection,
  }
}
