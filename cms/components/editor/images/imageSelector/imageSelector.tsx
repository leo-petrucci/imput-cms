import Box from 'cms/components/designSystem/box'
import Flex from 'cms/components/designSystem/flex'
import { Imagetree } from 'cms/contexts/imageContext/context'
import { useImages } from 'cms/contexts/imageContext/useImageContext'
import useMeasure from 'cms/utils/useMeasure'
import { useOnScreen } from 'cms/utils/useOnScreen'
import React from 'react'
import { styled } from 'stitches.config'
import Button from 'cms/components/designSystem/button'
import { useUploadFile } from 'cms/queries/github'
import { toast } from 'react-hot-toast'

export interface ImageSelectorProps {
  onImageSelect?: (filename: string) => void
}

/**
 * An interface that allows browsing, selecting and uploading new images
 */
const ImageSelector = ({ onImageSelect }: ImageSelectorProps) => {
  const { imageTree } = useImages()
  const [ref, { height }] = useMeasure()
  const uploadRef = React.useRef<any>()
  const { mutate, isLoading } = useUploadFile()

  return (
    <Flex direction="column">
      <Box
        // @ts-ignore
        ref={ref}
        css={{
          position: 'absolute',
          inset: 0,
        }}
      />
      <Box
        css={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          justifyContent: 'end',
          padding: '0 0 $2 0',
          margin: '0 0 $2 0',
          borderBottom: '1px solid $gray-200',
        }}
      >
        <div>
          <input
            ref={uploadRef}
            type="file"
            style={{ visibility: 'hidden', display: 'none' }}
            accept="video/*, image/*"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files?.length > 0) {
                const file = e.target.files[0]
                const id = toast.loading(`Uploading ${file.name}...`)
                mutate(
                  {
                    filename: file.name,
                    file: file,
                  },
                  {
                    onSuccess: () => {
                      toast.success(`${file.name} uploaded!`, { id })
                    },
                    onError: () => {
                      toast.error(
                        `There was a problem uploading ${file.name}`,
                        { id }
                      )
                    },
                  }
                )
              }
            }}
          />
          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={() => {
              uploadRef.current.click()
            }}
          >
            Upload
          </Button>
        </div>
      </Box>
      <Box
        css={{
          position: 'relative',
          display: 'grid',
          gap: '$2',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@md': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
          maxHeight: height > 0 ? height : 'auto',
          overflowY: 'scroll',
        }}
      >
        {imageTree.map((i) => (
          <ImageCard onImageSelect={onImageSelect} key={i.path} image={i} />
        ))}
      </Box>
    </Flex>
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
  const { images, loadImage, setImages } = useImages()
  const imageBlobUrl = images.find((i) =>
    i.filename.includes(image.path!)
  )?.blobUrl

  const ref: any = React.useRef<HTMLDivElement>()
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref)

  // if the image isn't currently loaded into state we wait until its shown on screen and then load it
  React.useEffect(() => {
    const doLoad = async () => {
      console.log('loading')
      const loadedImage = await loadImage(image.path!)
      setImages((i) => [...i, loadedImage])
    }
    if (imageBlobUrl === undefined && onScreen) {
      doLoad()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlobUrl, onScreen])

  return (
    <ImageSelectorButton
      ref={ref}
      onClick={() => {
        // console.log(image)
        onImageSelect?.(image.path!)
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
    </ImageSelectorButton>
  )
}

export default ImageSelector
