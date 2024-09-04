import React, { createContext, useContext, useMemo, useState } from 'react'

/**
 * These contexts and hooks allow the rendering of the nested MDX modals.
 * It's a bit confusing, but it works and it probably shouldn't be touched.
 */

type DepthState = { id: string }[]

export type IDepthContext = [
  DepthState,
  React.Dispatch<React.SetStateAction<DepthState>>,
]

const DepthContext = createContext([[], () => null] as IDepthContext)

/**
 * Hook that returns methods and info related to item depth
 */
export const useEditorDepth = () => {
  const [depthArray, setDepthArray] = useContext(DepthContext)

  /**
   * Add an element to the depth array
   */
  const addElement = (id: string) => {
    setDepthArray([{ id }, ...depthArray])
  }

  /**
   * Remove an element from the depth array
   */
  const removeElement = (id: string) => {
    setDepthArray(depthArray.filter((d) => d.id !== id))
  }

  /**
   * Returns the depth of an element with a specific `id`
   */
  const getDepth = (id: string) => {
    return depthArray.map((d) => d.id).findIndex((dId) => dId === id)
  }

  return {
    depthArray,
    addElement,
    getDepth,
    removeElement,
  }
}

/**
 * Contains information about all the panels currently open. This allows us to
 * give them cool effects with CSS as well as only doing certain actions depending on depth.
 */
export const DepthProvider = ({ children }: { children: React.ReactNode }) => {
  const [depth, setDepth] = useState<DepthState>([])

  return (
    <DepthContext.Provider value={[depth, setDepth]}>
      {children}
    </DepthContext.Provider>
  )
}

export type ISingleDepthContext = {
  id: string
}

const SingleDepthContext = createContext({} as ISingleDepthContext)

/**
 * Hook that contains methods related to the depth of the specific item
 */
export const useElementDepth = () => {
  const [depthArray] = useContext(DepthContext)
  const { id } = useContext(SingleDepthContext)

  /**
   * True if this is the highest rendered element
   */
  const isHighestDepth = useMemo(() => {
    if (depthArray.length === 0) return true
    const lastElement = depthArray[depthArray.length - 1]
    return lastElement.id === id
  }, [depthArray])

  return { isHighestDepth }
}

/**
 * This allows us to pass down the id of the current element.
 *
 * We use it to not render certain portaled elements like: ComponentsModal, Command bar, etc
 */
export const SingleDepthProvider = ({
  id,
  children,
}: ISingleDepthContext & { children: JSX.Element }) => {
  return (
    <SingleDepthContext.Provider value={{ id }}>
      {children}
    </SingleDepthContext.Provider>
  )
}
