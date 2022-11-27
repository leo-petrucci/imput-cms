import Box from 'cms/components/designSystem/box'
import Flex from 'cms/components/designSystem/flex'
import Input from 'cms/components/designSystem/input'
import Popover from 'cms/components/designSystem/popover'
import { useImages } from 'cms/contexts/imageContext/useImageContext'
import { ImageSquare } from 'phosphor-react'
import { Element, Transforms } from 'slate'
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { styled } from 'stitches.config'

const StyledImage = styled('div', {
  display: 'blog',
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
  marginBottom: '$2',
  cursor: 'pointer',
  padding: 0,
  overflow: 'hidden',
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
  const { images, imageTree, addImage } = useImages()
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes}>
      {children}
      <Popover
        content={
          <Box
            contentEditable={false}
            css={{
              position: 'relative',
              marginBottom: '$2',
            }}
          >
            <Flex direction="column" gap="2">
              <Input
                name="image-title"
                label="Image title"
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
              <Input
                name="image-alt"
                label="Image alt text"
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
              <Input
                type="file"
                name="image-file"
                label="Upload image"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files?.length > 0) {
                    const file = e.target.files[0]
                    const image = await addImage(file)
                    console.log({ image })
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
                }}
              />
            </Flex>
          </Box>
        }
      >
        <StyledImageButton>
          {element.link ? (
            <StyledImage
              style={{
                backgroundImage: `url(${
                  images.find((i) => i.filename === element.link)?.blobUrl
                })`,
              }}
            />
          ) : (
            <Box
              css={{
                padding: '$4 $2',
              }}
            >
              <Flex direction="row" gap="2" align="center">
                <ImageSquare size={16} weight="bold" />
                <Box
                  css={{
                    color: '$gray-800',
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
