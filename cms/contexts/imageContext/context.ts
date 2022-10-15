import { Endpoints } from "@octokit/types";
import React from "react";

export enum ImageState {
  Uploaded,
  New,
}

export interface LoadedImages {
  markdown: string;
  filename: string;
  state: ImageState.Uploaded | ImageState.New;
  alttext?: string;
  title?: string;
  blobUrl?: string;
  blob?: Blob;
}

export interface GithubImagesTreeContext {
  imageTree: Endpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];
  images: [
    LoadedImages[],
    React.Dispatch<React.SetStateAction<LoadedImages[]>>
  ];
  imagesRef: React.MutableRefObject<LoadedImages[]>;
}

const ctxt = React.createContext({} as GithubImagesTreeContext);

export default ctxt;
