import matter from "gray-matter";
import React from "react";
import { useImages } from "../../contexts/imageContext/useImageContext";

export interface EditorProps {
  frontMatter: string;
}

const Editor = ({ frontMatter }: EditorProps) => {
  const { images } = useImages(frontMatter);

  console.log(images);

  return <></>;
};

export default Editor;
