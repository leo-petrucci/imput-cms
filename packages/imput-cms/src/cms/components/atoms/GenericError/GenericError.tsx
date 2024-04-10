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
      className="imp-px-2 py-2 imp-rounded-md imp-bg-destructive/10 imp-text-destructive imp-not-prose"
    >
      <p className="imp-text-sm imp-font-medium">{title}</p>
      <p className="imp-text-sm imp-whitespace-normal imp-leading-[140%]">
        {children}
      </p>
    </div>
  )
}

export { GenericError }
