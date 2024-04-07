import Image from '../../image/image'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'
import { CollectionType } from '../../../types/collection'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@imput/components/Card'
import { Skeleton } from '@imput/components/Skeleton'
import React from 'react'

export interface CollectionCardProps extends CollectionType {
  baseUrl: string
}

/**
 * Render a clickable content card
 */
export const CollectionCard = (props: CollectionCardProps) => {
  const { currentCollection } = useCMS()

  // find the first string field in config
  const firstStringField = currentCollection.fields.find(
    (f) => f.widget === 'string'
  )

  // title is first string field
  // falls back to file slug if not defined
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
        {image && <Image path={image} />}
        <CardHeader>{title}</CardHeader>
      </Card>
    </Link>
  )
}

export const CollectionCardSkeleton = () => {
  const { currentCollection } = useCMS()

  // if collection doesn't have images we don't bother showing a skeleton
  const firstImageField = currentCollection.fields.find(
    (f) => f.widget === 'image'
  )

  return (
    <Card className="hover:bg-primary-foreground transition-colors hover:text-accent-foreground overflow-hidden">
      {firstImageField && <Skeleton className="w-full h-48" />}
      <CardHeader>
        <Skeleton className="w-full h-6" />
      </CardHeader>
    </Card>
  )
}
