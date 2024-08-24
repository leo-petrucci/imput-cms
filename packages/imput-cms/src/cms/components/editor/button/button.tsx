import { Modal } from '@imput/components'
import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { BracketsSquare, Link, LinkBreak } from 'phosphor-react'
import React from 'react'
import {
  BaseEditor,
  Editor,
  Element,
  Range,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { insertLink, isLinkActive, unwrapLink } from './link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@imput/components/Tooltip'
import Toggle from '@imput/components/Toggle'
import { CodeSimple } from '@imput/components/Icon'
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from '../utils/marksAndBlocks'

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
 * A button that wraps selected text into an inline code_snippet
 */
export const CodeSnippetButton = () => {
  const editor = useSlate()

  const isCodeSnippetActive = (editor: BaseEditor) => {
    const [button] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-expect-error
        n.type === 'code_snippet',
    })
    return !!button
  }

  const unwrapCodeSnippet = (editor: BaseEditor) => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-expect-error
        n.type === 'code_snippet',
    })
  }

  const wrapCodeSnippet = (editor: BaseEditor) => {
    if (isCodeSnippetActive(editor)) {
      unwrapCodeSnippet(editor)
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const button = {
      type: 'code_snippet',
      children: isCollapsed ? [{ text: 'Edit me!' }] : [],
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, button)
    } else {
      Transforms.wrapNodes(editor, button, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }
  }

  return (
    <Toggle
      pressed={isCodeSnippetActive(editor)}
      onPressedChange={() => {
        if (isCodeSnippetActive(editor)) {
          unwrapCodeSnippet(editor)
        } else {
          wrapCodeSnippet(editor)
        }
      }}
    >
      <CodeSimple size={16} />
    </Toggle>
  )
}

/**
 * Opens a component selection modal.
 */
export const ComponentButton = ({ element }: { element: Element }) => {
  const editor = useSlate() as ReactEditor
  const { components, createComponent } = useCMS()
  const path = ReactEditor.findPath(editor, element)

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <Modal
            title={'Select a block to add'}
            className="imp-min-w-screen imp-min-h-screen md:imp-min-w-[968px] md:imp-min-h-[524px]"
            description={(_open, setOpen) => (
              <div className="imp-grid imp-grid-cols-1 md:imp-grid-cols-3 imp-gap-2 imp-p-4">
                {components?.map((c) => (
                  <button
                    className="imp-inline-flex imp-p-4 imp-items-start imp-w-full imp-rounded-md imp-border imp-border-input imp-transition-colors imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground imp-cursor-pointer imp-overflow-hidden imp-relative"
                    key={c.name}
                    onClick={() => {
                      const component = createComponent(c.name)
                      if (component) {
                        Transforms.insertNodes(editor, component, {
                          at: [path[0] + 1],
                          select: true,
                        })
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
            <TooltipTrigger asChild>
              <Toggle pressed={false} onPressedChange={() => {}}>
                <BracketsSquare size={16} />
              </Toggle>
            </TooltipTrigger>
          </Modal>
          <TooltipContent className="imp-max-w-sm">
            Component Block
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
