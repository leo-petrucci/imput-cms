import { Transforms, Descendant } from 'slate'
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react'
import { useEffect } from 'react'
import { defaultNodeTypes } from '../../remark-slate'
import { Input } from '@imput/components/Input'

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
    return (
      <div
        style={{ position: 'relative' }}
        className="imp-flex imp-flex-col imp-gap-2 imp-bg-primary-foreground imp-mb-4 imp-overflow-x-auto imp-rounded-xl imp-subpixel-antialiased imp-text-[.9em] contrast-more:imp-border contrast-more:imp-border-border contrast-more:imp-contrast-150 imp-p-2"
      >
        <div contentEditable={false}>
          <Input
            defaultValue={codeblockElement.language}
            placeholder="Language of the code block"
            onChange={(e) => {
              Transforms.setNodes<any>(
                editor,
                {
                  language: e.target.value,
                },
                {
                  at: path,
                }
              )
            }}
          />
        </div>
        <div {...attributes} spellCheck={false}>
          <code className="imp-break-words imp-text-[.9em]">{children}</code>
        </div>
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

export default CodeblockElement
