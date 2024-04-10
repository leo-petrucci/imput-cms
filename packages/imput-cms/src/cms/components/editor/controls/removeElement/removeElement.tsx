import { Trash } from 'phosphor-react'
import { ReactEditor, useSlate } from 'slate-react'
import { removeElement } from '../../../../../cms/components/editor/lib/editorControls'
import React from 'react'
import { Element } from 'slate'

/**
 * Renders a button that, when clicked, removes the element it is connected to.
 */
const RemoveElement = ({ element }: { element: Element }) => {
  const editor = useSlate() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  return (
    <button
      type="button"
      className="imp-flex imp-justify-center imp-items-center imp-p-1 imp-rounded-md imp-border imp-border-input imp-transition-colors imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground imp-cursor-pointer"
      disabled={editor.children.length === 1}
      onClick={() => {
        removeElement(editor, [path[0]])
      }}
    >
      <Trash size={16} />
    </button>
  )
}

export default RemoveElement
