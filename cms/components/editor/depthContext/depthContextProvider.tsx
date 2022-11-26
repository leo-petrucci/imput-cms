import React, { createContext, useContext, useState } from 'react'

type DepthState = { id: string }[]

export type IDepthContext = [
  DepthState,
  React.Dispatch<React.SetStateAction<DepthState>>
]

const DepthContext = createContext([[], () => null] as IDepthContext)

export const useEditorDepth = () => {
  const [depthArray, setDepthArray] = useContext(DepthContext)

  const addElement = (id: string) => {
    setDepthArray([{ id }, ...depthArray])
  }

  const removeElement = (id: string) => {
    setDepthArray(depthArray.filter((d) => d.id !== id))
  }

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

export const DepthProvider = ({ children }: { children: React.ReactNode }) => {
  const [depth, setDepth] = useState<DepthState>([])
  return (
    <DepthContext.Provider value={[depth, setDepth]}>
      {children}
    </DepthContext.Provider>
  )
}
