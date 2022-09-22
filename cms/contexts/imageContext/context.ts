import { Endpoints } from "@octokit/types";
import React from "react";

export interface LoadedImages {
  markdown: string;
  filename: string;
  alttext?: string;
  title?: string;
  blob?: string;
}

export interface GithubImagesTreeContext {
  imageTree: Endpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];
  images: [
    LoadedImages[],
    React.Dispatch<React.SetStateAction<LoadedImages[]>>
  ];
}

const ctxt = React.createContext({} as GithubImagesTreeContext);

export default ctxt;
