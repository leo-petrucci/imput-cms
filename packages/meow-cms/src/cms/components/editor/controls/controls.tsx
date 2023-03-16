import { Box } from '@meow/components'
import { Flex } from '@meow/components'
import { Element } from 'slate'
import React from 'react'
import { styled } from '@meow/stitches'
import AddSpace from '../../../../cms/components/editor/controls/addSpace'
import RemoveElement from '../../../../cms/components/editor/controls/removeElement'

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
        marginTop: '-$1',
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
