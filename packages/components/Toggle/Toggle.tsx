'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const toggleVariants = cva(
  'imp-inline-flex imp-items-center imp-justify-center imp-rounded-md imp-text-sm imp-font-medium imp-transition-colors hover:imp-bg-muted hover:imp-text-muted-foreground focus-visible:imp-outline-none focus-visible:imp-ring-1 focus-visible:imp-ring-ring disabled:imp-pointer-events-none disabled:imp-opacity-50 data-[state=on]:imp-bg-accent data-[state=on]:imp-text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'imp-border imp-border-input imp-bg-transparent imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground',
      },
      size: {
        default: 'imp-h-9 imp-px-3',
        sm: 'imp-h-8 imp-px-2',
        lg: 'imp-h-10 imp-px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle as default, toggleVariants }
