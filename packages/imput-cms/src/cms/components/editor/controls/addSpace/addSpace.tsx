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
        className="imp-flex imp-justify-center imp-items-center imp-p-1 imp-rounded-md imp-border imp-border-input imp-transition-colors imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground imp-cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </NewNodeToolbar>
  )
}

export default AddSpace
