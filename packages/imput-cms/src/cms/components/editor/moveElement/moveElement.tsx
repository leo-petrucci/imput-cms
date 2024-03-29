import { CaretDown, CaretUp } from 'phosphor-react'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import React from 'react'
import { CustomRenderElementProps } from '../../../../cms/components/editor/element'
import { Button } from '@imput/components/Button'

const MoveElement = (props: CustomRenderElementProps) => {
  const editor = useSlate()
  // @ts-ignore
  const path = ReactEditor.findPath(editor, props.element)[0]
  return (
    <div
      style={{
        flex: 0,
      }}
      className="flex self-center flex-col justify-between gap-1"
    >
      <Button
        type="button"
        variant="ghost"
        className="p-1 h-auto"
        onClick={() => {
          if (path > 0) {
            Transforms.moveNodes(editor, {
              at: [path],
              to: [path - 1],
            })
          }
        }}
      >
        <CaretUp size={12} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="p-1 h-auto"
        onClick={() => {
          if (path < editor.children.length - 1) {
            Transforms.moveNodes(editor, {
              at: [path],
              to: [path + 1],
            })
          }
        }}
      >
        <CaretDown size={12} />
      </Button>
    </div>
  )
}

export default MoveElement