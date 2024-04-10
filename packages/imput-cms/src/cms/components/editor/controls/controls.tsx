import { Element } from 'slate'
import React from 'react'
import AddSpace from '../../../../cms/components/editor/controls/addSpace'
import RemoveElement from '../../../../cms/components/editor/controls/removeElement'

const Controls = ({ element }: { element: Element }) => {
  return (
    <div className="-imp-mt-1 relative">
      <div className="imp-flex imp-items-center imp-justify-center imp-gap-2">
        <AddSpace element={element} />
        <RemoveElement element={element} />
      </div>
    </div>
  )
}

export default Controls
