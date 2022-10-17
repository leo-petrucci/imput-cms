import React, { useContext } from "react";
import ctxt, { NextCMSContext } from "./context";

/**
 * Returns the CMS settings object
 */
export const useCMS = () => {
  const { settings } = useContext(ctxt);

  return settings;
};

const CMSContextProvider = ctxt.Provider;

/**
 * Context containing all user-set settings for the CMs
 */
export const CMSProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: NextCMSContext["settings"];
}): JSX.Element => {
  return (
    <CMSContextProvider value={{ settings }}>{children}</CMSContextProvider>
  );
};
