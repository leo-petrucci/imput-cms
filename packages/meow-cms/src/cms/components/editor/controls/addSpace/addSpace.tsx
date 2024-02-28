import { Plus } from 'phosphor-react'
import { ReactEditor, useSlate } from 'slate-react'
import { addEmptySpace } from '../../../../../cms/components/editor/lib/editorControls'
import { Element } from 'slate'
import React from 'react'

/**
 * Renders a button that, when clicked, adds an empty paragraph after the specified `element`
 */
const AddSpace = ({ element }: { element: Element }) => {
  const editor = useSlate() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  return (
    <button
      type="button"
      className="flex justify-center items-center p-1 rounded-md border border-input transition-colors bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
      onClick={() => {
        addEmptySpace(editor, [path[0] + 1])
      }}
    >
      <Plus size={16} />
    </button>
  )
}

export default AddSpace
