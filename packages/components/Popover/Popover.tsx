'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '../lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'imp-w-72 imp-rounded-md imp-border imp-bg-popover imp-p-4 imp-text-popover-foreground imp-shadow-md imp-outline-none data-[state=open]:imp-animate-in data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=open]:imp-fade-in-0 data-[state=closed]:imp-zoom-out-95 data-[state=open]:imp-zoom-in-95 data-[side=bottom]:imp-slide-in-from-top-2 data-[side=left]:imp-slide-in-from-right-2 data-[side=right]:imp-slide-in-from-left-2 data-[side=top]:imp-slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
