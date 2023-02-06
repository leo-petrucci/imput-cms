import { Plus } from 'phosphor-react'
import { ReactEditor, useSlate } from 'slate-react'
import { addEmptySpace } from 'cms/components/editor/lib/editorControls'
import { Element } from 'slate'
import { StyledButton } from 'cms/components/editor/controls'

/**
 * Renders a button that, when clicked, adds an empty paragraph after the specified `element`
 */
const AddSpace = ({ element }: { element: Element }) => {
  const editor = useSlate() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  return (
    <StyledButton
      type="button"
      onClick={() => {
        addEmptySpace(editor, [path[0] + 1])
      }}
    >
      <Plus size={16} />
    </StyledButton>
  )
}

export default AddSpace
