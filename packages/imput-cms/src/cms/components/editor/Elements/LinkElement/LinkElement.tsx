import React from 'react'
import { Transforms } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { cva } from 'class-variance-authority'
import { LinkElement as LinkElementType } from '../../../../types/slate'
import { LinkPopover } from './LinkPopover'

/**
 * Handles link elements in-editor. When clicked a popover appears which allows typing a link
 */
export const LinkElement = ({
  attributes,
  element,
  children,
}: Omit<RenderElementProps, 'element'> & { element: LinkElementType }) => {
  const selected = useSelected()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  return (
    <LinkPopover element={element} path={path} selected={selected}>
      <span
        className={StyledLink({ selected })}
        {...attributes}
        // href={element.url}
      >
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </span>
    </LinkPopover>
  )
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
export const InlineChromiumBugfix = () => {
  return (
    <span className="imp-text-[0px]" contentEditable={false}>
      {String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )
}

const StyledLink = cva(
  'imp-font-medium imp-text-blue-500 imp-cursor-pointer imp-inline',
  {
    variants: {
      selected: {
        true: 'imp-outline-none imp-ring imp-border-blue-500 imp-rounded',
      },
    },
  }
)
