import React from 'react'

type Widgets =
  | {
      widget: 'boolean'
      default?: true | false
    }
  | {
      widget: 'select'
      options: (string | number)[]
      default?: string | number
    }
  | {
      widget: 'date'
      default?: string
    }
  | {
      widget: 'datetime'
      default?: string
    }
  | {
      widget: 'date'
      default?: string
    }
  | {
      widget: 'image'
      default?: string
      allow_multiple?: boolean
    }
  | {
      widget: 'json'
      default?: any
    }
  | {
      widget: 'string'
      default?: string
    }
  | { widget: 'markdown'; default?: string }

export type BlockType = {
  /**
   * The component's name as it would appear in-code (e.g. MyCustomButton)
   */
  name: string
  /**
   * A user-friendly name that will be displayed when selecting components
   */
  label: string
  /**
   * Prop input fields that will be displayed when editing the component
   */
  fields?: {
    /**
     * The prop's name
     */
    name: string
    /**
     * The descriptive label for the prop
     */
    label: string
    /**
     * What kind of input should be used for the prop
     */
    type: Widgets
  }[]
}

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
      name: 'github'
      /**
       * Your repo e.g. myname/reponame
       */
      repo: string
      /**
       * The main branch of your repo. Usually main or master.
       */
      branch: string
      /**
       * The base url of your production site.
       */
      base_url: string
      /**
       * The location of your login API route.
       */
      auth_endpoint: string
    }
    /**
     * Git directory where images are stored
     */
    media_folder: string
    /**
     * Public web directory where files are stored
     */
    public_folder: string
    /**
     * The shape of the contents of your website.
     * Each collection object is a different type of content:
     * - blogposts
     * - authors
     * - categories
     */
    collections: {
      /**
       * Used for routes, e.g. /admin/collections/blog
       */
      name: string
      /**
       * Used for the UI
       */
      label: string
      /**
       * Where the files are going to be created or loaded from
       */
      folder: string
      /**
       * Are users allowed to add new documents to this section
       */
      create: boolean
      /**
       * A slug-ified string which will become the filename of the resource created
       */
      slug: string
      /**
       * File that will be created when adding new content to this collection
       */
      extension: 'md' | 'mdx'
      /**
       * This will dictate the
       * inputs displayed when editing or creating content.
       */
      fields: ({
        /**
         * The name of each input
         */
        name: string
        /**
         * What will the input be labeled as in the Ui
         */
        label: string
      } & Widgets)[]
      /**
       * Components that will be made available to this type of content
       */
      blocks?: BlockType[]
    }[]
  }
}

const ctxt = React.createContext({} as NextCMSContext)

export default ctxt
