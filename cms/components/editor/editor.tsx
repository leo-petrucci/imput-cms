import matter from "gray-matter";
import React from "react";
import { styled } from '@stitches/react';
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { commonmark, image } from "@milkdown/preset-commonmark";
import { useImages } from "../../contexts/imageContext/useImageContext";

const ImageContainer = styled('span', {
  '& > img' : {
    width: "100%"
  }
})

const CustomImage: React.FC = () => {
  const { node } = useNodeCtx();

  const { images } = useImages();

  const loadedImage = images.find((i) => i.filename === node.attrs.src);
  const src = loadedImage ? loadedImage.blob : "";

  return <ImageContainer><img src={src} alt={node.attrs.alt} title={node.attrs.title} /></ImageContainer>;
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
      .use(nodes);
  });

  return (
    <div style={{ maxWidth: "50vw" }}>
      <ReactEditor editor={editor} />
    </div>
  );
};

export default EditorComponent;
