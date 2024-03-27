import Image from '../../../../cms/components/image/image'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { CollectionType } from '../../../../cms/types/collection'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@imput/components/Card'
import React from 'react'

export interface CollectionCardProps extends CollectionType {
  baseUrl: string
}

const CollectionCard = (props: CollectionCardProps) => {
  const { currentCollection } = useCMS()

  // find the first string field in config
  const firstStringField = currentCollection.fields.find(
    (f) => f.widget === 'string'
  )

  const title = firstStringField
    ? props.data[firstStringField.name]
    : props.slug

  // find the first image field in config, then use its name to find the image in the props
  const firstImageField = currentCollection.fields.find(
    (f) => f.widget === 'image'
  )
  const image = firstImageField ? props.data[firstImageField.name] : undefined

  return (
    <Link key={props.slug} to={`${props.baseUrl}/${props.slug}`}>
      <Card className="hover:bg-primary-foreground transition-colors hover:text-accent-foreground overflow-hidden">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image path={image} />
        <CardHeader>{title}</CardHeader>
      </Card>
    </Link>
  )
}

export default CollectionCard
