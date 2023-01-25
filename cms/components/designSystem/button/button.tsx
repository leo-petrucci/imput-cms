import { blackA } from '@radix-ui/colors'
import { keyframes } from '@stitches/react'
import { rest } from 'lodash'
import React from 'react'
import { styled } from 'stitches.config'

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(359deg)' },
})

const StyledButton = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  lineHeight: 1,
  fontWeight: 500,
  cursor: 'pointer',

  '& > #loadingContainer': {
    color: '$primary-700',
    animation: `${spin} 1s cubic-bezier(0.6, 0, 0.4, 1) infinite`,
  },

  variants: {
    size: {
      normal: {
        padding: '$3 $4',
        fontSize: '$base',
      },
    },

    variant: {
      primary: {
        backgroundColor: '$primary-100',
        color: '$primary-700',
        '&:hover': { backgroundColor: '$primary-200' },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'normal',
  },
})

const Button = ({
  children,
  onClick,
  loading,
  ...rest
}: React.ComponentProps<typeof StyledButton> & { loading?: boolean }) => {
  const [internalLoading, setLoading] = React.useState(false)

  return (
    <StyledButton
      {...rest}
      onClick={async (e) => {
        if (onClick) {
          const onClickIsPromise = onClick.constructor.name === 'AsyncFunction'
          if (onClickIsPromise) setLoading(true)
          await onClick?.(e)
          if (onClickIsPromise) setLoading(false)
        }
      }}
    >
      {internalLoading || loading ? (
        <span style={{ height: 20 }} id="loadingContainer">
          <svg
            id="loading"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <path
              d="M168,40.7a96,96,0,1,1-80,0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="28"
            ></path>
          </svg>
        </span>
      ) : (
        <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
      )}
    </StyledButton>
  )
}

export default Button
