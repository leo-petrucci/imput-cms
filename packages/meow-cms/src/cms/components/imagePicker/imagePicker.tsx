import { Input, Modal } from '@meow/components'
import { useImages } from '../../contexts/imageContext/useImageContext'
import { ImageSquare } from 'phosphor-react'
import { Element } from 'slate'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import ImageSelector from '../editor/images/imageSelector'
import ImageUploadButton from '../editor/images/uploadButton'
import { Button } from '@meow/components/src/Button'
import { useFormItem, Label, Popover } from '@meow/components'
import { useCMS } from '../../contexts/cmsContext/useCMSContext'
import { useController, useFormContext } from 'react-hook-form'
import React from 'react'
import { cva } from 'class-variance-authority'
import { FakeP } from '@meow/components/src/Typography'

const StyledImageButton = cva(
  'w-full rounded-md border border-input transition-colors bg-background shadow-sm hover:bg-accent hover:text-accent-foreground my-1 cursor-pointer p-0 overflow-hidden relative',
  {
    variants: {
      selected: {
        true: 'outline outline-2 outline-offset-4 outline-primary/80',
      },
    },
  }
)

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
        <div className="relative mb-2">
          <div className="flex flex-col gap-2">
            {imageTitle !== false && (
              <div className="flex flex-col gap-1">
                <Label htmlFor={`image-title`}>Image title</Label>
                <Input
                  name="image-title"
                  defaultValue={imageTitle?.defaultValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    imageTitle?.onImageTitleChange(value)
                  }}
                />
              </div>
            )}
            {imageAltText !== false && (
              <div className="flex flex-col gap-1">
                <Label htmlFor={`image-alt`}>Image alt text</Label>
                <Input
                  name="image-alt"
                  defaultValue={imageAltText.defaultValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    imageAltText?.onImageAltTextChange(value)
                  }}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
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
                  <div className="relative flex-1 flex justify-end border-b border-border mb-2 pb-2">
                    <ImageUploadButton />
                  </div>
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
            </div>
          </div>
        </div>
      }
    >
      <button
        className={StyledImageButton({ selected })}
        contentEditable={false}
      >
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
          <div
            className="block max-w-full min-h-80 bg-cover bg-center"
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
          <div className="p-4">
            <div className="flex flex-row gap-2 items-center">
              <ImageSquare size={16} weight="bold" />
              <FakeP>Add an image</FakeP>
            </div>
          </div>
        )}
      </button>
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
