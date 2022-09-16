import React, { useContext } from "react";
import Login from "../pages/login";
import ctxt, { NextCMSSettings } from "./context";

export const useCMSContext = () => {
  const settings = useContext(ctxt);

  return settings;
};

const CMSContextProvider = ctxt.Provider;

export const CMSProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: NextCMSSettings;
}): JSX.Element => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  return (
    <CMSContextProvider value={settings}>
      {loggedIn ? <>{children}</> : <Login />}
    </CMSContextProvider>
  );
};
