import { Link, LinkBreak } from 'phosphor-react'
import React from 'react'
import {
  BaseEditor,
  Editor,
  Range,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { isLinkActive } from './link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@imput/components/Tooltip'
import Toggle from '@imput/components/Toggle'
import { CodeSimple } from '@imput/components/Icon'
import {
  addLinkLeaf,
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
  description,
  shortcut,
}: {
  format: string
  icon: React.ReactNode
  description?: string
  shortcut?: string
}) => {
  const editor = useSlate()

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Toggle
            pressed={isMarkActive(editor, format)}
            onPressedChange={() => {
              toggleMark(editor, format)
            }}
          >
            {icon}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <div className="imp-flex imp-flex-col">
            <div className="imp-font-medium">{description}</div>
            <div className="imp-text-primary-foreground/50">⌘ + b</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * A button that wraps selected text into a link. If a link is selected, the link will be removed.
 */
export const LinkButton = () => {
  const editor = useSlate() as ReactEditor

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Toggle
            pressed={isLinkActive(editor)}
            onPressedChange={() => addLinkLeaf(editor)}
          >
            {isLinkActive(editor) ? (
              <LinkBreak size={16} weight="bold" />
            ) : (
              <Link size={16} weight="bold" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <div className="imp-flex imp-flex-col">
            <div className="imp-font-medium">Link</div>
            <div className="imp-text-primary-foreground/50">⌘ + k</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <div className="imp-flex imp-flex-col">
            <div className="imp-font-medium">Code</div>
            <div className="imp-text-primary-foreground/50">⌘ + e</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
