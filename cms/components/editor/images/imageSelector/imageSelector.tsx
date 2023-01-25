import Box from 'cms/components/designSystem/box'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { Imagetree } from 'cms/contexts/imageContext/context'
import { useImages } from 'cms/contexts/imageContext/useImageContext'
import { useOnScreen } from 'cms/utils/useOnScreen'
import { LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { styled } from 'stitches.config'

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
      <Box
        css={{
          position: 'relative',
          display: 'grid',
          gap: '$2',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@md': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
          overflowY: 'scroll',
        }}
      >
        <LayoutGroup>
          {imageTree.map((i) => (
            <ImageCard onImageSelect={onImageSelect} key={i.path} image={i} />
          ))}
        </LayoutGroup>
      </Box>
    </>
  )
}

const ImageSelectorButton = styled('button', {
  borderRadius: '.25em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  cursor: 'pointer',
  background: 'none',
  border: '1px solid $gray-300',
  textAlign: 'left',
  padding: 0,

  '&:hover': { backgroundColor: '$gray-100' },
})

const ImageCard = ({
  image,
  onImageSelect,
}: {
  image: Imagetree
  onImageSelect: ImageSelectorProps['onImageSelect']
}) => {
  const { public_folder } = useCMS()
  const { images, loadImage, setImages } = useImages()
  const imageBlobUrl = images.find((i) =>
    i.filename.includes(image.path!)
  )?.blobUrl

  const ref: any = React.useRef<HTMLDivElement>()
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref)

  // if the image isn't currently loaded into state we wait until its shown on screen and then load it
  React.useEffect(() => {
    const doLoad = async () => {
      const loadedImage = await loadImage(image.path!)
      setImages((i) => [...i, loadedImage])
    }
    if (imageBlobUrl === undefined && onScreen) {
      doLoad()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlobUrl, onScreen])

  return (
    <MotionImageSelectorButton
      layout
      ref={ref}
      onClick={() => {
        // return the full path to the public image
        onImageSelect?.(`${public_folder}/${image.path!}`)
      }}
    >
      <Box
        css={{
          backgroundImage: `url(${imageBlobUrl})`,
          height: '12rem',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box
        css={{
          padding: '$1 $2',
          '& > h2': {
            fontSize: '$md',
            fontWeight: '$medium',
          },
        }}
      >
        <h2>{image.path}</h2>
      </Box>
    </MotionImageSelectorButton>
  )
}

const MotionImageSelectorButton = motion(ImageSelectorButton)

export default ImageSelector
