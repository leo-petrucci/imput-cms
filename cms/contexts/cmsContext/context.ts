import React from "react";

type Widgets =
  | {
      widget: "boolean";
      default?: true | false;
    }
  | {
      widget: "date";
      default?: string;
    }
  | {
      widget: "datetime";
      default?: string;
    }
  | {
      widget: "date";
      default?: string;
    }
  | {
      widget: "image";
      default?: string;
      allow_multiple?: boolean;
    }
  | {
      widget: "string";
      default?: string;
    }
  | { widget: "markdown"; default?: string };

export interface NextCMSContext {
  settings: {
    /**
     * The type of backend for authentication and git
     *
     * This is really barebones at the moment.
     */
    backend: {
      /**
       * Your git provider
       */
      name: "github";
      /**
       * Your repo e.g. myname/reponame
       */
      repo: string;
      /**
       * The main branch of your repo. Usually main or master.
       */
      branch: string;
      /**
       * The base url of your production site.
       */
      base_url: string;
      /**
       * The location of your login API route.
       */
      auth_endpoint: string;
    };
    /**
     * The shape of the contents of your website.
     * Each collection object is a different type of content:
     * - blobposts
     * - authors
     * - categories
     */
    collections: {
      /**
       * Used for routes, e.g. /admin/collections/blog
       */
      name: string;
      /**
       * Used for the UI
       */
      label: string;
      /**
       * Where the files are going to be created or loaded from
       */
      folder: string;
      /**
       * Are users allowed to add new documents to this section
       */
      create: boolean;
      /**
       * A slug-ified string which will become the filename of the resource created
       */
      slug: string;
      /**
       * This will dictate the
       * inputs displayed when editing or creating content.
       */
      fields: ({
        /**
         * The name of each input
         */
        name: string;
        /**
         * What will the input be labeled as in the Ui
         */
        label: string;
      } & Widgets)[];
    }[];
  };
}

const ctxt = React.createContext({} as NextCMSContext);

export default ctxt;
