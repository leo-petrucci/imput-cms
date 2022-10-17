import matter from "gray-matter";
import React from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { menu } from "./menu/index";
import { commonmark, image } from "@milkdown/preset-commonmark";
import { useImages } from "../../contexts/imageContext/useImageContext";
import CustomImage from "./image/customImage";
import Head from "next/head";
import { EditorProvider } from "cms/contexts/editorContext/useEditor";
import { useController, useFormContext } from "react-hook-form";
import { useFormItem } from "../forms/form/form";

export interface EditorProps {
  frontMatter: string;
}

const EditorComponent = ({ frontMatter }: EditorProps) => {
  /**
   * Editor will be a complex form item, it'll save its markdown whenever it's updated to `react-hook-form`
   */
  const { control } = useFormContext();
  const { name, rules } = useFormItem();
  const c = useController({
    name,
    rules,
    control,
    // make sure the default value is set to the initial markdown
    defaultValue: matter(frontMatter).content,
  });

  const { loadImages } = useImages();

  React.useEffect(() => {
    loadImages(frontMatter);
  }, [frontMatter]);

  const { editor } = useEditor((root, renderReact) => {
    const nodes = commonmark.configure(image, {
      view: renderReact(CustomImage),
    });
    return Editor.make()
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_ctx, m, _prevMarkdown) => {
          // set the markdown value to form state on every edit
          c.field.onChange(m);
        });
        ctx.set(rootCtx, root);
        const { content } = matter(frontMatter);
        ctx.set(defaultValueCtx, content);
      })
      .use(history)
      .use(listener)
      .use(menu)
      .use(nodes);
  });

  return (
    <>
      <Head>
        <script src="https://unpkg.com/phosphor-icons"></script>
      </Head>
      <EditorProvider editor={editor}>
        <div style={{ maxWidth: "50vw" }}>
          <ReactEditor editor={editor} />
        </div>
      </EditorProvider>
    </>
  );
};

export default EditorComponent;
