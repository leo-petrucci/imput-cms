import { styled } from 'stitches.config'

export const Leaf = ({ attributes, children, leaf }: any) => {
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

  return <span {...attributes}>{children}</span>
}

const Code = styled('code', {
  padding: '0.2em 0.4em',
  margin: 0,
  fontSize: '85%',
  whiteSpace: 'break-spaces',
  backgroundColor: '$gray-100',
  borderRadius: 6,
})
