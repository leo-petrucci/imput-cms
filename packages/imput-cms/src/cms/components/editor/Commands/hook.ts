import { useContext, useEffect, useRef } from 'react'
import { CommandsContext } from './context'
import { BaseEditor, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { isWithinCodeBlock } from '../codeblockElement/utils'

export const useCommands = (editor: ReactEditor) => {
  const {
    open,
    setOpen: setOpenState,
    position,
    setPosition,
    lastSelection,
    setLastSelection,
    editorRef,
  } = useContext(CommandsContext)

  useEffect(() => {
    if (editor) {
      editorRef.current = ReactEditor.toDOMNode(editor, editor)
    }
  }, [editor])

  /**
   * Returns the Slate caret position
   */
  const getCaretPosition = () => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      console.log({ edges: Range.edges(selection) })
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
        console.log('Caret DOM position:', { top: rect.top, left: rect.left })
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
        if (editorRef.current) {
          setPosition(getCaretPositionOnDom())
          if (!open) {
            setOpen()
          }
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
      setLastSelection(editor.selection)
      setOpenState(true)
    }
  }

  /**
   * Closes the command popover and refocuses the editor
   */
  const setClosed = () => {
    setOpenState(false)
    editorRef.current?.focus()
  }

  const restoreSelection = () => {
    if (lastSelection) {
      setTimeout(() => {
        editorRef.current?.focus()
        setTimeout(() => {
          Transforms.select(editor, lastSelection)
        }, 10)
      }, 0)
    }
  }

  return {
    onChange,
    position,
    open,
    setOpen,
    setClosed,
    editor: editorRef.current,
    restoreSelection,
  }
}
