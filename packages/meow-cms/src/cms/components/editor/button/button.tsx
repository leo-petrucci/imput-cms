import { blackA } from '@radix-ui/colors'
import { Box, Modal } from '@meow/components'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { BracketsSquare, Link, LinkBreak } from 'phosphor-react'
import React from 'react'
import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { styled } from '@meow/stitches'
import { insertLink, isLinkActive, unwrapLink } from './link'

const LIST_TYPES = ['ul_list', 'ol_list']

const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  )

  return !!match
}

const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  newProperties = {
    // @ts-ignore
    type: isActive ? 'paragraph' : isList ? 'list_item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor)
  // @ts-ignore
  return marks ? marks[format] === true : false
}

export const StyledButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  background: 'transparent',
  border: '0px solid transparent',
  padding: '$2',
  aspectRatio: '1/1',
  cursor: 'pointer',
  borderRadius: '$sm',
  '& > div': {
    display: 'flex',
  },
  '&:hover': {
    background: '$gray-100',
  },
  variants: {
    active: {
      true: {
        color: '$gray-900',
        background: '$gray-100',
      },
      false: {
        color: '$gray-500',
      },
    },
  },
})

export const BlockButton = ({
  format,
  icon,
}: {
  format: string
  icon: React.ReactNode
}) => {
  const editor = useSlate()
  return (
    <StyledButton
      type="button"
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </StyledButton>
  )
}

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const MarkButton = ({
  format,
  icon,
}: {
  format: string
  icon: React.ReactNode
}) => {
  const editor = useSlate()
  return (
    <StyledButton
      type="button"
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <div className="icon">{icon}</div>
    </StyledButton>
  )
}

const ComponentSelectorButton = styled('button', {
  borderRadius: '.25em',
  display: 'inline-flex',
  padding: '$4',
  alignItems: 'flex-start',
  color: blackA.blackA11,
  cursor: 'pointer',
  background: 'none',
  border: `1px solid ${blackA.blackA7}`,

  '&:hover': { backgroundColor: blackA.blackA2 },
})

/**
 * A button that wraps selected text into a link. If a link is selected, the link will be removed.
 */
export const LinkButton = () => {
  const editor = useSlate()
  return (
    <StyledButton
      type="button"
      active={isLinkActive(editor)}
      onMouseDown={(event) => {
        event.preventDefault()
        if (isLinkActive(editor)) {
          unwrapLink(editor)
        } else {
          const url = window.prompt('Enter the URL of the link:')
          if (!url) return
          insertLink(editor, url)
        }
      }}
    >
      {isLinkActive(editor) ? (
        <LinkBreak size={16} weight="bold" />
      ) : (
        <Link size={16} weight="bold" />
      )}
    </StyledButton>
  )
}

/**
 * Opens a component selection modal.
 */
export const ComponentButton = () => {
  const editor = useSlate()
  const { components, createComponent } = useCMS()

  return (
    <>
      <Modal
        title={'Select a block to add'}
        css={{
          minWidth: '100vw',
          minHeight: '100vh',
          '@md': {
            minWidth: 968,
            minHeight: 524,
          },
        }}
        description={(_open, setOpen) => (
          <Box
            css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              '@md': {
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {components?.map((c) => (
              <ComponentSelectorButton
                key={c.name}
                onClick={() => {
                  const component = createComponent(c.name)
                  if (component) {
                    Transforms.insertNodes(editor, component)
                    setOpen(false)
                  }
                }}
              >
                {c.label}
              </ComponentSelectorButton>
            ))}
          </Box>
        )}
      >
        <StyledButton
          type="button"
          active={false}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
        >
          <BracketsSquare size={16} />
        </StyledButton>
      </Modal>
    </>
  )
}
