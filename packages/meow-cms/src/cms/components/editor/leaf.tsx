import { styled } from '@meow/stitches'
import React from 'react'

export const Leaf = (props: any) => {
  let { children, leaf } = props
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <Code>{children}</Code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <Text {...props}>{children}</Text>
}

// The following is a workaround for a Chromium bug where,
// if you have an inline at the end of a block,
// clicking the end of a block puts the cursor inside the inline
// instead of inside the final {text: ''} node
// https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
const Text = (props: any) => {
  const { attributes, children, leaf } = props
  return (
    <StyledText text={leaf.text ? true : false} {...attributes}>
      {children}
    </StyledText>
  )
}

const StyledText = styled('span', {
  variants: {
    text: {
      true: {
        paddingLeft: '0.1px',
      },
    },
  },
})

const Code = styled('code', {
  padding: '0.2em 0.4em',
  margin: 0,
  fontSize: '85%',
  whiteSpace: 'break-spaces',
  backgroundColor: '$gray-100',
  borderRadius: 6,
})
