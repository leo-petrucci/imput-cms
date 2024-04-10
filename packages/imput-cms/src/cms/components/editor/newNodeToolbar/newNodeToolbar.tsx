import React from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { BlockButton, ComponentButton } from '../button/button'
import Toggle from '@imput/components/Toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@imput/components/Popover'
import { Image } from 'phosphor-react'
import { Transforms, Element } from 'slate'
import { ImageElement } from '../images/imageElement'
import { Code, Paragraph } from '@imput/components/Icon'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@imput/components/Tooltip'
import { v4 as uuidv4 } from 'uuid'
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
      <PopoverContent side="top" className="!imp-p-0 imp-w-auto">
        <div className="imp-flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  pressed={false}
                  onPressedChange={() => {
                    addEmptySpace(editor, [path[0] + 1])
                  }}
                >
                  <Paragraph size={16} />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent className="imp-max-w-sm">
                Paragraph
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  pressed={false}
                  onPressedChange={() => {
                    Transforms.insertNodes(
                      editor,
                      {
                        // @ts-ignore
                        id: uuidv4(),
                        children: [{ text: '' }],
                        type: 'code_block',
                        language: 'plain',
                      },
                      { at: [path[0] + 1], select: true }
                    )
                  }}
                >
                  <Code size={16} />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent className="imp-max-w-sm">
                Code Block
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
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
                    Transforms.insertNodes(editor, image, {
                      at: [path[0] + 1],
                      select: true,
                    })
                  }}
                >
                  <Image size={16} />
                </Toggle>{' '}
              </TooltipTrigger>{' '}
              <TooltipContent className="imp-max-w-sm">
                Image Block
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ComponentButton element={element} />
        </div>
      </PopoverContent>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
    </Popover>
  )
}

export { NewNodeToolbar }
