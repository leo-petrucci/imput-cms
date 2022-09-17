import React, { useContext } from "react";
import Login from "../../pages/login";
import { useGithubToken, useGithubUser } from "../../queries/auth";
import ctxt from "./context";

export const useUser = () => {
  const user = useContext(ctxt);

  return user;
};

const UserContextProvider = ctxt.Provider;

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const tokenQuery = useGithubToken();

  const { data, isSuccess } = useGithubUser(tokenQuery.data);

  return (
    <UserContextProvider value={data}>
      {isSuccess ? <>{children}</> : <Login />}
    </UserContextProvider>
  );
};
