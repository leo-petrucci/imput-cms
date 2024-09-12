import React from 'react'
import { Button } from '@imput/components/Button'
import Image from '../../../../image'
import { useCMS } from '../../../../../contexts/cmsContext/useCMSContext'
import { Imagetree } from '../../../../../contexts/imageContext/context'
import { useImages } from '../../../../../contexts/imageContext/useImageContext'

export interface ImageSelectorProps {
  onImageSelect?: (filename: string) => void
  search?: string
}

/**
 * An interface that allows browsing, selecting and uploading new images
 */
const ImageSelector = ({ onImageSelect, search }: ImageSelectorProps) => {
  const { imageTree } = useImages()

  return (
    <>
      <div className="imp-relative imp-grid imp-gap-2 imp-grid-cols-1 md:imp-grid-cols-3">
        {imageTree
          .filter((i) => i.path?.includes(search || ''))
          .map((i) => (
            <ImageCard onImageSelect={onImageSelect} key={i.path} image={i} />
          ))}
      </div>
    </>
  )
}

const ImageCard = ({
  image,
  onImageSelect,
}: {
  image: Imagetree
  onImageSelect: ImageSelectorProps['onImageSelect']
}) => {
  const { public_folder } = useCMS()

  return (
    <Button
      variant="outline"
      className="imp-h-auto imp-flex imp-flex-col imp-truncate !imp-items-start"
      onClick={() => {
        // return the full path to the public image
        onImageSelect?.(`${public_folder}/${image.path!}`)
      }}
    >
      <Image path={image.path!} />
      <div className="imp-truncate imp-max-w-full imp-px-1 imp-py-2">
        <h2 className="imp-text-lg imp-font-medium imp-max-w-full timp-runcate">
          {image.path}
        </h2>
      </div>
    </Button>
  )
}

export default ImageSelector
