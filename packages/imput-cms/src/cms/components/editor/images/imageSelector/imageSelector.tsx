import Image from '../../../../../cms/components/image'
import React from 'react'
import { useCMS } from '../../../../../cms/contexts/cmsContext/useCMSContext'
import { Imagetree } from '../../../../../cms/contexts/imageContext/context'
import { useImages } from '../../../../../cms/contexts/imageContext/useImageContext'
import { Button } from '@imput/components/Button'

export interface ImageSelectorProps {
  onImageSelect?: (filename: string) => void
}

/**
 * An interface that allows browsing, selecting and uploading new images
 */
const ImageSelector = ({ onImageSelect }: ImageSelectorProps) => {
  const { imageTree } = useImages()

  return (
    <>
      <div className="relative grid gap-2 grid-cols-1 md:grid-cols-3">
        {imageTree.map((i) => (
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
      className="h-auto flex flex-col truncate !items-start"
      onClick={() => {
        // return the full path to the public image
        onImageSelect?.(`${public_folder}/${image.path!}`)
      }}
    >
      <Image path={image.path!} />
      <div className="truncate max-w-full px-1 py-2">
        <h2 className="text-lg font-medium max-w-full truncate">
          {image.path}
        </h2>
      </div>
    </Button>
  )
}

export default ImageSelector
