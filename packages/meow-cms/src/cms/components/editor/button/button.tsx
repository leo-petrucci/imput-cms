import { Modal } from '@meow/components'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { BracketsSquare, Link, LinkBreak } from 'phosphor-react'
import React from 'react'
import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { insertLink, isLinkActive, unwrapLink } from './link'
import Toggle from '@meow/components/Toggle'

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

/**
 * Used to wrap an entire paragraph in a new block, like a code block or a list
 * @param format the type of block it'll be wrapped in (e.g. `code_block`)
 */
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

export const BlockButton = ({
  format,
  icon,
}: {
  format: string
  icon: React.ReactNode
}) => {
  const editor = useSlate()

  return (
    <Toggle
      pressed={isBlockActive(editor, format)}
      onPressedChange={() => {
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </Toggle>
  )
}

/**
 * Used to wrap a specific selection in a style, for example bold or italics
 * @param format the type of formatting to apply (e.g. bold)
 */
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
    <Toggle
      pressed={isMarkActive(editor, format)}
      onPressedChange={() => {
        toggleMark(editor, format)
      }}
    >
      {icon}
    </Toggle>
  )
}

/**
 * A button that wraps selected text into a link. If a link is selected, the link will be removed.
 */
export const LinkButton = () => {
  const editor = useSlate()

  return (
    <Toggle
      pressed={isLinkActive(editor)}
      onPressedChange={() => {
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
    </Toggle>
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
        className="min-w-screen min-h-screen md:min-w-[968px] md:min-h-[524px]"
        description={(_open, setOpen) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
            {components?.map((c) => (
              <button
                className="inline-flex p-4 items-start w-full rounded-md border border-input transition-colors bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer overflow-hidden relative"
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
              </button>
            ))}
          </div>
        )}
      >
        <Toggle pressed={false} onPressedChange={() => {}}>
          <BracketsSquare size={16} />
        </Toggle>
      </Modal>
    </>
  )
}
