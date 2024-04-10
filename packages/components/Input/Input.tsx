import React from 'react'
import { cn } from '../lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        id={`input-${props.name}`}
        data-testid={`input-${props.name}`}
        className={cn(
          'imp-flex imp-h-10 imp-w-full imp-rounded-md imp-border imp-border-input imp-bg-background imp-px-3 imp-py-2 imp-text-sm imp-ring-offset-background file:imp-border-0 file:imp-bg-transparent file:imp-text-sm file:imp-font-medium placeholder:imp-text-muted-foreground focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-cursor-not-allowed disabled:imp-opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
