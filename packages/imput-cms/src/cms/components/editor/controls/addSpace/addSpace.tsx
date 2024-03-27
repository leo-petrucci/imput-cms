import React from 'react'
import { Plus } from '@imput/components/Icon'
import { Element } from 'slate'
import { NewNodeToolbar } from '../../newNodeToolbar'

/**
 * Renders a button that, when clicked, adds an empty paragraph after the specified `element`
 */
const AddSpace = ({ element }: { element: Element }) => {
  return (
    <NewNodeToolbar element={element}>
      <button
        type="button"
        className="flex justify-center items-center p-1 rounded-md border border-input transition-colors bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </NewNodeToolbar>
  )
}

export default AddSpace
