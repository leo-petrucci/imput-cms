import React from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { BlockButton, ComponentButton } from '../button/button'
import Toggle from '@meow/components/Toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@meow/components/Popover'
import {
  Code,
  Image,
  ListBullets,
  ListNumbers,
  Quotes,
  TextHOne,
  TextHThree,
  TextHTwo,
} from 'phosphor-react'
import { Transforms, Element } from 'slate'
import { ImageElement } from '../images/imageElement'
import { Paragraph } from '@meow/components/Icon'
import { addEmptySpace } from '../lib/editorControls'

type NewNodeToolbarProps = {
  children: React.ReactNode
  element: Element
}

/**
 * This component handles adding new nodes to Slate
 * On click of its child it will pop out a popover with elements to choose from
 */
const NewNodeToolbar = ({ children, element }: NewNodeToolbarProps) => {
  const editor = useSlate() as ReactEditor

  const path = ReactEditor.findPath(editor, element)

  return (
    <Popover>
      <PopoverContent side="top" className="p-0 w-auto">
        <div className="flex">
          <Toggle
            pressed={false}
            onPressedChange={() => {
              addEmptySpace(editor, [path[0] + 1])
            }}
          >
            <Paragraph size={16} alt="image-icon" />
          </Toggle>
          <Toggle
            pressed={false}
            onPressedChange={() => {
              const text = { text: '' }
              const image: ImageElement = {
                type: 'image',
                link: null,
                title: '',
                caption: '',
                children: [text],
              }
              Transforms.insertNodes(editor, image)
            }}
          >
            <Image size={16} alt="image-icon" />
          </Toggle>
          <ComponentButton />
        </div>
      </PopoverContent>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
    </Popover>
  )
}

export { NewNodeToolbar }
