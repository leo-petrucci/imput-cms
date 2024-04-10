import React from 'react'
import { Transforms } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { cva } from 'class-variance-authority'
import { CustomElement } from '../../../types/slate'
import { Label } from '@imput/components/Label'
import { Input } from '@imput/components/Input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@imput/components/Popover'

/**
 * Handles link elements in-editor. When clicked a popover appears which allows typing a link
 */
const LinkElement = ({
  attributes,
  element,
  children,
}: Omit<RenderElementProps, 'element'> & { element: CustomElement }) => {
  const selected = useSelected()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)
  return (
    <Popover>
      <PopoverContent>
        <div className="imp-flex imp-flex-1">
          <div className="imp-flex imp-flex-col imp-gap-1 imp-flex-1">
            <Label htmlFor={`image-title`}>Url</Label>
            <Input
              name="image-title"
              defaultValue={element.url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                Transforms.setNodes<any>(
                  editor,
                  {
                    url: value,
                  },
                  {
                    at: path,
                  }
                )
              }}
            />
          </div>
        </div>
      </PopoverContent>
      <PopoverTrigger>
        <a
          className={StyledLink({ selected })}
          {...attributes}
          href={element.url}
        >
          <InlineChromiumBugfix />
          {children}
          <InlineChromiumBugfix />
        </a>
      </PopoverTrigger>
    </Popover>
  )
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
export const InlineChromiumBugfix = () => {
  return (
    <span className="imp-text-[0px]">
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )
}

const StyledLink = cva('imp-font-medium imp-text-blue-500', {
  variants: {
    selected: {
      true: 'imp-outline-none imp-ring imp-border-blue-500 imp-rounded',
    },
  },
})

export default LinkElement
