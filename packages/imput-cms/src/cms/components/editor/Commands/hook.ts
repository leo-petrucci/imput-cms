import { useContext, useEffect, useRef } from 'react'
import { CommandsContext } from './context'
import { BaseEditor, Range } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'

export const useCommands = (editor: ReactEditor) => {
  const {
    open,
    setOpen: setOpenState,
    position,
    setPosition,
  } = useContext(CommandsContext)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (editor) {
      ref.current = ReactEditor.toDOMNode(editor, editor)
    }
  }, [editor])

  /**
   * Returns the Slate caret position
   */
  const getCaretPosition = () => {
    const { selection } = editor

    // @ts-ignore
    console.log({ selection, isCollapsed: Range.isCollapsed(selection) })

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
        if (ref.current) {
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
    setOpenState(true)
  }

  /**
   * Closes the command popover and refocuses the editor
   */
  const setClosed = () => {
    setOpenState(false)
    ref.current?.focus()
  }

  return { onChange, position, open, setOpen, setClosed, editor: ref.current }
}
