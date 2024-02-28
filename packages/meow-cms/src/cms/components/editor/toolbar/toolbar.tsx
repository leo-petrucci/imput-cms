import React from 'react'

interface BaseProps {
  className?: string
  [key: string]: unknown
}

const Toolbar = ({
  className,
  ...props
}: React.PropsWithChildren<BaseProps>) => (
  <div {...props} className="top-0 sticky bg-white p-2 mb-2 flex" />
)

export default Toolbar
