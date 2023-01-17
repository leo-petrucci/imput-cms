import { BaseEditor, Location, Transforms } from 'slate'

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
  where: Location
) => {
  Transforms.insertNodes(
    editor,
    // @ts-ignore
    { children: [{ text: '' }], type: 'paragraph' },
    { at: where }
  )
}
