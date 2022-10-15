import React, { useContext } from "react";
import matter from "gray-matter";
import { getGithubFileBase64, useGetGithubImages } from "../../queries/github";
import ctxt, { ImageState, LoadedImages } from "./context";
import { useCMS } from "../cmsContext/useCMSContext";
import { base64ToBlob } from "../../utils/base64ToBlob";
import type { Ctx, ThemeImageType } from "@milkdown/core";
import { commandsCtx } from "@milkdown/core";
import { InsertImage, ModifyImage } from "@milkdown/preset-commonmark";

const fileToBlob = async (file: File) =>
  new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

/**
 * Returns a page's images and methods related to those images.
 */
export const useImages = () => {
  const {
    imageTree,
    images: [images, setImages],
    imagesRef,
  } = useContext(ctxt);

  const { backend } = useCMS();
  const [owner, repo] = backend.repo.split("/");

  // const resetLoadedImages = () => setImages([]);

  /**
   * Extracts all image urls from markdown and converts them to useful objects containing blob urls, then sets them to state.
   *
   * Only use this on first load.
   */
  const loadImages = async (markdown: string) => {
    const { content } = matter(markdown);
    const exp = new RegExp(
      /!\[(?<alttext>.*?)]\((?<filename>.*?)(?=\"|\))(?<title>\".*\")?\)/g
    );
    // Contains all of the images from markdown
    // @ts-ignore
    const match = [...content.matchAll(exp)];

    const parsed = await Promise.all(
      match.map(async (m) => {
        /**
         * We find the images in this markdown file within the repo's image tree.
         * `imageTree` contains all the base64 files, so we just need to match filename to filename
         * then load the base64's to state.
         */
        const foundImage = imageTree.find((i) => m[0].includes(i.path));
        const blob =
          /**
           * TODO: handle remote images
           */
          foundImage
            ? await base64ToBlob(
                await getGithubFileBase64(owner, repo, foundImage.sha!)
              )
            : undefined;
        return {
          // the full markdown string before we separate it
          markdown: m[0] as string,
          // all these images were previously uploaded
          state: ImageState.Uploaded,
          // the file's url
          filename: m["groups"]["filename"] as string,
          // the image's seo title
          title: m["groups"]["title"] as string | undefined,
          // alt text associated with the image
          alttext: m["groups"]["alttext"] as string,
          // the blob url
          blobUrl: blob ? URL.createObjectURL(blob) : undefined,
          blob,
        };
      })
    );

    /**
     * Reset all currently loaded images, in case user changed content
     */
    // resetLoadedImages();

    /**
     * Set new images to state
     */
    setImages(parsed);
  };

  const { public_folder } = useCMS();

  /**
   * Add a new image to to the images state
   * @param ctx - milkdown's context
   * @param file - the file to add to the state
   */
  const addImage = async (ctx: Ctx, file: File) => {
    const blob = await fileToBlob(file);
    // this has to be encoded or markdown serialises the image weird
    const encodedFileName = encodeURIComponent(file.name);
    const image: LoadedImages = {
      markdown: encodedFileName,
      // this is to identify which images need to be uploaded once the page has been saved
      state: ImageState.New,
      filename: `/${public_folder}/${encodedFileName}`,
      blobUrl: URL.createObjectURL(blob),
      blob,
    };
    setImages([...images, image]);

    // this will insert the image in the editor
    const commandManager = ctx.get(commandsCtx);
    commandManager.call(InsertImage, image.filename);
  };

  /**
   * Remove image from images state. NOTE: Deleting an image does not remove it from the repo.
   * That should be done separately.
   * @param src - the public url of the picture e.g. /images/my-pic.png
   */
  // const removeImage = (src: string) => {
  //   console.log("remove image");
  //   console.log(images);
  //   const newImages = images.filter((image) => image.filename !== src);
  //   setImages(newImages);
  // };

  return { imageTree, images, loadImages, addImage };
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
  const imagesRef = React.useRef<LoadedImages[]>([]);
  const { isLoading, data } = useGetGithubImages();

  console.log(images[0]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <ImagesContextProvider
      value={{ imageTree: data!.data.tree, images, imagesRef }}
    >
      {children}
    </ImagesContextProvider>
  );
};
