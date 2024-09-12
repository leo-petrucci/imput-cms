import React from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

export type Widgets =
  | {
      widget: 'boolean'
      default?: true | false
      multiple?: boolean
    }
  | {
      widget: 'select'
      options: (string | number)[]
      multiple?: boolean
      default?: (string | number)[] | (string | number)
    }
  | {
      widget: 'relation'
      /**
       * name of the referenced collection
       */
      collection: string
      /**
       * name of the field from the referenced collection whose value will be stored for the relation. For nested fields, separate each subfield with a . (e.g. `name.first`).
       */
      value_field: string
      /**
       * list of one or more names of fields in the referenced collection that will render in the autocomplete menu of the control. Defaults to value_field. Syntax to reference nested fields is similar to that of `value_field`.
       */
      display_fields?: string

      multiple?: boolean
      default?: string | number | string[] | number
    }
  | {
      widget: 'date'
      multiple?: boolean
      default?: string
    }
  | {
      widget: 'datetime'
      multiple?: boolean
      default?: string
    }
  | {
      widget: 'textarea'
      multiple?: boolean
      default?: string
    }
  | {
      widget: 'image'
      default?: string
      multiple?: boolean
      allow_multiple?: boolean
    }
  | {
      widget: 'json'
      default?: any
    }
  | {
      widget: 'object'
      default?: any
      multiple?: boolean
    }
  | {
      widget: 'string'
      multiple?: boolean
      default?: string | string[]
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

export type FieldType = {
  /**
   * The name of each input
   */
  name: string
  /**
   * What will the input be labeled as in the Ui
   */
  label: string
  rules?: RegisterOptions<FieldValues, string>
  /**
   * Whether the input should be hidden in the interface
   */
  hidden?: boolean
} & Extract<
  Widgets,
  {
    widget:
      | 'string'
      | 'date'
      | 'datetime'
      | 'select'
      | 'image'
      | 'boolean'
      | 'markdown'
      | 'relation'
      | 'textarea'
  }
>

// Define a type for a React functional component
type ReactComponent<P = {}> = React.FunctionComponent<P>

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
       * Default sorting for posts
       */
      orderBy?: {
        /**
         * The `name` of a field
         */
        value: string
        /**
         * Either `asc` or `desc`
         */
        direction: 'asc' | 'desc'
      }
      /**
       * A slug-ified string which will become the filename of the resource created
       */
      slug: string
      /**
       * File that will be created when adding new content to this collection
       */
      extension: 'md' | 'mdx' | 'json'
      /**
       * This will dictate the
       * inputs displayed when editing or creating content.
       */
      fields: FieldType[]
      /**
       * Components that will be made available to this type of content
       */
      blocks?: BlockType[]
      /**
       * Handles the preview
       */
      preview?: {
        /**
         * An array of public css files that will be added to your preview
         */
        styles?: string[]
        /**
         * Components to render within the mdx preview
         */
        components?: {
          [key: string]:
            | ReactComponent<any>
            // this makes it so types are valid if we use next/dynamic
            | React.ComponentType<any>
        }
        /**
         * An element that wraps the preview
         */
        wrapper?: (props: { children: React.ReactNode }) => JSX.Element
        /**
         * An element that renders before your preview
         * receives your frontmatter object
         */
        header?: (props: { [k: string]: string }) => JSX.Element
        /**
         * An element that renders after your preview
         * receives your frontmatter object
         */
        footer?: (props: { [k: string]: string }) => JSX.Element
      }
    }[]
  }
}

const ctxt = React.createContext({} as NextCMSContext)

export default ctxt
