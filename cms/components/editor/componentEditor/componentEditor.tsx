import { isString } from "lodash";
import { useSlate } from "slate-react";
import CodeBlockEditor from "../codeblockEditor";
import Editor from "../editor";
import { CustomRenderElementProps } from "../element";
import { editAttributes } from "../lib/editAttributes";
import { editReactChildren } from "../lib/editReactChildren";
import { MdxElementShape } from "../mdxElement";
import Label from "../../designSystem/label";
import Flex from "../../designSystem/flex";

/**
 *
 */
const ComponentEditor = (props: CustomRenderElementProps) => {
  const { attributes, children, element } = props;
  const editor = useSlate();
  const mdxElement = element as MdxElementShape;
  const { id } = mdxElement;
  return (
    <>
      {mdxElement.attributes.map((a) => {
        /**
         * If the prop is a string it's easy
         */
        if (isString(a.value)) {
          return (
            <Flex direction="column">
              <Label htmlFor={`string-prop-${a.name}`}>{a.name}</Label>
              <input
                type="text"
                id={`string-prop-${a.name}`}
                defaultValue={a.value}
                onChange={(e) => {
                  editAttributes(id, mdxElement, a, editor, e.target.value);
                }}
              />
            </Flex>
          );
          /**
           * If it's not a string we'll have to figure out what it is exactly
           */
        } else {
          return <CodeBlockEditor {...props} value={a} editor={editor} />;
        }
      })}
      <Flex direction="column">
        <Label htmlFor={`component-children`}>Children</Label>
        <Editor
          value={mdxElement.reactChildren}
          onChange={(val) => editReactChildren(id, mdxElement, editor, val)}
        />
      </Flex>
    </>
  );
};

export default ComponentEditor;
