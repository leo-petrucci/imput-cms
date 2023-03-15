import { BaseEditor, Descendant, Transforms } from "slate";

/**
 * Given an array of Slate elements, it will remove the last value if it's an empty paragraph
 */
export const removeLastEmptySpace = (
  /**
   * An array of slate elements
   */
  elements: Descendant[]
) => {
  const editorLength = elements.length;
  const e = [...elements];
  if (
    editorLength > 0 &&
    // @ts-ignore
    elements[editorLength - 1].type === "paragraph" &&
    // @ts-ignore
    elements[editorLength - 1].children.length === 1 &&
    // @ts-ignore
    elements[editorLength - 1].children[0].text === ""
  ) {
    e.pop();
  }
  return e;
};
