import Box from 'cms/components/designSystem/box'
import Flex from 'cms/components/designSystem/flex'
import { Element } from 'slate'
import { styled } from 'stitches.config'
import AddSpace from 'cms/components/editor/controls/addSpace'
import RemoveElement from 'cms/components/editor/controls/removeElement'

export const StyledButton = styled('button', {
  padding: '$1',
  background: 'white',
  border: '1px solid $gray-100',
  borderRadius: '$md',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  '&:hover': {
    background: '$gray-100',
  },
})

const Controls = ({ element }: { element: Element }) => {
  return (
    <Box
      css={{
        marginTop: '-$6',
        zIndex: 0,
        position: 'relative',
      }}
    >
      <Flex align="center" justify="center" gap="2">
        <AddSpace element={element} />
        <RemoveElement element={element} />
      </Flex>
    </Box>
  )
}

export default Controls
