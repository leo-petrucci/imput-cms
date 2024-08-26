import { Editor, Element } from 'slate'

export const getCurrentNodeType = (editor: Editor) => {
  const [highestNode] =
    Editor.above(editor, {
      match: (n) => Element.isElement(n) && !Editor.isEditor(n),
      mode: 'highest',
    }) || []

  if (highestNode && Element.isElement(highestNode)) {
    // @ts-expect-error
    return highestNode.type
  }

  return null
}
