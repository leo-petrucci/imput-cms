import Box from 'cms/components/designSystem/box'
import Image from 'cms/components/image/image'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from 'cms/queries/github'
import { CollectionType } from 'cms/types/collection'
import matter from 'gray-matter'
import { isString } from 'lodash'
import { NonUndefined } from 'react-hook-form'
import { Link, useRouteMatch } from 'react-router-dom'

export interface CollectionCardProps extends CollectionType {
  baseUrl: string
}

const CollectionCard = (props: CollectionCardProps) => {
  const { currentCollection } = useCMS()

  // We assume the first field in fields is what we want displayed as a title
  const title = props.data[currentCollection.fields[0].name] || props.slug

  // find the first image field in config, then use its name to find the image in the props
  const firstImageField = currentCollection.fields.find(
    (f) => f.widget === 'image'
  )
  const image = firstImageField ? props.data[firstImageField.name] : undefined

  return (
    <Link key={props.slug} to={`${props.baseUrl}/${props.slug}`}>
      <Box
        css={{
          borderRadius: '$md',
          border: '1px solid $gray-200',
          overflow: 'hidden',
          transition: '200ms background',

          '&:hover': {
            background: '$gray-50',
          },
        }}
      >
        <Image path={image} />
        <Box
          css={{
            padding: '$4',
            fontSize: '$xl',
            fontWeight: '$semibold',
          }}
        >
          {title}
        </Box>
      </Box>
    </Link>
  )
}

export default CollectionCard
