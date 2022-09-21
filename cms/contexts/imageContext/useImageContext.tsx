import React, { useContext } from "react";
import { useGetGithubImages } from "../../queries/github";
import ctxt from "./context";

/**
 * Returns the CMS settings object
 */
export const useImages = () => {
  const { imageTree } = useContext(ctxt);

  return imageTree;
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
  const { isLoading, data } = useGetGithubImages();

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <ImagesContextProvider value={{ imageTree: data!.data.tree }}>
      {children}
    </ImagesContextProvider>
  );
};
