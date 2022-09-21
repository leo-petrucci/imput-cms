import { Endpoints } from "@octokit/types";
import React from "react";

export interface GithubImagesTreeContext {
  imageTree: Endpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];
}

const ctxt = React.createContext({} as GithubImagesTreeContext);

export default ctxt;
