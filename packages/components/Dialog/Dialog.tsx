'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from '../Icon'

import { cn } from '../lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'imp-fixed imp-inset-0 imp-bg-black/80  data-[state=open]:imp-animate-in data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=open]:imp-fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onCloseClick?: () => void
    showOverlay?: boolean
  }
>(({ className, children, onCloseClick, ...props }, ref) => {
  const { showOverlay = true, ...rest } = props
  return (
    <DialogPortal>
      {showOverlay && <DialogOverlay />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'imp-fixed imp-left-[50%] imp-top-[50%] imp-w-full imp-max-w-lg imp-translate-x-[-50%] imp-translate-y-[-50%] imp-gap-4 imp-border imp-bg-background imp-p-6 imp-shadow-lg imp-duration-200 data-[state=open]:imp-animate-in data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=open]:imp-fade-in-0 data-[state=closed]:imp-zoom-out-95 data-[state=open]:imp-zoom-in-95 data-[state=closed]:imp-slide-out-to-left-1/2 data-[state=closed]:imp-slide-out-to-top-[48%] data-[state=open]:imp-slide-in-from-left-1/2 data-[state=open]:imp-slide-in-from-top-[48%] sm:imp-rounded-lg',
          className
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close
          onClick={onCloseClick}
          className="imp-absolute imp-right-4 imp-top-4 imp-rounded-sm imp-opacity-70 imp-ring-offset-background imp-transition-opacity hover:imp-opacity-100 focus:imp-outline-none focus:imp-ring-2 focus:imp-ring-ring focus:imp-ring-offset-2 disabled:imp-pointer-events-none data-[state=open]:imp-bg-accent data-[state=open]:imp-text-muted-foreground"
        >
          <X className="imp-h-4 imp-w-4" />
          <span className="imp-sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'imp-flex imp-flex-col imp-space-y-1.5 imp-text-center sm:imp-text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'imp-flex imp-flex-col-reverse sm:imp-flex-row sm:imp-justify-end sm:imp-space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'imp-text-lg imp-font-semibold imp-leading-none imp-tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('imp-text-sm imp-text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
