import React from 'react'

/**
 * A generic error component
 */
const GenericError = ({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div
      role="alert"
      className="px-2 py-2 rounded-md bg-destructive/10 text-destructive not-prose"
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm whitespace-normal leading-[140%]">{children}</p>
    </div>
  )
}

export { GenericError }
