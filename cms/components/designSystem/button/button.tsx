import { blackA } from '@radix-ui/colors'
import { styled } from 'stitches.config'

const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  lineHeight: 1,
  fontWeight: 500,
  cursor: 'pointer',

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

export default Button
