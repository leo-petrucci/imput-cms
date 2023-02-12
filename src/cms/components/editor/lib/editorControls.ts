import { BaseEditor, Location, Path, Transforms } from 'slate'

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
    { children: [{ text: '' }], type: 'paragraph' },
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
