import React, { useContext } from "react";
import ctxt, { NextCMSContext } from "./context";

export const useCMSContext = () => {
  const { settings } = useContext(ctxt);

  return settings;
};

const CMSContextProvider = ctxt.Provider;

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
