import React from 'react'
import { cva } from 'class-variance-authority'

export const Leaf = (props: any) => {
  let { children, leaf } = props

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.placeholder) {
    return (
      <>
        <Text {...props}>{children}</Text>
        <span
          className="imp-text-muted-foreground imp-absolute imp-inset-0 imp-pointer-events-none imp-opacity-75"
          contentEditable={false}
        >
          Write something or type "/" to select a command
        </span>
      </>
    )
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
  const { text, ...rest } = leaf
  return (
    <span
      className={`${StyledText({ text: leaf.text ? true : true })} ${Object.keys(rest).join(' ')}`}
      {...attributes}
    >
      {children}
    </span>
  )
}

const StyledText = cva('', {
  variants: {
    text: {
      true: 'imp-pl-[0.1px]',
    },
  },
})
