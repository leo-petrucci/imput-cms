import Box from '../../../../cms/components/designSystem/box'
import Flex from '../../../../cms/components/designSystem/flex'
import Input from '../../../../cms/components/designSystem/input'
import Popover from '../../../../cms/components/designSystem/popover'
import { useImages } from '../../../../cms/contexts/imageContext/useImageContext'
import { ImageSquare } from 'phosphor-react'
import { Element } from 'slate'
import { styled } from '../../../../stitches.config'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import Label from '../../../../cms/components/designSystem/label'
import ImageSelector from '../../../../cms/components/editor/images/imageSelector'
import { Modal } from '../../../../cms/components/designSystem/modal'
import ImageUploadButton from '../../../../cms/components/editor/images/uploadButton'
import Button from '../../../../cms/components/designSystem/button'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../../../cms/components/forms/form/form'
import React from 'react'

const StyledImage = styled('div', {
  display: 'block',
  maxWidth: '100%',
  minHeight: '20em',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

const StyledImageButton = styled('button', {
  width: '100%',
  background: 'white',
  border: '1px solid var(--colors-gray-200)',
  borderRadius: '$md',
  marginTop: '$1',
  marginBottom: '$1',
  cursor: 'pointer',
  padding: 0,
  overflow: 'hidden',
  position: 'relative',

  variants: {
    selected: {
      true: {
        outline: '2px solid var(--colors-gray-600)',
        outlineOffset: '4px',
      },
    },
  },
})

export interface ImageElement extends Element {
  type: 'image'
  link: string | null
  title: string
  caption: string
}

interface ImagePickerProps {
  /**
   * Adds a selection outline to the image picker
   */
  selected?: boolean
  imageTitle?:
    | {
        defaultValue: string
        onImageTitleChange: (value: string) => void
      }
    | false
  imageAltText?:
    | {
        defaultValue: string
        onImageAltTextChange: (value: string) => void
      }
    | false
  image: string | null
  /**
   * Callback that runs whenever an image is selected
   */
  onImageChange?: (value: string) => void
}

const ImagePicker = ({
  image,
  selected,
  onImageChange,
  imageAltText = false,
  imageTitle = false,
}: ImagePickerProps) => {
  const { images, loadImage, setImages } = useImages()
  const { public_folder } = useCMS()

  const imageBlobUrl = image
    ? images.find((i) => i.filename.includes(image))?.blobUrl
    : undefined

  // if the image isn't currently loaded into state we wait until its shown on screen and then load it
  React.useEffect(() => {
    const doLoad = async () => {
      const loadedImage = await loadImage(image!)
      setImages((i) => [...i, loadedImage])
    }
    if (imageBlobUrl === undefined && image) {
      doLoad()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlobUrl, image])

  return (
    <Popover
      content={
        <Box
          css={{
            position: 'relative',
            marginBottom: '$2',
          }}
        >
          <Flex direction="column" gap="2">
            {imageTitle !== false && (
              <Flex direction="column" gap="1">
                <Label htmlFor={`image-title`}>Image title</Label>
                <Input
                  name="image-title"
                  defaultValue={imageTitle?.defaultValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    imageTitle?.onImageTitleChange(value)
                  }}
                />
              </Flex>
            )}
            {imageAltText !== false && (
              <Flex direction="column" gap="1">
                <Label htmlFor={`image-alt`}>Image alt text</Label>
                <Input
                  name="image-alt"
                  defaultValue={imageAltText.defaultValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    imageAltText?.onImageAltTextChange(value)
                  }}
                />
              </Flex>
            )}
            <Flex direction="column" gap="1">
              <Label htmlFor={`image-file`}>Upload image</Label>
              <Modal
                title={'Select media'}
                css={{
                  zIndex: 9999,
                  minWidth: '100vw',
                  minHeight: '100vh',
                  '@md': {
                    minWidth: 968,
                    minHeight: 524,
                  },
                }}
                headingContent={
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
                    <ImageUploadButton />
                  </Box>
                }
                description={(_open, setOpen) => (
                  <ImageSelector
                    onImageSelect={(filename: string) => {
                      setOpen(false)
                      onImageChange?.(filename)
                    }}
                  />
                )}
              >
                <Button type="button">Select image</Button>
              </Modal>
            </Flex>
          </Flex>
        </Box>
      }
    >
      <StyledImageButton selected={selected} contentEditable={false}>
        <PopoverPrimitive.Anchor
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            height: !image ? '2em' : '6em',
            width: !image ? '2em' : '6em',
            background: 'transparent',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
          }}
        />
        {image ? (
          <StyledImage
            style={{
              backgroundImage: `url(${
                image
                  ? // needs to match the url as it is in markdown
                    // e.g. images/filename.png
                    images.find((i) =>
                      `${public_folder}/${i.filename}`.includes(`${image}`)
                    )?.blobUrl
                  : ''
              })`,
            }}
          />
        ) : (
          <Box
            css={{
              padding: '$4',
            }}
          >
            <Flex direction="row" gap="2" align="center">
              <ImageSquare size={16} weight="bold" />
              <Box
                css={{
                  color: '$gray-800',
                  fontWeight: '500',
                  fontSize: '$sm',
                }}
              >
                Add an image
              </Box>
            </Flex>
          </Box>
        )}
      </StyledImageButton>
    </Popover>
  )
}

interface ControlledImagePickerProps extends Omit<ImagePickerProps, 'image'> {}

const Controlled = (props: ControlledImagePickerProps) => {
  const form = useFormContext()
  const { rules, name } = useFormItem()

  const {
    field: { onChange: formOnchange, value },
  } = useController({
    name: name,
    control: form.control,
    rules,
  })

  return <ImagePicker {...props} onImageChange={formOnchange} image={value} />
}

ImagePicker.Controlled = Controlled

export default ImagePicker
