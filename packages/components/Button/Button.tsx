import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const buttonVariants = cva(
  'imp-inline-flex imp-items-center imp-justify-center imp-whitespace-nowrap imp-rounded-md imp-text-sm imp-font-medium imp-transition-colors focus-visible:imp-outline-none focus-visible:imp-ring-1 focus-visible:imp-ring-ring disabled:imp-pointer-events-none disabled:imp-opacity-50',
  {
    variants: {
      variant: {
        default:
          'imp-bg-primary imp-text-primary-foreground imp-shadow hover:imp-bg-primary/90',
        destructive:
          'imp-bg-destructive imp-text-destructive-foreground imp-shadow-sm hover:imp-bg-destructive/90',
        outline:
          'imp-border imp-border-input imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground',
        secondary:
          'imp-bg-secondary imp-text-secondary-foreground imp-shadow-sm hover:imp-bg-secondary/80',
        ghost: 'hover:imp-bg-accent hover:imp-text-accent-foreground',
        link: 'imp-text-primary imp-underline-offset-4 hover:imp-underline',
      },
      size: {
        default: 'imp-h-9 imp-px-4 imp-py-2',
        sm: 'imp-h-8 imp-rounded-md imp-px-3 imp-text-xs',
        lg: 'imp-h-10 imp-rounded-md imp-px-8',
        icon: 'imp-h-9 imp-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
