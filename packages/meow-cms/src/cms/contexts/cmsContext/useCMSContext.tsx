import { MDXNode } from '../../../cms/types/mdxNode'
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import ctxt, { BlockType, NextCMSContext } from './context'
import { generateComponentProp } from '../../components/editor/lib/generateComponentProp'

/**
 * Returns the CMS settings object
 */
export const useCMS = () => {
  const { settings } = useContext(ctxt)

  const params = useParams<{
    collection: string | undefined
    file: string | undefined
  }>()

  const currentCollection = params.collection
    ? settings.collections.find((c) => c.name === params.collection) ||
      settings.collections[0]
    : settings.collections[0]

  const currentFile = params.file ? params.file : ''

  /**
   * Return all the components for the current collection
   */
  const components = !params.collection ? [] : currentCollection.blocks

  /**
   * Returns the data structure for a component to be added to the editor
   * @param componentName - The component we want to create
   */
  const createComponent = (componentName: string) => {
    const component = components?.find(
      (c: BlockType) => c.name === componentName
    )

    if (!component) return undefined

    let attributes: any[] = []

    component?.fields?.forEach((f) => {
      attributes.push(generateComponentProp(f))
    })

    const c = {
      id: uuidv4(),
      type: 'mdxJsxFlowElement',
      attributes,
      reactChildren: [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
      children: [{ text: '' }],
      name: component.name,
    }

    return c
  }

  /**
   * Returns the prop schema for the specified component
   * @param componentName - The component we want to get the schema for
   */
  const getSchema = (componentName: string) => {
    const component = components?.find(
      (c: BlockType) => c.name === componentName
    )

    if (!component) return undefined

    return component.fields
  }

  return {
    ...settings,
    components,
    currentCollection,
    currentFile,
    createComponent,
    getSchema,
  }
}

const CMSContextProvider = ctxt.Provider

/**
 * Context containing all user-set settings for the CMs
 */
export const CMSProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: NextCMSContext['settings']
}): JSX.Element => {
  return (
    <CMSContextProvider value={{ settings }}>{children}</CMSContextProvider>
  )
}
