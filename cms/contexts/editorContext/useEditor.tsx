import { EditorInfo } from "@milkdown/react";
import React, { useContext } from "react";
import ctxt from "./context";

/**
 * Returns the CMS settings object
 */
export const useEditor = () => {
  const { editor } = useContext(ctxt);

  return editor;
};

const EditorContextProvider = ctxt.Provider;

/**
 * Context containing all user-set settings for the CMs
 */
export const EditorProvider = ({
  children,
  editor,
}: {
  children: React.ReactNode;
  editor: EditorInfo;
}): JSX.Element => {
  return (
    <EditorContextProvider value={editor}>{children}</EditorContextProvider>
  );
};
