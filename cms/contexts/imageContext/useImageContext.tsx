import React, { useContext } from "react";
import matter from "gray-matter";
import { getGithubFileBase64, useGetGithubImages } from "../../queries/github";
import ctxt, { LoadedImages } from "./context";
import { useCMS } from "../cmsContext/useCMSContext";
import { base64ToBlob } from "../../utils/base64ToBlob";

/**
 * Returns a page's images and methods related to those images.
 */
export const useImages = (markdown: string) => {
  const {
    imageTree,
    images: [images, setImages],
  } = useContext(ctxt);

  const { backend } = useCMS();
  const [owner, repo] = backend.repo.split("/");

  React.useEffect(() => {
    loadImages();
  }, [markdown]);

  /**
   * Extracts all image urls from markdown and converts them to useful objects containing blob urls, then sets them to state.
   */
  const loadImages = async () => {
    const { content } = matter(markdown);
    const exp = new RegExp(
      /!\[(?<alttext>.*?)]\((?<filename>.*?)(?=\"|\))(?<title>\".*\")?\)/g
    );
    // @ts-ignore
    const match = [...content.matchAll(exp)];

    const parsed = await Promise.all(
      match.map(async (m) => {
        const foundImage = imageTree.find((i) => m[0].includes(i.path));
        return {
          // the full markdown string before we separate it
          markdown: m[0] as string,
          // the file's url
          filename: m["groups"]["filename"] as string,
          // the image's seo title
          title: m["groups"]["title"] as string | undefined,
          // alt text associated with the image
          alttext: m["groups"]["alttext"] as string,
          // the blob url
          blob: foundImage
            ? URL.createObjectURL(
                /**
                 * TODO: handle remote images
                 */
                await base64ToBlob(
                  await getGithubFileBase64(owner, repo, foundImage.sha!)
                )
              )
            : undefined,
        };
      })
    );

    setImages(parsed);
  };

  return { imageTree, images };
};

const ImagesContextProvider = ctxt.Provider;

/**
 * Context containing all images in uploads folder
 */
export const ImagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const images = React.useState<LoadedImages[]>([]);
  const { isLoading, data } = useGetGithubImages();

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <ImagesContextProvider value={{ imageTree: data!.data.tree, images }}>
      {children}
    </ImagesContextProvider>
  );
};
