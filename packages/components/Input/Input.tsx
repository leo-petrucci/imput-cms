import React from 'react'
import { cn } from '../lib/utils'
import { Separator } from '../Separator'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: JSX.Element | string
  endAdornment?: JSX.Element | string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    const hasAdornment = Boolean(startAdornment) || Boolean(endAdornment)
    return (
      <>
        {hasAdornment ? (
          <div
            className={cn(
              `imp-flex imp-items-center imp-justify-center imp-h-10 imp-rounded-md imp-border-t imp-border-b imp-border-input imp-bg-transparent imp-ring-offset-background focus-within:imp-ring-2 focus-within:imp-ring-ring focus-within:imp-ring-offset-2  data-[disabled=true]:imp-cursor-not-allowed data-[disabled=true]:imp-opacity-50 imp-border-l imp-border-r`
            )}
            data-disabled={props.disabled}
          >
            {startAdornment && (
              <div
                className={cn(
                  'imp-flex imp-justify-center imp-items-center imp-text-muted-foreground imp-pr-3 imp-select-none imp-self-stretch',
                  typeof startAdornment === 'string' &&
                    'imp-bg-muted/70 imp-pl-3 imp-border-r imp-border-input imp-text-sm'
                )}
              >
                {startAdornment}
              </div>
            )}
            <input
              type={type}
              id={`input-${props.name}`}
              data-testid={`input-${props.name}`}
              className={cn(
                'imp-flex imp-mx-2 imp-h-10 imp-w-full imp-border-t imp-border-b imp-border-input imp-bg-background imp-py-2 imp-text-sm !imp-ring-offset-background file:imp-border-0 file:imp-bg-transparent file:imp-text-sm file:imp-font-medium placeholder:imp-text-muted-foreground focus-visible:imp-outline-none',
                className
              )}
              ref={ref}
              {...props}
            />
            {endAdornment && (
              <div
                className={cn(
                  'imp-flex imp-justify-center imp-items-center imp-text-muted-foreground imp-pl-3 imp-select-none imp-self-stretch',
                  typeof endAdornment === 'string' &&
                    'imp-bg-muted/70 imp-pr-3 imp-border-l imp-border-input imp-text-sm'
                )}
              >
                {endAdornment}
              </div>
            )}
          </div>
        ) : (
          <input
            type={type}
            id={`input-${props.name}`}
            data-testid={`input-${props.name}`}
            className={cn(
              'imp-flex imp-h-10 imp-w-full imp-rounded-md imp-border imp-border-input imp-bg-background imp-px-3 imp-py-2 imp-text-sm !imp-ring-offset-background file:imp-border-0 file:imp-bg-transparent file:imp-text-sm file:imp-font-medium placeholder:imp-text-muted-foreground focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-cursor-not-allowed disabled:imp-opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    )
  }
)

Input.displayName = 'Input'

export { Input }
