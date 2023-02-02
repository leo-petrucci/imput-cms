import Box from 'cms/components/designSystem/box'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { Link } from 'react-router-dom'
import { styled } from 'stitches.config'

const CollectionButton = styled(Link, {
  flex: '1 1 0%',
  textAlign: 'left',
  padding: '$3 $4',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',

  fontSize: '$lg',
  fontWeight: '$medium',

  color: '$primary-700',

  transition: '200ms background',

  '&:hover': { backgroundColor: '$primary-50' },
})

/**
 * Renders a container that lists all the different collections available
 */
const CollectionSelect = ({ baseUrl }: { baseUrl: string }) => {
  const { collections } = useCMS()
  return (
    <Box
      css={{
        borderRadius: '$md',
        border: '1px solid $gray-200',
      }}
    >
      <Box
        css={{
          padding: '$4',
        }}
      >
        Collections
      </Box>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid $gray-100',

          '&>:not([hidden])~:not([hidden])': {
            borderTop: 'calc(1px) solid $gray-100',
          },
        }}
      >
        {collections.map((c) => (
          <CollectionButton key={c.name} to={`${baseUrl}/${c.name}`}>
            {c.label}
          </CollectionButton>
        ))}
      </Box>
    </Box>
  )
}

export default CollectionSelect
