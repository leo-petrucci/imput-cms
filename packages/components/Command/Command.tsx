'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '../lib/utils'
import { MagnifyingGlass } from '../Icon'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'imp-flex imp-h-full imp-w-full imp-flex-col imp-overflow-hidden imp-rounded-md imp-bg-popover imp-text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="imp-flex imp-items-center imp-border-b imp-px-3"
    cmdk-input-wrapper=""
  >
    <MagnifyingGlass className="imp-mr-2 imp-h-4 imp-w-4 imp-shrink-0 imp-opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'imp-flex imp-h-11 imp-w-full imp-rounded-md imp-bg-transparent !imp-ring-transparent !imp-ring-offset-transparent imp-py-3 imp-text-sm imp-outline-none placeholder:imp-text-muted-foreground disabled:imp-cursor-not-allowed disabled:imp-opacity-50',
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'imp-max-h-[300px] imp-overflow-y-auto imp-overflow-x-hidden',
      className
    )}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="imp-py-6 imp-text-center imp-text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'imp-overflow-hidden imp-p-1 imp-text-foreground [&_[cmdk-group-heading]]:imp-px-2 [&_[cmdk-group-heading]]:imp-py-1.5 [&_[cmdk-group-heading]]:imp-text-xs [&_[cmdk-group-heading]]:imp-font-medium [&_[cmdk-group-heading]]:imp-text-muted-foreground',
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('imp--mx-1 imp-h-px imp-bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'imp-relative imp-flex imp-cursor-default imp-select-none imp-items-center imp-rounded-sm imp-px-2 imp-py-1.5 imp-text-sm imp-outline-none aria-selected:imp-bg-accent aria-selected:imp-text-accent-foreground data-[disabled]:imp-pointer-events-none data-[disabled]:imp-opacity-50',
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'imp-ml-auto imp-text-xs imp-tracking-widest imp-text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
