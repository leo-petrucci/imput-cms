import React from "react";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkSlate, { serialize as remarkSerialize } from "./remark-slate";
import { createEditor, Descendant } from "slate";
import { Element } from "./element";
import MoveElement from "./moveElement";
import { Leaf } from "./leaf";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { unified } from "unified";
import Toolbar from "./toolbar";
import { BlockButton, MarkButton } from "./button/button";
import {
  CodeSimple,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic
} from "phosphor-react";
import Box from "../designSystem/box";
import { addEmptySpace } from "./lib/addEmptySpace";
import { removeLastEmptySpace } from "./lib/removeLastEmptySpace";

export const deserialize = (src: string): Descendant[] => {
  const { result } = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSlate)
    .processSync(src);

  return result as Descendant[];
};

export const serialize = remarkSerialize;

const withEditableVoids = (editor: ReactEditor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    // @ts-ignore
    return element.type === "mdxJsxFlowElement" ? true : isVoid(element);
  };

  return editor;
};

const Editor = ({
  value,
  onChange
}: {
  value: Descendant[];
  onChange?: (value: Descendant[]) => void;
}) => {
  const renderElement = React.useCallback(
    (props) => (
      <Box
        css={{
          display: "flex",
          gap: "$2",
          "& > div": {
            flex: 1
          }
        }}
      >
        <MoveElement {...props} />
        <Element {...props} />
      </Box>
    ),
    []
  );
  const renderLeaf = React.useCallback((props) => <Leaf {...props} />, []);
  const [editor] = React.useState(() =>
    withEditableVoids(withReact(createEditor()))
  );

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(val) => {
          // this will add an empty value at the end to make sure there's always space
          // addEmptySpace(editor);

          // but we want to remove it when it's sent back
          onChange?.(removeLastEmptySpace(val));
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon={<TextBolder size={16} />} />
          <MarkButton format="italic" icon={<TextItalic size={16} />} />
          <MarkButton format="code" icon={<CodeSimple size={16} />} />
          <BlockButton format="heading_one" icon={<TextHOne size={16} />} />
          <BlockButton format="heading_two" icon={<TextHTwo size={16} />} />
          <BlockButton format="heading_three" icon={<TextHThree size={16} />} />
          <BlockButton format="block_quote" icon={<Quotes size={16} />} />
          <BlockButton format="ol_list" icon={<ListNumbers size={16} />} />
          <BlockButton format="ul_list" icon={<ListBullets size={16} />} />
        </Toolbar>
        <Box
          css={{
            border: "1px solid $gray-200",
            borderRadius: "$default",
            "& > div": {
              padding: "$2"
            }
          }}
        >
          <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        </Box>
      </Slate>
    </>
  );
};

export default Editor;
