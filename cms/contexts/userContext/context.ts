import React from "react";
import { Endpoints } from "octokit";

export interface UserContext extends Endpoints<"GET /user"> {}

const ctxt = React.createContext({} as UserContext);

export default ctxt;
