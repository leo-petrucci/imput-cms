import * as React from 'react'

import { cn } from '../lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'imp-flex imp-min-h-[80px] imp-w-full imp-rounded-md imp-border imp-border-input imp-bg-background imp-px-3 imp-py-2 imp-text-sm imp-ring-offset-background placeholder:imp-text-muted-foreground focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-cursor-not-allowed disabled:imp-opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
