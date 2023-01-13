import Box from '../../designSystem/box'
import { CaretDown, CaretUp } from 'phosphor-react'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { styled } from 'stitches.config'
import { CustomRenderElementProps } from '../element'

const StyledButton = styled('button', {
  padding: '$1',
  background: 'transparent',
  border: '0px solid',
  borderRadius: '$sm',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  '&:hover': {
    background: '$gray-100',
  },
})

const MoveElement = (props: CustomRenderElementProps) => {
  const editor = useSlate()
  // @ts-ignore
  const path = ReactEditor.findPath(editor, props.element)[0]
  return (
    <Box
      css={{
        display: 'flex',
        alignSelf: 'center',
        flexDirection: 'column',
        flex: '0!important',
        justifyContent: 'space-between',
        gap: '$1',
      }}
    >
      <StyledButton
        type="button"
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
      </StyledButton>
      <StyledButton
        type="button"
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
      </StyledButton>
    </Box>
  )
}

export default MoveElement
