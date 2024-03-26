import { useMeasure } from '@meow/utils'
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
      <div className="flex flex-col min-h-screen max-h-screen">
        <div ref={ref} className="border-b border-border flex">
          <div className="max-w-[1920px] m-auto w-full py-2 px-4">{navbar}</div>
        </div>
        <div
          className="overflow-y-auto flex-1 flex max-w-[1920px] w-full m-auto"
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
