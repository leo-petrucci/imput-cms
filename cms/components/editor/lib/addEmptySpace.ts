import { BaseEditor, Transforms } from "slate";

/**
 * Add an empty space at the end of the editor
 */
export const addEmptySpace = (
  /**
   * The slate editor instance
   */
  editor: BaseEditor
) => {
  const editorLength = editor.children.length;
  if (
    editorLength > 0 &&
    // @ts-ignore
    editor.children[editorLength - 1].type !== "paragraph"
  ) {
    Transforms.insertNodes(
      editor,
      // @ts-ignore
      { children: [{ text: "" }], type: "paragraph" },
      { at: [editor.children.length] }
    );
  }
};
