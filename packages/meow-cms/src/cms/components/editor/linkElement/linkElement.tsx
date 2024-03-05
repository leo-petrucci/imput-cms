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
import { Label } from '@meow/components/Label'
import { Input } from '@meow/components/Input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@meow/components/Popover'

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
        <div className="flex flex-1">
          <div className="flex flex-col gap-1 flex-1">
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
                // imageTitle?.onImageTitleChange(value)
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
const InlineChromiumBugfix = () => {
  return (
    <span className="text-[0px]">
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )
}

const StyledLink = cva('font-medium text-blue-500', {
  variants: {
    selected: {
      true: 'outline-none ring border-blue-500 rounded',
    },
  },
})

export default LinkElement
