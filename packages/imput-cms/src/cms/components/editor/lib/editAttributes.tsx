import { BaseEditor, Path, Transforms } from 'slate'
import { MdxElementShape } from '../../../../cms/components/editor/mdxElement'

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
  let index = mdxElement.attributes.map((m) => m.name).indexOf(attribute.name)

  // copy the attributes array
  let newAttributes = [...mdxElement.attributes]

  // if the user has changed their schema since the last time this component was written
  // then the attribute won't exist and index will be -1
  // in that case we want to add the new attribute outright
  if (index >= 0) {
    // change just this value
    newAttributes[index] = {
      ...attribute,
    }
  } else {
    // push it to the end of the array
    newAttributes = [...newAttributes, attribute]
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
