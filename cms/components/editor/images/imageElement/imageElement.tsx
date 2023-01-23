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
  const { images, addImage, updateImage } = useImages()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()

  return (
    <div {...attributes}>
      {children}
      <Popover
        content={
          <Box
            css={{
              position: 'relative',
              marginBottom: '$2',
            }}
          >
            <Flex direction="column" gap="2">
              <Flex direction="column" gap="1">
                <Label htmlFor={`image-title`}>Image title</Label>
                <Input
                  name="image-title"
                  defaultValue={element.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    Transforms.setNodes<any>(
                      editor,
                      {
                        title: value,
                      },
                      {
                        at: path,
                      }
                    )
                  }}
                />
              </Flex>
              <Flex direction="column" gap="1">
                <Label htmlFor={`image-alt`}>Image alt text</Label>
                <Input
                  name="image-alt"
                  defaultValue={element.caption}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    Transforms.setNodes<any>(
                      editor,
                      {
                        caption: value,
                      },
                      {
                        at: path,
                      }
                    )
                  }}
                />
              </Flex>
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
                  description={(_open, setOpen) => (
                    <ImageSelector
                      onImageSelect={(filename) => {
                        setOpen(false)
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
                  )}
                >
                  <button type="button">Select image</button>
                </Modal>
                {/* <Input
                  type="file"
                  name="image-file"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files?.length > 0) {
                      // if an image already exist we remove it before adding a new one
                      if (element.link) {
                        const file = e.target.files[0]
                        const image = await updateImage(element.link, file)
                        Transforms.setNodes<any>(
                          editor,
                          {
                            link: image.filename,
                          },
                          {
                            at: path,
                          }
                        )
                      } else {
                        const file = e.target.files[0]
                        const image = await addImage(file)
                        Transforms.setNodes<any>(
                          editor,
                          {
                            link: image.filename,
                          },
                          {
                            at: path,
                          }
                        )
                      }
                    }
                  }}
                /> */}
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
              height: !element.link ? '2em' : '6em',
              width: !element.link ? '2em' : '6em',
              background: 'transparent',
              zIndex: 1000,
              transform: 'translate(-50%, -50%)',
            }}
          />
          {element.link ? (
            <StyledImage
              style={{
                backgroundImage: `url(${
                  element.link
                    ? images.find((i) => i.filename.includes(element.link!))
                        ?.blobUrl
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
    </div>
  )
}

export default Image
