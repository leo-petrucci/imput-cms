import { isObject } from "lodash";
import { BaseEditor, Transforms } from "slate";
import { MdxElementShape } from "../mdxElement";

/**
 * Edits any string prop on an MDX slate element
 */
export const editAttributes = (
  /**
   * Id of the node we want to edit
   */
  id: string,
  /**
   * The entire deserialized MDX element
   */
  mdxElement: MdxElementShape,
  /**
   * The specific prop we're editing
   */
  attribute: MdxElementShape["attributes"][0],
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * The value we'll change this prop to
   */
  value: any
) => {
  // find the index of the attribute
  const index = mdxElement.attributes
    .map((m) => m.name)
    .indexOf(attribute.name);

  // copy the attributes array
  const newAttributes = [...mdxElement.attributes];

  // change just this value
  newAttributes[index] = {
    ...attribute,
    value: isObject(attribute.value)
      ? {
          ...attribute.value,
          value
        }
      : value
  };

  Transforms.setNodes<MdxElementShape>(
    editor,
    {
      attributes: newAttributes
    },
    {
      match: (node) => {
        // @ts-ignore
        return node.id === id;
      }
    }
  );
};
