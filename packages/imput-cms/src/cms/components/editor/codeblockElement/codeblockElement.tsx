import { Codeblock } from '@imput/components'
import { Transforms, Node, Descendant } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import React, { useEffect } from 'react'

interface CodeblockElement extends Pick<RenderElementProps, 'element'> {
  children: Descendant[]
  language: string
}

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

  const selected = useSelected()

  return (
    <div {...attributes} contentEditable={false}>
      <div>
        <Codeblock
          language={codeblockElement.language || 'plain'}
          // @ts-ignore
          defaultValue={codeblockElement.children.map((c) => c.text).join('')}
          onLanguageChange={(language) => {
            Transforms.setNodes<any>(
              editor,
              {
                language: language,
              },
              {
                at: path,
              }
            )
          }}
          onValueChange={(code) => {
            Transforms.insertText(editor, code, {
              at: path,
            })
          }}
        />
      </div>
      <div style={{ display: 'none' }}>{children}</div>
    </div>
  )
}

export default CodeblockElement
