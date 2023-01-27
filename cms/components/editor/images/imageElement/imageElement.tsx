import Box from 'cms/components/designSystem/box'
import Flex from 'cms/components/designSystem/flex'
import Input from 'cms/components/designSystem/input'
import Popover from 'cms/components/designSystem/popover'
import { useImages } from 'cms/contexts/imageContext/useImageContext'
import { ImageSquare } from 'phosphor-react'
import { Element, Transforms } from 'slate'
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react'
import { styled } from 'stitches.config'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import Label from 'cms/components/designSystem/label'
import ImageSelector from '../imageSelector'
import { Modal } from 'cms/components/designSystem/modal'
import ImageUploadButton from 'cms/components/editor/images/uploadButton'
import Button from 'cms/components/designSystem/button'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { toast } from 'react-hot-toast'
import ImagePicker from 'cms/components/designSystem/imagePicker'

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

const Image = ({
  attributes,
  children,
  element,
}: {
  attributes: any
  children: any
  element: ImageElement
}) => {
  const { images } = useImages()
  const { public_folder } = useCMS()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()

  return (
    <div {...attributes}>
      {children}
      <ImagePicker
        image={element.link}
        selected={selected}
        imageTitle={{
          defaultValue: element.title,
          onImageTitleChange: (value) => {
            Transforms.setNodes<any>(
              editor,
              {
                title: value,
              },
              {
                at: path,
              }
            )
          },
        }}
        imageAltText={{
          defaultValue: element.caption,
          onImageAltTextChange: (value) => {
            Transforms.setNodes<any>(
              editor,
              {
                caption: value,
              },
              {
                at: path,
              }
            )
          },
        }}
        onImageChange={(filename) => {
          Transforms.setNodes<any>(
            editor,
            {
              link: filename,
            },
            {
              at: path,
            }
          )
        }}
      />
    </div>
  )
}

export default Image
