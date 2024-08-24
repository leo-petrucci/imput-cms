import {
  BaseEditor,
  Editor,
  Location,
  Path,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { v4 as uuidv4 } from 'uuid'

/**
 * Used to wrap a specific selection in a style, for example bold or italics
 * @param format the type of formatting to apply (e.g. bold)
 */
export const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor)
  // @ts-ignore
  return marks ? marks[format] === true : false
}

const LIST_TYPES = ['ul_list', 'ol_list']

/**
 * Used to wrap an entire paragraph in a new block, like a code block or a list
 * @param format the type of block it'll be wrapped in (e.g. `code_block`)
 */
export const toggleBlock = (editor: BaseEditor, format: string) => {
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

export const isBlockActive = (
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
 * Add an empty paragraph at specified location
 */
export const addEmptySpace = (
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * Where the new paragraph should be added
   */
  where: Path
) => {
  Transforms.insertNodes(
    editor,
    // @ts-ignore
    { id: uuidv4(), children: [{ text: '' }], type: 'paragraph' },
    { at: where, select: true }
  )
}

/**
 * Remove an element at specified location
 * @param editor the slate editor instance
 * @param where where the element should be removed
 */
export const removeElement = (
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * Where the element should be removed
   */
  where: Location
) => {
  Transforms.removeNodes(editor, { at: where })
}
