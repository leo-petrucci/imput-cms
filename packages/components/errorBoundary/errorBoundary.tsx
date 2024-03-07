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
      className="px-2 py-2 rounded-md bg-destructive/10 text-destructive not-prose"
    >
      <p className="text-sm font-medium">Something went wrong:</p>
      <pre className="text-sm whitespace-normal leading-[140%]">
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
