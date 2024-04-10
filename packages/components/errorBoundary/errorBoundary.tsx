import React from 'react'
import {
  ErrorBoundary as Eb,
  ErrorBoundaryProps,
  FallbackProps,
} from 'react-error-boundary'

const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div
      role="alert"
      className="imp-px-2 imp-py-2 imp-rounded-md imp-bg-destructive/10 imp-text-destructive imp-not-prose"
    >
      <p className="imp-text-sm imp-font-medium">Something went wrong:</p>
      <pre className="imp-text-sm imp-whitespace-normal imp-leading-[140%]">
        {error.message}
      </pre>
    </div>
  )
}

const ErrorBoundary = (
  props: Omit<ErrorBoundaryProps, 'children'> &
    Partial<ErrorBoundaryProps['fallbackRender']> & { children: JSX.Element }
) => {
  return (
    // @ts-ignore
    <Eb fallbackRender={ErrorFallback} {...props}>
      {props.children}
    </Eb>
  )
}

export default ErrorBoundary
