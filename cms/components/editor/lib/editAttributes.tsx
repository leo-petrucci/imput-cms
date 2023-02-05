import { BaseEditor, Path, Transforms } from 'slate'
import { MdxElementShape } from 'cms/components/editor/mdxElement'

/**
 * Edits any string prop on an MDX slate element
 */
export const editAttributes = (
  /**
   * Id of the node we want to edit
   */
  path: Path,
  /**
   * The entire deserialized MDX element
   */
  mdxElement: MdxElementShape,
  /**
   * The specific prop we're editing
   */
  attribute: MdxElementShape['attributes'][0],
  /**
   * The slate editor instance
   */
  editor: BaseEditor
) => {
  // find the index of the attribute
  const index = mdxElement.attributes.map((m) => m.name).indexOf(attribute.name)

  // copy the attributes array
  const newAttributes = [...mdxElement.attributes]

  // change just this value
  newAttributes[index] = {
    ...attribute,
  }

  Transforms.setNodes<MdxElementShape>(
    editor,
    {
      attributes: newAttributes,
    },
    {
      at: path,
    }
  )
}
