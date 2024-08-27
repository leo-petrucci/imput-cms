'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '../lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'imp-overflow-hidden imp-rounded-md imp-bg-primary imp-px-3 imp-py-1.5 imp-text-xs imp-text-primary-foreground imp-animate-in imp-fade-in-0 imp-zoom-in-95 data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=closed]:imp-zoom-out-95 data-[side=bottom]:imp-slide-in-from-top-2 data-[side=left]:imp-slide-in-from-right-2 data-[side=right]:imp-slide-in-from-left-2 data-[side=top]:imp-slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
