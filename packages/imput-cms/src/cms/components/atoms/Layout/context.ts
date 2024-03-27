import React from 'react'

export type ContextProps = {
  navbarHeight: number
}

export const LayoutContext = React.createContext({} as ContextProps)

export const useLayout = () => React.useContext(LayoutContext)
