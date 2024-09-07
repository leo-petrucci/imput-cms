import { useMeasure } from '@imput/utils'
import React from 'react'
import { LayoutContext } from './context'

type LayoutProps = {
  navbar: React.ReactNode
  children:
    | React.ReactNode
    | ((props: { navbarHeight: number }) => React.ReactNode)
}

const Layout = ({ children, navbar }: LayoutProps) => {
  const [ref, { height }] = useMeasure()

  return (
    <LayoutContext.Provider
      value={{
        navbarHeight: height,
      }}
    >
      <div className="imp-flex imp-flex-col imp-min-h-screen imp-max-h-screen">
        <div ref={ref} className="imp-border-b imp-border-border imp-flex">
          <div className="imp-max-w-[1920px] imp-m-auto imp-w-full imp-px-4 imp-flex">
            {navbar}
          </div>
        </div>
        <div
          className="imp-overflow-y-auto imp-flex-1 imp-flex imp-max-w-[1920px] imp-w-full imp-m-auto"
          style={{
            maxHeight: `calc(100vh - ${height}px)`,
          }}
        >
          {typeof children === 'function'
            ? children({ navbarHeight: height })
            : children}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

export { Layout }
