import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import ctxt, { NextCMSContext } from './context'

/**
 * Returns the CMS settings object
 */
export const useCMS = () => {
  const { settings } = useContext(ctxt)
  const router = useRouter()

  const [collection, currentFile] = router.query.nextcms as string[]
  const currentCollection =
    settings.collections.find((c) => c.name === collection) ||
    settings.collections[0]

  /**
   * Return all the components for the current collection
   */
  const getComponents = () => {
    if (!collection) return []

    return currentCollection.blocks
  }

  /**
   * Returns the data structure for a component to be added to the editor
   * @param componentName - The component we want to create
   */
  const createComponent = (componentName: string) => {
    const components = getComponents()
    const component = components?.find((c) => (c.name = componentName))

    if (!component) return undefined

    let attributes: any[] = []

    component?.fields?.forEach((f) => {
      switch (f.type.widget) {
        case 'date':
        case 'datetime':
        case 'image':
        case 'string':
          attributes.push({
            name: f.name,
            type: 'mdxJsxAttribute',
            value: f.type.default || '',
          })
          break
        case 'boolean':
        case 'json':
          attributes.push({
            name: f.name,
            type: 'mdxJsxAttribute',
            value: {
              value: f.type.default || undefined,
            },
          })
          break
      }
    })

    return {
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
  }

  return {
    ...settings,
    getComponents,
    currentCollection,
    currentFile,
    createComponent,
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
