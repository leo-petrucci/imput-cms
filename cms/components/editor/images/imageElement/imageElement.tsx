import { useImages } from 'cms/contexts/imageContext/useImageContext'
import { Element, Transforms } from 'slate'
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react'
import { styled } from 'stitches.config'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import ImagePicker from 'cms/components/designSystem/imagePicker'

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
