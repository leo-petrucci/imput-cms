import React from 'react'
import { cn } from '../lib/utils'

export type SelectProps = React.InputHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<
  HTMLInputElement & {
    Controlled: JSX.Element
  },
  SelectProps
>(({ ...props }: SelectProps, ref: any) => (
  <select
    {...props}
    className={cn(
      'imp-flex imp-h-10 imp-w-full imp-rounded-md imp-border imp-border-input imp-bg-background imp-px-3 imp-py-2 imp-text-sm imp-ring-offset-background file:imp-border-0 file:imp-bg-transparent file:imp-text-sm file:imp-font-medium placeholder:imp-text-muted-foreground focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-cursor-not-allowed disabled:imp-opacity-50',
      props.className
    )}
    ref={ref}
  />
))

export { Select }
