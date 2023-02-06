import React from 'react'
import {
  ErrorBoundary as Eb,
  ErrorBoundaryProps,
  FallbackProps,
} from 'react-error-boundary'
import Box from 'cms/components/designSystem/box'
import { styled } from 'stitches.config'

const StyledPre = styled('pre', {})

const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <Box
      role="alert"
      css={{
        padding: '$1 $3',
        borderRadius: '$md',
        backgroundColor: '$red-100',
        color: '$red-700',

        '& pre': {
          fontSize: '$sm',
          whiteSpace: 'normal',
          lineHeight: '140%',
        },

        '& p': {
          fontSize: '$sm',
          fontWeight: '$medium',
        },
      }}
    >
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </Box>
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
