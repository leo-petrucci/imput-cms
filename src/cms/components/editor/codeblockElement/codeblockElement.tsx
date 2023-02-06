import Codeblock from 'cms/components/designSystem/codeblock'
import { Transforms, Node, Descendant } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from 'slate-react'

interface CodeblockElement extends Pick<RenderElementProps, 'element'> {
  children: Descendant[]
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

  const selected = useSelected()

  return (
    <div {...attributes} contentEditable={false}>
      <div>
        <Codeblock
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
