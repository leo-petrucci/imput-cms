import { isKeyHotkey } from 'is-hotkey'
import { Editor, Element, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

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

export const onKeyDownInlineFix = (
  editor: ReactEditor,
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  const { selection } = editor

  // Default left/right behavior is unit:'character'.
  // This fails to distinguish between two cursor positions, such as
  // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
  // Here we modify the behavior to unit:'offset'.
  // This lets the user step into and out of the inline without stepping over characters.
  // You may wish to customize this further to only use unit:'offset' in specific cases.
  if (selection && Range.isCollapsed(selection)) {
    const { nativeEvent } = event
    if (isKeyHotkey('left', nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset', reverse: true })
      return
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset' })
      return
    }
  }
}
