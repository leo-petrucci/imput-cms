import React from 'react'
import { Transforms } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { styled } from '@meow/stitches'
import { CustomElement } from '../../../types/slate'
import Flex from '../../designSystem/flex'
import Input from '../../designSystem/input'
import Label from '../../designSystem/label'
import Popover from '../../designSystem/popover'

const LinkElement = ({
  attributes,
  element,
  children,
}: Omit<RenderElementProps, 'element'> & { element: CustomElement }) => {
  const selected = useSelected()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)
  return (
    <Popover
      content={
        <Flex>
          <Flex direction="column" gap="1">
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
          </Flex>
        </Flex>
      }
    >
      <StyledLink {...attributes} href={element.url} selected={selected}>
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </StyledLink>
    </Popover>
  )
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <StyledInlineChromiumBugfix contentEditable={false}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </StyledInlineChromiumBugfix>
)

const StyledInlineChromiumBugfix = styled('span', {
  fontSize: 0,
})

const StyledLink = styled('a', {
  fontWeight: '$medium',
  color: '$blue-600',

  hover: {},

  variants: {
    selected: {
      true: {
        boxShadow: '0 0 0 3px $blue-100',
        borderRadius: '$md',
        color: '$blue-500',
      },
    },
  },
})

export default LinkElement
