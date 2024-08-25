import { Codeblock } from '@imput/components'
import { Transforms, Node, Descendant } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import React, { useEffect } from 'react'
import { defaultNodeTypes } from '../remark-slate'

interface CodeblockElement extends Pick<RenderElementProps, 'element'> {
  children: Descendant[]
  language: string
}

/**
 * A custom editable codeblock element.
 */
const CodeblockElement = ({
  attributes,
  children,
  element,
}: {
  attributes: any
  children: any
  element: any
}) => {
  const editor = useSlateStatic() as ReactEditor
  const path = ReactEditor.findPath(editor, element)

  const codeblockElement = element as unknown as CodeblockElement

  /**
   * We default language to `plain` by default. This is to counteract an issue with the editor's
   * mdx parser. If a codeblock doesn't have a language and the user types something like `{text}`
   * it will cause the parser to crash with [this error](https://mdxjs.com/docs/troubleshooting-mdx/#could-not-parse-expression-with-acorn-unexpected-content-after-expression)
   *
   * Specifying any language stops the bug.
   */
  useEffect(() => {
    if (!codeblockElement.language) {
      Transforms.setNodes<any>(
        editor,
        {
          language: 'plain',
        },
        {
          at: path,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (element.type === defaultNodeTypes.code_block) {
    const setLanguage = (language: string) => {
      const path = ReactEditor.findPath(editor, element)
      Transforms.setNodes<any>(editor, { language }, { at: path })
    }

    return (
      <div
        {...attributes}
        style={{ position: 'relative' }}
        className="imp-flex imp-flex-col imp-gap-2 imp-bg-primary-foreground imp-mb-4 imp-overflow-x-auto imp-rounded-xl imp-subpixel-antialiased imp-text-[.9em] contrast-more:imp-border contrast-more:imp-border-border contrast-more:imp-contrast-150 imp-p-2"
        spellCheck={false}
      >
        <LanguageSelect
          value={element.language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <code className="imp-break-words imp-text-[.9em]">{children}</code>
      </div>
    )
  }

  if (element.type === defaultNodeTypes.code_line) {
    return (
      <div {...attributes} style={{ position: 'relative' }}>
        {children}
      </div>
    )
  }

  const Tag = editor.isInline(element) ? 'span' : 'div'
  return (
    <Tag {...attributes} style={{ position: 'relative' }}>
      {children}
    </Tag>
  )
}

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select
      data-test-id="language-select"
      className="imp-self-end"
      contentEditable={false}
      {...props}
    >
      <option value="plain">Text</option>
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  )
}

export default CodeblockElement
