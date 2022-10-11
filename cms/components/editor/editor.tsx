import matter from "gray-matter";
import React from "react";
import { styled } from "@stitches/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { redo, undo } from "@milkdown/prose/history";
import { history } from "@milkdown/plugin-history";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { menu, menuPlugin } from "./menu/index";
import { commonmark, image } from "@milkdown/preset-commonmark";
import { useImages } from "../../contexts/imageContext/useImageContext";
import Head from "next/head";

const ImageContainer = styled("span", {
  "& > img": {
    width: "100%",
  },
});

const CustomImage: React.FC = () => {
  const { node } = useNodeCtx();

  const { images } = useImages();

  const loadedImage = images.find((i) => i.filename === node.attrs.src);
  const src = loadedImage ? loadedImage.blob : "";

  return (
    <ImageContainer>
      <img src={src} alt={node.attrs.alt} title={node.attrs.title} />
    </ImageContainer>
  );
};

export interface EditorProps {
  frontMatter: string;
}

const EditorComponent = ({ frontMatter }: EditorProps) => {
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
        ctx.set(rootCtx, root);
        const { content } = matter(frontMatter);
        ctx.set(defaultValueCtx, content);
      })
      .use(nord)
      .use(history)
      .use(menu)
      .use(nodes);
  });

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/phosphor-icons"></script>
      </Head>
      <div style={{ maxWidth: "50vw" }}>
        <ReactEditor editor={editor} />
      </div>
    </>
  );
};

export default EditorComponent;
