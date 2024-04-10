import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const badgeVariants = cva(
  'imp-inline-flex imp-items-center imp-rounded-full imp-border imp-px-2.5 imp-py-0.5 imp-text-xs imp-font-semibold imp-transition-colors focus:imp-outline-none focus:imp-ring-2 focus:imp-ring-ring focus:imp-ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'imp-border-transparent imp-bg-primary imp-text-primary-foreground hover:imp-bg-primary/80',
        secondary:
          'imp-border-transparent imp-bg-secondary imp-text-secondary-foreground hover:imp-bg-secondary/80',
        destructive:
          'imp-border-transparent imp-bg-destructive imp-text-destructive-foreground hover:imp-bg-destructive/80',
        outline: 'imp-text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
